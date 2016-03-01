export const REQUEST_ARTICLES = 'REQUEST_ARTICLES';
export const REQUEST_ZONE_ARTICLES = 'REQUEST_ZONE_ARTICLES';
export const VOTE_FOR_ARTICLE = 'VOTE_FOR_ARTICLE';
export const RELOAD_ARTICLES = 'RELOAD_ARTICLES';
export const REQUEST_USER_ARTICLES = 'REQUEST_USER_ARTICLES';
export const LOGOUT = 'LOGOUT';
export const DELETE_ARTICLE = 'DELETE_ARTICLE';

import KaifAPI from '../utils/KaifAPI';

let fetchArticleVotes = (articles) => {
  return new Promise((resolve, reject) => {
    KaifAPI.requestArticlesVoteState(articles.map(_ => _.articleId)).then(voteData => {
      let newArticles = articles.map(art => {
        art.vote = {}
        if (!voteData.data || voteData.data.length == 0) { return art; }

        for(let i = 0, l = voteData.data.length; i < l; i++) {
          if (voteData.data[i].targetId == art.articleId) {
            art.vote = voteData.data[i];
          }
        }
        return art;
      });
      resolve(newArticles);
    });
  });
}

export function requestArticles(callback=null, lastArticleId=null, articleType="hot", zone=null) {
  if (zone == null) {
    let defaultAction =  (articleType=="latest") ? KaifAPI.requestLatestArticles : KaifAPI.requestHotArticles;
    return dispatch => {
      defaultAction(lastArticleId).then(data => {
        if (data.errors && data.errors.length > 0) {
          // dispatch error here
        }
        fetchArticleVotes(data.data).then(articles => {
          if(callback) {
            callback(articles);
          }

          dispatch({
            type: REQUEST_ARTICLES,
            articleType: articleType,
            articles: articles
          });
        });
      });
    }
  }
  else {
    let defaultAction =  (articleType=="latest") ? KaifAPI.requestZoneLatestArticles : KaifAPI.requestZoneHotArticles;
    return dispatch => {
      defaultAction(zone, lastArticleId).then(data => {
        if (data.errors && data.errors.length > 0) {
          // dispatch any error here
        }
        fetchArticleVotes(data.data).then(articles => {
          if(callback) {
            callback(articles);
          }
          dispatch({
            type: REQUEST_ZONE_ARTICLES,
            articleType: articleType,
            zone: zone,
            articles: articles
          });
        });
      });
    }
  }
}

export function voteForArticle(callback=null, articleId, voteState, zone) {
  return dispatch => {
    KaifAPI.requestVoteForArticle(articleId, voteState).then(r => {
      if (r.hasOwnProperty("data")) {
        dispatch({
          type: VOTE_FOR_ARTICLE,
          voteState: voteState,
          articleId: articleId,
          zone: zone
        });
        if (callback) { callback(r.data); }
      }
    });
  }
}

export function requestUserArticles(username=null, lastArticleId=null, callback=null) {
  return dispatch => {
    KaifAPI.requestUserSubmittedArticles(username, lastArticleId).then(r => {
      if (r.hasOwnProperty("data")) {
        fetchArticleVotes(r.data).then(articles => {
          dispatch({
            type: REQUEST_USER_ARTICLES,
            articles: articles
          });
          if (callback) { callback(articles); }
        });
      }
    });
  }
}

export function deleteArticle(articleId) {
  return dispatch => {
    KaifAPI.requestDeleteArticle(articleId).then(data => {
      dispatch({
        type: DELETE_ARTICLE,
        articleId: articleId
      });
    });
  }
}

export function reloadArticles(callback=null, articleType, zone=null) {
  return dispatch => {
    dispatch({
      type: RELOAD_ARTICLES,
      articleType: articleType,
      zone: zone
    });
    if (callback) { callback(); }
  }
}

export function logout(callback=null) {
  return dispatch => {
    dispatch({
      type: LOGOUT
    });
    KaifAPI.logout().then(data => callback(data)).catch(error => error);
  }
}
