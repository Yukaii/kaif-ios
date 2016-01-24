import { combineReducers } from 'redux';
import articles from './article';
import debates from './debate';

const rootReducer = combineReducers({
  articles,
  debates
});

export default rootReducer;
