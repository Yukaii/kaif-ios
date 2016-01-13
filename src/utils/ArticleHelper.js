import moment from 'moment';
import * as he from './he';
import { parseUri } from '../utils/parseUri';


const ARTICLE_TYPE = {
  EXTERNAL_LINK: 'EXTERNAL_LINK',
  SPEAK: 'SPEAK'
}

let ArticleHelper = {
  debateCountString(debateCount) {
    return `${debateCount} 則討論`;
  },

  createTimeFromNow(createTime) {
    return moment(createTime).fromNow();
  },

  procceedTitle(title) {
    return he.decode(title);
  },

  linkHost(link, type) {
    return this.isExternalLink(type) ? parseUri(link).host : "";
  },

  isExternalLink(type) {
    return type == ARTICLE_TYPE.EXTERNAL_LINK;
  }
}

export default ArticleHelper;
