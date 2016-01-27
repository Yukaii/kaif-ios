import KaifAPI from '../utils/KaifAPI';

export const REQUEST_DEBATES = 'REQUEST_DEBATES';
export const VOTE_FOR_DEBATE = 'VOTE_FOR_DEBATE';
export const CREATE_DEBATE   = 'CREATE_DEBATE'

export function requestDebates(articleId, callback=null) {
  return dispatch => {
    KaifAPI.requestArticleDebates(articleId).then(data => {
      dispatch({
        type: REQUEST_DEBATES,
        debateTree: data.data,
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
      // alert(`出錯啦，懇請截圖回報開發者，錯誤訊息：${JSON.stringify(error)}`);
    });
  }
}

export function createDebate(articleId, parentDebateId=null, content) {
  return dispatch => {
    KaifAPI.requestCreateDebate(articleId, parentDebateId, content).then(data => {
      dispatch({
        type: CREATE_DEBATE,
        articleId: articleId,
        parentDebateId: parentDebateId,
        debate: data.data
      })
    }).catch(error => {
      alert(`出錯啦，懇請截圖回報開發者，錯誤訊息：${JSON.stringify(error)}`);
    })
  }
}
