import {
  REQUEST_HOT_ARTICLES,
  REQUEST_LATEST_ARTICLES
} from '../constants/ActionTypes';

import KaifAPI from '../utils/KaifAPI';

export function requestHotArticles(callback) {
  return depatch => {
    KaifAPI.requestHotArticles().then(data => {
      callback(data);
      depatch({
        type: REQUEST_HOT_ARTICLES,
        ...data
      });
    });
  }
}
