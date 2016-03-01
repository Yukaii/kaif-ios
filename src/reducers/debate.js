import {
  REQUEST_DEBATES,
  VOTE_FOR_DEBATE,
  CREATE_DEBATE
} from '../actions/debate';

import { traverseDebateTree } from '../actions/debate.js';

// 先窮舉，再 reafactor 啦，好個 state machine Zzzz，笨笨 der
function calculateVoteChange(prevState, curState, upVote, downVote) {
  // UP / DOWN / EMPTY
  alert(`${prevState}, ${curState}`)
  if (typeof prevState === 'undefined') {
    // haven't vote yet
    if (curState == 'UP') {
      return [upVote+1, downVote];
    } else if (curState == 'DOWN') {
      return [upVote, downVote+1];
    } else { // EMPTY
      return [upVote, downVote];
    }
  } else if (prevState == 'UP') {
    if (curState == 'UP') {
      return [upVote, downVote];
    } else if (curState == 'DOWN') {
      return [upVote-1, downVote+1];
    } else {
      // EMPTY
      return [upVote-1, downVote];
    }
  } else if (prevState == 'DOWN') {
    if (curState == 'UP') {
      return [upVote+1, downVote-1];
    } else if (curState == 'DOWN') {
      return [upVote, downVote];
    } else {
      return [upVote, downVote-1]
    }
  } else {
    // prev == 'EMPTY'
    if (curState == 'UP') {
      return [upVote+1, downVote];
    } else if (curState == 'DOWN') {
      return [upVote, downVote+1];
    } else {
      return [upVote, downVote]
    }
  }
}

export default function debates(state={loaded: false}, action) {
  switch(action.type) {
    case REQUEST_DEBATES:
      var newState = {...state, loaded: true};
      newState[action.articleId] = action.debateTree;
      return newState;

    case CREATE_DEBATE:
      var newState = {...state};

      newState[action.articleId] = traverseDebateTree(
        {...state[action.articleId]},
        action.parentDebateId,
        (debateTree) => {
          debateTree.children =
            [...debateTree.children, {
              debate: action.debate,
              children: []
            }];
          return debateTree;
        }
      );
      return newState;

    case VOTE_FOR_DEBATE:
      var newState = {...state};

      newState[action.articleId] = traverseDebateTree(
        {...state[action.articleId]},
        action.debateId,
        (debateTree) => {
          // alert(JSON.stringify(debateTree.debate));
          var [up, down] = calculateVoteChange(debateTree.debate.voteState, action.voteState, debateTree.debate.upVote, debateTree.debate.downVote);

          debateTree.debate.voteState = action.voteState
          debateTree.debate.upVote = up;
          debateTree.debate.downVote = down;

          return debateTree;
        }
      );
      return newState;

    default:
      return state;
  }
}
