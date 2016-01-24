import {
  REQUEST_DEBATES
} from '../actions/debate';


export default function debates(state={}, action) {
  switch(action.type) {
    case REQUEST_DEBATES:
      var newState = {...state};
      newState[action.articleId] = action.debate
      return newState;
    default:
      return state;
  }
}
