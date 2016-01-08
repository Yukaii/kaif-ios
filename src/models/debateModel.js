// articleId (string): ,
// debateId (string): ,
// zone (string): ,
// parentDebateId (string, optional): reply to debateId, null if reply to article,
// level (integer): depth level of debate tree, start from 1,
// content (string): ,
// debaterName (string): debater's username,
// upVote (integer): total up voted count,
// downVote (integer): total down voted count,
// createTime (string): create time in ISO8601 format,
// lastUpdateTime (string): content last update time, same as create time if not updated (ISO8601 format)
//
import moment from 'moment';

export default class debateModel {
  constructor(data) {
    Object.keys(data).map(k => {
      this[k] = data[k];
    });
  }

  lastUpdateTimeFromNow = () => {
    return moment(this.lastUpdateTime).fromNow();
  }
}
