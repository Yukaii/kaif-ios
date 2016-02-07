import {
  REQUEST_ARTICLES,
  REQUEST_ZONE_ARTICLES,
  VOTE_FOR_ARTICLE,
  RELOAD_ARTICLES,
  REQUEST_USER_ARTICLES,
  DELETE_ARTICLE,
  LOGOUT
} from '../actions/article';

import * as _ from 'underscore';

let initialState = {
  userSubmittedArticleIds: [],
  articleIdArray: {hot: [], latest: []},
  zoneArticleIdArray: {},
  articleHash: {},
}

let changeVoteCount = (prevVoteState, curVoteState) => {
  if (prevVoteState == curVoteState) {
    return 0;
  } else if ( (prevVoteState == 'EMPTY' || typeof prevVoteState === 'undefined') && curVoteState == 'UP' ) {
    return 1;
  } else if (prevVoteState == 'UP' && curVoteState == 'EMPTY') {
    return -1;
  }

  // should never run this line :p
  alert(`${prevVoteState} => ${curVoteState}`);
}

export default function articles(state={...initialState, zoneArticles: null}, action) {
  switch(action.type) {

    case REQUEST_ARTICLES:
      var newState = {...state};
      var articleIds = action.articles.map(article => article.articleId);

      if (!_.isEqual(state.articleIdArray[action.articleType], articleIds)) {
        // concat to artitle id array
        if (typeof newState.articleIdArray[action.articleType] === 'undefined') {
          newState.articleIdArray[action.articleType] = []
        }

        newState.articleIdArray[action.articleType] = newState.articleIdArray[action.articleType].concat(articleIds)

        // update to article hash
        if (typeof newState.articleHash === 'undefined') {
          newState.articleHash = {}
        }
        for (let i = 0; i < action.articles.length; i++) {
          newState.articleHash[action.articles[i].articleId] = action.articles[i];
        }
      }

      return newState;

    case REQUEST_ZONE_ARTICLES:

      var zoneName = action.zone;
      var newState = {...state}
      var articleIds = action.articles.map(article => article.articleId);

      if (!newState.zoneArticleIdArray[zoneName]) {newState.zoneArticleIdArray[zoneName] = {hot: [], latest: []}}
      if (!_.isEqual(newState.zoneArticleIdArray[zoneName][action.articleType], articleIds)) {
        newState.zoneArticleIdArray[zoneName][action.articleType]
           = newState.zoneArticleIdArray[zoneName][action.articleType].concat(articleIds);

        for (let i = 0; i < action.articles.length; i++) {
          newState.articleHash[action.articles[i].articleId] = action.articles[i];
        }
      }

      return newState;

    case VOTE_FOR_ARTICLE:
      var newState = {...state};
      var { voteState, articleId, articleType, zone } = action;
      var newArticle = newState.articleHash[articleId];

      newArticle.upVote += changeVoteCount(newArticle.vote.voteState, voteState);
      newArticle.vote.voteState = voteState;
      newState.articleHash[articleId] = newArticle;

      return newState;

    case RELOAD_ARTICLES:
      var { articleType, zone } = action;
      var newState = {...state};
      if (zone) {
        newState.zoneArticleIdArray[zone][articleType] = [];
      } else {
        newState.articleIdArray[articleType] = []
      }
      return newState;
    case LOGOUT:
      return initialState;

    case REQUEST_USER_ARTICLES:
      if (action.articles.length == 0) { return state; }

      var newState = {...state};
      var articleIds = action.articles.map(article => article.articleId);

      if (!_.isEqual(newState.userSubmittedArticleIds, articleIds)) {
        newState.userSubmittedArticleIds = newState.userSubmittedArticleIds.concat(articleIds);

        for (let i = 0; i < action.articles.length; i++) {
          newState.articleHash[action.articles[i].articleId] = action.articles[i];
        }
      }
      return newState;

    case DELETE_ARTICLE:
      var newState = {...state};
      delete newState.articleHash[action.articleId];

      for (let articleType in newState.articleIdArray) {
        newState.articleIdArray[articleType] = newState.articleIdArray[articleType].filter(art => art.articleId != action.articleId);
      }

      for (let zone in newState.zoneArticleIdArray) {
        for (let articleType in newState.zoneArticleIdArray[zone]) {
          newState.zoneArticleIdArray[zone][articleType] = newState.zoneArticleIdArray[zone][articleType].filter(art => art.articleId != action.articleId);
        }
      }

      return newState;
    default:
      return state;
  }
}
