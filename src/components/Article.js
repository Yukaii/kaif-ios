import React, {
  View,
  Component,
  Text,
  TouchableHighlight,
  RCTNativeAppEventEmitter,
  ActionSheetIOS,
  AlertIOS,
  Modal,
  LinkingIOS,
} from 'react-native';

import SafariView from "react-native-safari-view";
import PasteBoard from 'react-native-pasteboard';
import { connect } from 'react-redux/native';
import Icon from 'react-native-vector-icons/Ionicons';

import {deleteArticle} from '../actions/article';

import Router from '../routers';
import ArticleHelper from '../utils/ArticleHelper';
import KaifIcon from './KaifIcon';
import KaifAPI from '../utils/KaifAPI';
import DebateContainer from '../containers/DebateContainer';
import ExternalWebView from '../containers/ExternalWebView';

let Article = React.createClass({
  getInitialState: function() {
    return {
      visibility: true
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
  },

  _pushDebateRoute: function() {
    const {
      article,
      navigator,
      rootNavigator,
      events,
      handleVotePress,
      showModal,
      shareButtonSource
    } = this.props;
    let route = {
      component: DebateContainer,
      passProps: {
        article: article,
        rootNavigator: rootNavigator,
        events: events,
        handleVotePress: handleVotePress,
        showModal: showModal
      },
      rightButtonIcon: shareButtonSource,
      onRightButtonPress: this._articleActions
    }
    navigator.push(route);
  },

  handleArticlePress: function(event) {
    const {
      navigator,
      canHandleArticlePress,
      handleVotePress
    } = this.props;

    if (navigator && canHandleArticlePress) {
      this._pushDebateRoute();
    } else {
      handleVotePress();
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

  _articleActions: function() {
    const { article, navigator, canHandleArticlePress, handleVotePress, dispatch } = this.props;
    let voteAction = this.state.voteState == "UP" ? '收回贊同' : '贊同'

    ActionSheetIOS.showActionSheetWithOptions({
      options: ['打開連結', '複製連結', '分享連結', voteAction, '刪除', '取消'],
      cancelButtonIndex: 5,
      destructiveButtonIndex: 4
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
          this.openShareAction(article);
          return;
        case 3:
          handleVotePress();
          return;
        case 4:
          KaifAPI.requestArticleCanDelete(article.articleId).then(data => {
            if (data.data) {
              AlertIOS.alert(
                '刪除文章',
                '刪除就無法再復原囉，確定刪除嗎？',
                [
                  {text: '取消', style: 'cancel'},
                  {text: '刪除', onPress: () => { deleteArticle(article.articleId)(dispatch); navigator.pop(); }, style: 'destructive'}
                ]
              );
            } else if(data.username != article.authorName) {
              AlertIOS.alert("吼", "不能刪除啦！又不是你 PO 的")
            } else {
              AlertIOS.alert("唉", "時間過久無法刪除！")
            }
          })
          return;
        default:
          return;
      }
    });
  },

  openExternalLink: function(event) {
    const { article, rootNavigator, showModal, canHandleArticlePress } = this.props;
    if (ArticleHelper.isExternalLink(article.articleType)) {
      LinkingIOS.openURL(article.link);
      // showModal({url: article.link});
      // SafariView.isAvailable()
      // .then(SafariView.show({
      //   url: article.link
      // }))
      // .catch(error => {
      //   this.setState({modalVisible: true});
      //   if (rootNavigator) {
      //     let route = Router.getWebViewRoute({
      //       url: article.link,
      //       rootNavigator: rootNavigator
      //     })
      //     rootNavigator.push(route);
      //   }
      // });
    } else {
      canHandleArticlePress && this._pushDebateRoute();
    }
  },

  render: function() {
    const { article, style, touchableStyle, handleVotePress } = this.props;

    defaultTouchableStyle = {
      underlayColor: "rgba(128, 128, 128, 0.19)"
    }

    let voteColor = this.state.voteState == "UP" ? '#ff5619' : '#b3b3b3'

    return(
      <TouchableHighlight
        {...{...defaultTouchableStyle, ...touchableStyle} }
        onPress={this.props.onPress || this.handleArticlePress}
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
                { ArticleHelper.isExternalLink(article.articleType) ?
                    <Text style={{color: 'rgb(97, 97, 97)', marginBottom: 3}}>{`(${ArticleHelper.linkHost(article.link, article.articleType)})`}</Text>
                    : null
                }
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


export default connect()(Article);
