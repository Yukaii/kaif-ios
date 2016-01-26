import KaifAPI from '../utils/KaifAPI';

export const REQUEST_DEBATES = 'REQUEST_DEBATES';
export const VOTE_FOR_DEBATE = 'VOTE_FOR_DEBATE';

export function requestDebates(articleId, callback=null) {
  return dispatch => {
    KaifAPI.requestArticleDebates(articleId).then(data => {
      dispatch({
        type: REQUEST_DEBATES,
        debate: data.data,
        articleId: articleId
      });
      if (callback) {callback()}
    });
  }
}

export function voteForDebate(debateId, voteState=null, callback=null) {
  return dispatch => {
    KaifAPI.requestVoteForDebate(debateId, voteState).then(data => {
      dispatch({
        type: VOTE_FOR_DEBATE,
        voteState: voteState,
        debateId: debateId
      })
      if (callback) { callback() }
    }).catch(error => {
      // may dispatch error here
    });
  }
}
