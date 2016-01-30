import {
  LinkingIOS,
  AsyncStorage,
} from 'react-native';

import config from '../config/config';
import qs from 'shitty-qs';
import * as utils from './utils'
import Keychain from 'react-native-keychain';

const ACCESS_TOKEN_STORAGE_KEY = 'ACCESS_TOKEN_STORAGE_KEY';
const USERNAME_KEY = 'USERNAME_KEY';
const ACCESS_TOKEN_URL = 'https://kaif.io/oauth/access-token';
const OAUTH_REDIRECT_URI = 'kaiifios://oauth_callback';
const API_BASE_URL = 'https://kaif.io/v1'

/**
 * A function that fetch access_token from AsyncStorage
 * @return { Promise } resolve access_token{string} object, might be null
 */
getAccessToken = () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(ACCESS_TOKEN_STORAGE_KEY).then(access_token => {
      resolve(access_token);
    });
  });
}

getUserName = () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(USERNAME_KEY).then(username => {
      resolve(username);
    });
  });
}

/**
 * Generate authorize url from state
 * @param  {string} state - a random generate string
 * @return {string} encoded URI
 */
getAuthorizeUrl = (state) => {
  let queryString = utils.toQueryString({
    'client_id': config.clientId,
    'response_type': 'code',
    'state': state,
    'scope': 'public user feed article debate vote',
    'redirect_uri': OAUTH_REDIRECT_URI
  });

  return `https://kaif.io/oauth/authorize?${queryString}`;
}

/**
 * A function starts kaif.io OAuth Proccess
 * @example
 * KaifAPI.getAccessToken().then(access_token => {
 *   if (access_token == null) {
 *     KaifAPI.oauthLogin(access_token => {
 *       alert(access_token)
 *     })
 *   }
 * });
 *
 * @param  {Function} callback []
 */
oauthLogin = (callback) => {
  LinkingIOS.addEventListener('url', oauthCallbackHandler(callback));
  LinkingIOS.openURL(getAuthorizeUrl(utils.makeId()));
}

oauthCallbackHandler = (callback) => {
  return (event) => {
    return oauthCallback(event, callback);
  }
}

oauthCallback = (event, callback) => {
  var queryStart = event.url.indexOf('?')
  var params = qs(event.url.slice(queryStart+1, -1));

  LinkingIOS.removeEventListener('url', oauthCallbackHandler);

  fetch(ACCESS_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Accept-Charset': 'utf-8',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    // Stangely can't post with
    // JSON.stringify({
    //   client_id: config.clientId,
    //   client_secret: config.clientSecret,
    //   code: params.code,
    //   redirect_uri: encodeURI(OAUTH_REDIRECT_URI),
    //   grant_type: 'authorization_code'
    // })
    //
    body:  `client_id=${config.clientId}&client_secret=${config.clientSecret}&code=${params.code}&redirect_uri=${encodeURI(OAUTH_REDIRECT_URI)}&grant_type=authorization_code`
  }).then(response => response.json()).then(data => {
    AsyncStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, data.access_token).then(() => {
      // save username
      requestBasicUserProfile().then(profileData => {
        if (profileData.data) {
          AsyncStorage.setItem(USERNAME_KEY, profileData.data.username).then(() => {
            // save username / access_token to keychain
            Keychain.setGenericPassword(profileData.data.username, data.access_token).then(() => {
              callback(data.access_token);
            })
          });

        }
      })
    });
  }).catch(error => error);
}

requestAPI = (endpoint, body=null, method='GET') => {
  let checkStatus = (response) => {
    if (response.status >= 200 && response.status < 300) {
      return response
    } else {
      var error = new Error(response.statusText)
      error.response = response
      throw error
    }
  }

  return new Promise((resolve, reject) => {
    getAccessToken().then(access_token => {
      fetch(apiEndpoint(endpoint), {
        method: method,
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json;charset=UTF-8'
        },
        body: body
      }).then(checkStatus).then(response => response.json()).then(data => resolve(data)).catch(error => reject(error));
    });
  });
}

requestArticle = (articleId) => {
  return requestAPI(`article/${articleId}`);
}

requestArticleCanDelete = (articleId) => {
  return new Promise((resolve, reject) => {
    getUserName().then(username => {
      requestAPI(`article/${articleId}/can-delete?username=${username}`).then(data => resolve({...data, username: username})).catch(e => reject(e))
    }).catch(e => reject(e));
  })
}

requestDeleteArticle = (articleId) => {
  return requestAPI(`article/${articleId}`, null, 'DELETE');
}

/**
 * KaifAPI hot articles endpoint
 * @example
 * KaifAPI.requestHotArticles().then(data => alert(data));
 * @return {Promise} resolve JSON data
 */
requestHotArticles = (startArticleId=null) => {
  return startArticleId ?
    requestAPI(`article/hot?start-article-id=${startArticleId}`) :
    requestAPI(`article/hot`);
}

