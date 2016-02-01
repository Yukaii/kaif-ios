import {
  REQUEST_ARTICLES,
  REQUEST_ZONE_ARTICLES,
  VOTE_FOR_ARTICLE,
  RELOAD_ARTICLES,
  REQUEST_USER_ARTICLES,
  LOGOUT
} from '../actions/article';

import * as _ from 'underscore';

let initialState = {
  hot: [],
  latest: [],
  userSubmittedArticles: []
}

let changeVoteCount = (prevVoteState, curVoteState) => {
  if (prevVoteState == curVoteState) {
    return 0;
  }
  if ( (prevVoteState == 'EMPTY' || typeof prevVoteState === 'undefined') && curVoteState == 'UP' ) {
    return 1;
  }
  if (prevVoteState == 'UP' && curVoteState == 'EMPTY') {
    return -1;
  }

  alert(`${prevVoteState} => ${curVoteState}`);
}

export default function articles(state={...initialState, zoneArticles: null}, action) {
  switch(action.type) {

    case REQUEST_ARTICLES:
      var newState = {...state};
      if (!_.isEqual(state[action.articleType], action.articles)) {
        newState[action.articleType] = state[action.articleType].concat(action.articles);
      }
      return newState;

    case REQUEST_ZONE_ARTICLES:
      var zoneName = action.zone;
      var currentZoneArticles = state.zoneArticles && state.zoneArticles[zoneName] && state.zoneArticles[zoneName][action.articleType] || []

      var newState = {...state}

      if(!newState.zoneArticles){ newState.zoneArticles = {} }
      if(!newState.zoneArticles[zoneName]){ newState.zoneArticles[zoneName] = {} }
      if(!newState.zoneArticles[zoneName][action.articleType]){ newState.zoneArticles[zoneName][action.articleType] = [] }

      if (!_.isEqual(newState.zoneArticles[zoneName][action.articleType], action.articles)) {
        newState.zoneArticles[zoneName][action.articleType]
          = newState.zoneArticles[zoneName][action.articleType]
            .concat(action.articles)
      }
      return newState;

    case VOTE_FOR_ARTICLE:
      var newState = {...state};
      var { voteState, articleId, articleType, zone } = action;

      if (zone && newState.zoneArticles && newState.zoneArticles[zone]) {
        var articleIndex = newState.zoneArticles[zone][articleType].findIndex(art => art.articleId == articleId);
        if (articleIndex != -1) {
          var newArticle = newState.zoneArticles[zone][articleType][articleIndex];
          newArticle.upVote += changeVoteCount(newArticle.vote.voteState, voteState);
          newArticle.vote.voteState = voteState;
          newState.zoneArticles[zone][articleType][articleIndex] = newArticle;
        }
      }

      var articleIndex = newState[articleType].findIndex(art => art.articleId == articleId);
      if (articleIndex != -1) {
        var newArticle = newState[articleType][articleIndex];
        newArticle.upVote += changeVoteCount(newArticle.vote.voteState, voteState);
        newArticle.vote.voteState = voteState;
        newState[articleType][articleIndex] = newArticle;
      }

      return newState;

    case RELOAD_ARTICLES:
      var { articleType, zone } = action;
      var newState = {...state};
      if (zone) {
        newState.zoneArticles[zone][articleType] = [];
      } else {
        newState[articleType] = []
      }
      return newState;
    case LOGOUT:
      return initialState;

    case REQUEST_USER_ARTICLES:
      if (action.articles.length == 0) { return state; }

      var newState = {...state};

      if (!_.isEqual(newState.userSubmittedArticles, action.articles)) {
        newState.userSubmittedArticles = newState.userSubmittedArticles.concat(action.articles);
      }
      return newState;

    default:
      return state;
  }
}
