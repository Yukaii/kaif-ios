import KaifAPI from '../utils/KaifAPI';

export const REQUEST_DEBATES = 'REQUEST_DEBATES';

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