requestLatestArticles = (startArticleId=null) => {
  return startArticleId ?
    requestAPI(`article/latest?start-article-id=${startArticleId}`) :
    requestAPI(`article/latest`)
}

requestUserArticles = (username, startArticleId=null) => {
  return startArticleId ?
    requestAPI(`article/user/${username}/submitted?start-article-id=${startArticleId}`) :
    requestAPI(`article/user/${username}/submitted`);
}

requestVotedArticles = (startArticleId=null) => {
  return startArticleId ?
    requestAPI(`article/voted?start-article-id=${startArticleId}`) :
    requestAPI(`article/voted`);
}

requestIfArticlesVoted = (articleIds) => {
  return requestAPI(`vote/article?${utils.toQueryString({'article-id': articleIds.join(',')})}`)
}

testAPI = () => {
  return new Promise((resolve, reject) => {
    requestAPI('echo/current-time').then(data => resolve(data)).catch(error => reject(error));
  });
}

requestZoneExternalLinkArticles = (zone) => {
  return requestAPI(`article/zone/${zone}/external-link`);
}

requestIfExternalExists = (zone, url) => {
  return requestAPI(`article/zone/${zone}/external-link/exist?url=${url}`);
}

requestZoneHotArticles = (zone, startArticleId=null) => {
  return startArticleId ?
    requestAPI(`article/zone/${zone}/hot?start-article-id=${startArticleId}`) :
    requestAPI(`article/zone/${zone}/hot`);
}

requestZoneLatestArticles = (zone, startArticleId=null) => {
  return startArticleId ?
    requestAPI(`article/zone/${zone}/latest?start-article-id=${startArticleId}`) :
    requestAPI(`article/zone/${zone}/latest`);
}

requestUserSubmittedArticles = (username=null, startArticleId) => {
  return new Promise((resolve, reject) => {
    if (!username) {
      getUserName().then(username => {
        startArticleId ?
          requestAPI(`article/user/${username}/submitted?start-article-id=${startArticleId}`).then(data => resolve(data)).catch(error => reject(error)) :
          requestAPI(`article/user/${username}/submitted`).then(data => resolve(data)).catch(error => reject(error))
      })
    } else {
      startArticleId ?
          requestAPI(`article/user/${username}/submitted?start-article-id=${startArticleId}`).then(data => resolve(data)).catch(error => reject(error)) :
          requestAPI(`article/user/${username}/submitted`).then(data => resolve(data)).catch(error => reject(error))
    }
  });
}

requestArticleDebates = (articleId) => {
  return requestAPI(`debate/article/${articleId}/tree`);
}

requestZoneAll = () => {
  return requestAPI('zone/all');
}

requestBasicUserProfile = () => {
  return requestAPI('user/basic');
}

requestVoteForArticle = (articleId, voteState='UP') => {
  return requestAPI('vote/article', JSON.stringify({
    articleId: articleId,
    voteState: voteState
  }), 'POST');
}

requestVoteForDebate = (debateId, voteState='UP') => {
  return requestAPI('vote/debate', JSON.stringify({
    debateId: debateId,
    voteState: voteState
  }), 'POST');
}

requestDebate = (debateId) => {
  return requestAPI(`debate/${debateId}`);
}

requestCreateDebate = (articleId, parentDebateId, content) => {
  return requestAPI('debate', JSON.stringify({
    articleId: articleId,
    parentDebateId: parentDebateId,
    content: content
  }), 'PUT');
}

requestUpdateDebate = (debateId, content) => {
  return requestAPI(`debate/${debateId}/content`, {
    content: content
  }, 'POST');
}

/**
 * api endpoint url helper method
 * @param  {string} endpoint
 * @return {string}
 */
apiEndpoint = (endpoint) => {
  return [API_BASE_URL, endpoint].join('/');
}

logout = () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.clear().then(data => resolve(data)).catch(error => reject(error));
  });
}

KaifAPI = {
  getAccessToken: getAccessToken,
  getUserName: getUserName,
  getAuthorizeUrl: getAuthorizeUrl,
  oauthLogin: oauthLogin,
  testAPI: testAPI,
  requestArticle: requestArticle,
  requestArticleCanDelete: requestArticleCanDelete,
  requestHotArticles: requestHotArticles,
  requestLatestArticles: requestLatestArticles,
  requestZoneHotArticles: requestZoneHotArticles,
  requestZoneLatestArticles: requestZoneLatestArticles,
  requestArticleDebates: requestArticleDebates,
  requestUserSubmittedArticles: requestUserSubmittedArticles,
  requestIfArticlesVoted: requestIfArticlesVoted,
  requestZoneAll: requestZoneAll,
  requestBasicUserProfile: requestBasicUserProfile,
  requestVoteForArticle: requestVoteForArticle,
  requestVoteForDebate: requestVoteForDebate,
  requestCreateDebate: requestCreateDebate,
  requestUpdateDebate: requestUpdateDebate,
  apiEndpoint: apiEndpoint,
  logout: logout
}

export default KaifAPI;
