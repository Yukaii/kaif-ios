import {
  REQUEST_DEBATES,
  VOTE_FOR_DEBATE,
  CREATE_DEBATE
} from '../actions/debate';

function traverseDebateTree(debateTree, parentDebateId, debate) {
  if (!parentDebateId || debateTree.debate && debateTree.debate.debateId == parentDebateId) {
    debateTree.children = debateTree.children.concat({
      debate: debate,
      children: []
    });
    return debateTree;
  } else {
    debateTree.children = debateTree.children.map(childDebate => {
      return traverseDebateTree(childDebate, parentDebateId, debate);
    });
    return debateTree;
  }
}

export default function debates(state={loaded: false}, action) {
  switch(action.type) {
    case REQUEST_DEBATES:
      var newState = {...state, loaded: true};
      newState[action.articleId] = action.debateTree;
      return newState;

    case CREATE_DEBATE:
      var newState = {...state}
      newState[action.articleId] = traverseDebateTree({...state[action.articleId]}, action.parentDebateId, action.debate)
      return newState;
    default:
      return state;
  }
}
