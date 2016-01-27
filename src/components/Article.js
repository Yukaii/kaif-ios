import React, {
  View,
  Component,
  Text,
  TouchableHighlight,
  RCTNativeAppEventEmitter,
  ActionSheetIOS,
  AlertIOS
} from 'react-native';

import SafariView from "react-native-safari-view";
import PasteBoard from 'react-native-pasteboard';

import Router from '../routers';
import Icon from 'react-native-vector-icons/Ionicons';
import ArticleHelper from '../utils/ArticleHelper';
import KaifIcon from './KaifIcon';
import KaifAPI from '../utils/KaifAPI';

let Article = React.createClass({
  getInitialState: function() {
    return {
      visibility: true,
    }
  },

  getDefaultProps: function() {
    return {
      showVote: true
    }
  },

  componentDidMount: function() {
    const { article } = this.props;

    this.viewProperties = {
      width: 0,
      height: 0
    }

    this.setState({
      voteState: article.vote ? article.vote.voteState : 'EMPTY',
      upVote: article.upVote
    })
  },

  componentWillReceiveProps: function(nextProps) {
    const { article, navigator } = this.props;

    let newArticle = nextProps.article;
    this.setState({
      voteState: newArticle.vote ? newArticle.vote.voteState : 'EMPTY',
      upVote: newArticle.upVote,
    })

    // force refresh while we have push props into a navigator
    navigator.forceUpdate();
  },

  _pushDebateRoute: function() {
    const {
      article,
      navigator,
      rootNavigator,
      events,
      handleVotePress
    } = this.props;
    let route = Router.getDebateRoute({
      article: article,
      rootNavigator: rootNavigator,
      events: events,
      handleVotePress: handleVotePress
    })
    navigator.push(route);
  },

  handleArticlePress: function(event) {
    const {
      navigator,
      canHandleArticlePress
    } = this.props;

    if (navigator && canHandleArticlePress) {
      this._pushDebateRoute();
    }
  },

  openShareAction: function(article) {
    ActionSheetIOS.showShareActionSheetWithOptions({
      url: article.link,
      message: article.link,
      subject: '透過 kaif.io 分享'
    },
    (error) => {
      console.error(error);
    },
    (success, method) => {
    });
  },

  _handleArticleLongPress: function() {
    const { article, navigator, canHandleArticlePress } = this.props;

    ActionSheetIOS.showActionSheetWithOptions({
      options: ['打開連結', '複製連結', '進入討論', '分享連結', '取消'],
      cancelButtonIndex: 4,
      // destructiveButtonIndex: DESTRUCTIVE_INDEX,
    },
    (buttonIndex) => {
      switch(buttonIndex) {
        case 0:
          this.openExternalLink();
          return;
        case 1:
          PasteBoard.copyText(article.link , (callback) => {
            AlertIOS.alert('Alert', '已複製！');
          });
          return
        case 2:
          canHandleArticlePress && this._pushDebateRoute();
          if (!canHandleArticlePress) {alert("你已經在討論串啦！（真是個垃圾訊息）")}
          return;
        case 3:
          this.openShareAction(article);
          return;
        default:
          return;
      }
    });
  },

  onLayout: function(evt) {
    // When the cell has actually been layed out, record the rendered width & height
    this.viewProperties.width = evt.nativeEvent.layout.width;
    this.viewProperties.height = evt.nativeEvent.layout.height;
  },

  openExternalLink: function(event) {
    const { article, rootNavigator } = this.props;
    if (ArticleHelper.isExternalLink(article.articleType)) {
      // SafariView.isAvailable()
      // .then(SafariView.show({
      //   url: article.link
      // }))
      // .catch(error => {
        if (rootNavigator) {
          let route = Router.getWebViewRoute({
            url: article.link,
            rootNavigator: rootNavigator
          })
          rootNavigator.push(route);
        }
      // });
    } else {
      this._pushDebateRoute();
    }
  },

  render: function() {
    const { article, style, touchableStyle, handleVotePress } = this.props;

    defaultTouchableStyle = {
      underlayColor: "rgba(128, 128, 128, 0.19)"
    }

    let voteColor = this.state.voteState == "UP" ? '#ff5619' : '#b3b3b3'

    if (!this.state.visibility) {
      return(
        <View style={{width: this.viewProperties.width, height: this.viewProperties.height}}></View>
      );
    }

    return(
      <TouchableHighlight
        {...{...defaultTouchableStyle, ...touchableStyle} }
        onPress={this.handleArticlePress}
        onLongPress={this._handleArticleLongPress}
      >
        <View key={article.articleId}
          style={{paddingTop: 5, paddingBottom: 5, paddingLeft: 6, paddingRight: 10, borderColor: "#CCCCCC", borderTopWidth: 0.6, ...style}}>
          <View style={{flexDirection: 'row', flex: 1}}>
            <TouchableHighlight
              underlayColor='rgba(255, 255, 255, 0)'
              style={{marginRight: 8, paddingTop: 1}}
              onPress={handleVotePress}>
              <View style={{flexDirection: 'column', width: 22, alignItems: 'center'}}>
                <KaifIcon color={voteColor} style={{}}/>
                <Text style={{textAlign: 'left', color: voteColor, marginTop: 3}}>{this.state.upVote}</Text>
              </View>
            </TouchableHighlight>
            <View style={{flexDirection: 'column', flex: 1}}>
              <View style={{flex: 3}}>
                <TouchableHighlight underlayColor='rgba(255, 255, 255, 0)'
                  onPress={this.openExternalLink}
                  >
                  <Text style={{fontSize: 16, marginBottom: 2}}>{article.title && ArticleHelper.procceedTitle(article.title)}</Text>
                </TouchableHighlight>
                <Text style={{color: 'rgb(97, 97, 97)', marginBottom: 3}}>{`(${ArticleHelper.linkHost(article.link, article.articleType)})`}</Text>
              </View>
              <View style={{flexDirection: 'row', flex: 1, justifyContent: 'flex-start'}}>
                <View style={{flexDirection: 'row', flex: 1}}>
                  <Icon name="arrow-right-b" size={10} color='rgb(97, 97, 97)' style={{marginTop: 3.5, marginRight: 3}}/>
                  <Text style={{color: 'rgb(97, 97, 97)'}}>{ArticleHelper.debateCountString(article.debateCount)}</Text>
                </View>
                <View style={{flexDirection: 'row', flex: 2.5}}>
                  <Icon name="arrow-right-b" size={10} color='rgb(97, 97, 97)' style={{marginTop: 3.5, marginRight: 3}}/>
                  <Text style={{color: 'rgb(97, 97, 97)', flex: 2}}>{article.zoneTitle}</Text>
                </View>
              </View>
              <View style={{flexDirection: 'row', flex: 1}}>
                <Text style={{color: 'rgb(97, 97, 97)'}}>{`${article.authorName} 張貼於 ${ArticleHelper.createTimeFromNow(article.createTime)}`}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
});


export default Article;
