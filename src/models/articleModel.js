// String zone,
// String zoneTitle,
// String articleId,
// String title,
// Date createTime,
// String link,
// String content,
// enum articleType: EXTERNAL_LINK, SPEAK
// String authorName,
// long upVote,
// long debateCount
import moment from 'moment';
import * as he from '../utils/he';
import { parseUri } from '../utils/parseUri';

const ARTICLE_TYPE = {
  EXTERNAL_LINK: 'EXTERNAL_LINK',
  SPEAK: 'SPEAK'
}

export default class articleModel {
  constructor(data) {
    Object.keys(data).map(k => {
      this[k] = data[k];
    });
  }

  createTimeFromNow = () => {
    return moment(this.createTime).fromNow();
  }

  procceedTitle = () => {
    return he.decode(this.title);
  }

  debateCountString = () => {
    return `${this.debateCount} 則討論`;
  }

  linkHost = () => {
    return this.isExternalLink() ? parseUri(this.link).host : "";
  }

  isExternalLink = () => {
    return this.articleType == ARTICLE_TYPE.EXTERNAL_LINK;
  }

}
