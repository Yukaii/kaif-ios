import {
  LinkingIOS,
  AsyncStorage,
} from 'react-native';

import config from '../config/config';
import qs from 'shitty-qs';
import * as utils from './utils'

const ACCESS_TOKEN_STORAGE_KEY = 'ACCESS_TOKEN_STORAGE_KEY';
const ACCESS_TOKEN_URL = 'https://kaif.io/oauth/access-token';
const OAUTH_REDIRECT_URI = 'kaiifios://oauth_callback';
const API_BASE_URL = 'https://kaif.io/v1'

getAccessToken = () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(ACCESS_TOKEN_STORAGE_KEY).then(access_token => {
      resolve(access_token);
    });
  });
}

getAuthorizeUrl = (state) => {
  var url = [
    `https://kaif.io/oauth/authorize?`,
    `client_id=${config.clientId}`,
    '&response_type=code',
    `&state=${state}`,
    `&scope=public feed article vote user debate`,
    `&redirect_uri=${OAUTH_REDIRECT_URI}`
  ].join('');

  return encodeURI(url);
}

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

  var postBody = {
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code: params.code,
    redirect_uri: OAUTH_REDIRECT_URI,
    grant_type: 'authorization_code'
  };

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
      callback(data.access_token);
    });
  });
}


requestHotArticles = () => {
  // simply block
  return new Promise((resolve, reject) => {
    getAccessToken().then(access_token => {
      fetch(apiEndpoint('article/hot'), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then(response => response.json()).then(data => resolve(data));
    })
  });
}

apiEndpoint = (endpoint) => {
  return [API_BASE_URL, endpoint].join('/');
}

KaifAPI = {
  getAccessToken: getAccessToken,
  getAuthorizeUrl: getAuthorizeUrl,
  oauthLogin: oauthLogin,
  requestHotArticles: requestHotArticles,
  apiEndpoint: apiEndpoint
}

export default KaifAPI;
