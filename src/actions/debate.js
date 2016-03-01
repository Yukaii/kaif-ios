import KaifAPI from '../utils/KaifAPI';

export const REQUEST_DEBATES = 'REQUEST_DEBATES';
export const VOTE_FOR_DEBATE = 'VOTE_FOR_DEBATE';
export const CREATE_DEBATE   = 'CREATE_DEBATE';

// 找出 debateTree 的某個 debate 再對他執行 callback
export function traverseDebateTree(debateTree, debateId=null, callback=null) {
  if (!debateId || debateId && debateTree.debate && (debateTree.debate.debateId == debateId) ) {
    if (callback) { return callback(debateTree); }
    return debateTree;
  } else {
    debateTree.children = debateTree.children.map(childDebateTree => {
      return traverseDebateTree(childDebateTree, debateId, callback);
    });
    return debateTree;
  }
}

// 遍歷每一個 debate
export function traverseEachDebates(debateTree, callback=null) {
  if ( debateTree.children.length == 0) {
    if (callback) { return callback(debateTree); }
    return debateTree;
  } else {
    debateTree.children = debateTree.children.map(childDebateTree => {
      return traverseEachDebates(childDebateTree, callback);
    });
    if (callback) { return callback(debateTree); }
    return debateTree;
  }
}

export function requestDebates(articleId, callback=null) {
  return dispatch => {
    KaifAPI.requestArticleDebates(articleId).then(debatesData => {

      var debateTree = {...debatesData.data}

      let debateIds = [];
      traverseEachDebates(debateTree,
        (dT) => {
          // 其實這邊再檢查有點怪了...過多的 expose，再說。
          if(dT.debate) {
            debateIds = debateIds.concat(dT.debate.debateId);
          }
          return dT;
        }
      );

      KaifAPI.requestDebatesVoteState(debateIds).then(voteData => {
        // alert(JSON.stringify(voteData))

        for (let voteIndex in voteData.data) {
          // 遞迴只應天上有，凡人應當用迴圈
          debateTree = traverseDebateTree(
            {...debateTree},
            voteData.data[voteIndex].targetId,
            (dT) => {
              dT.debate.voteState = voteData.data[voteIndex].voteState;
              return dT;
            }
          );
        }

        dispatch({
          type: REQUEST_DEBATES,
          debateTree: debateTree,
          articleId: articleId
        });
        if (callback) {callback()}
      }).catch(e => alert(e));
    });
  }
}

export function voteForDebate(debate, articleId, voteState=null, callback=null) {
  return dispatch => {
    // 收回讚的意思（收回噓）
    if (debate.voteState == voteState) { voteState = 'EMPTY' }
    KaifAPI.requestVoteForDebate(debate.debateId, voteState).then(data => {
      dispatch({
        type: VOTE_FOR_DEBATE,
        articleId: articleId,
        voteState: voteState,
        debateId: debate.debateId
      })
      if (callback) { callback() }
    }).catch(error => {
      alert(`出錯啦，懇請截圖回報開發者，錯誤訊息：${JSON.stringify(error)}`);
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
