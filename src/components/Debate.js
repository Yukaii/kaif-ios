import React, {
  View,
  TouchableHighlight,
  Text,
  ActionSheetIOS,
  LinkingIOS
} from 'react-native';

import HTMLWebView from 'react-native-html-webview';
import { renderMarkdown } from '../utils/utils';
import DebateHelper from '../utils/DebateHelper';

let Debate = React.createClass({
  _handleDebateLongPress(event) {
    const {debate, onDebateReply} = this.props;
    ActionSheetIOS.showActionSheetWithOptions({
      options: ['贊同', '反對', '回覆', '刪除', '取消'],
      cancelButtonIndex: 4,
      destructiveButtonIndex: 3,
    },
    (buttonIndex) => {
      switch(buttonIndex) {
        case 0:
          // voteForDebate(debate.debateId, 'UP')
          return;
        case 2:
          onDebateReply(debate);
          return;
        default:
          return;
      }
    });
  },

  _onDebatePress() {
    const {onDebateReply, debate} = this.props;
    onDebateReply(debate);
  },

  render() {
    const {debate, onDebateReply} = this.props;

    return(
      <TouchableHighlight
        underlayColor="#eeeeee"
        onLongPress={this._handleDebateLongPress}
        // onPress={this._onDebatePress}
      >
        <View
          style={{flex: 1, backgroundColor: '#eeeeee', marginBottom: 6}}>
          <View style={{flexDirection: 'row', marginTop: 4, marginBottom: 3}}>
            <Text style={{color: 'rgb(97, 97, 97)'}}>{debate.debaterName}</Text>
            <View style={{ borderRadius: 2, borderWidth: 1.5, paddingLeft: 2, paddingRight: 2, marginTop: -1, marginLeft: 4, marginRight: 4, borderColor: '#cccccc' }}>
              <Text style={{color: '#777777'}}>{debate.upVote - debate.downVote}</Text>
            </View>
            <Text style={{color: '#777777'}}>{DebateHelper.lastUpdateTimeFromNow(debate.lastUpdateTime)}</Text>
          </View>
          <HTMLWebView
            html={renderMarkdown(debate.content)}
            makeSafe={false}
            autoHeight={true}
            style={{marginBottom: -10, backgroundColor: '#EEEEEE'}}
            onLink={(href) => {LinkingIOS.openURL(href)}}
          />
        </View>
      </TouchableHighlight>
    );
  }
});

export default Debate;
