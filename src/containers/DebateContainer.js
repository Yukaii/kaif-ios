import React, {
  View,
  Text,
  Component,
  ScrollView,
  ActivityIndicatorIOS,
  RefreshControl,
  InteractionManager,
  PropTypes,
  TextInput,
  LinkingIOS,
  LayoutAnimation
} from 'react-native';

import KeyboardEvents from 'react-native-keyboardevents';
import {
  Emitter as KeyboardEventEmitter
} from 'react-native-keyboardevents';
import HTMLWebView from 'react-native-html-webview';

import Subscribable from 'Subscribable';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux/native';
import * as DebateActions from '../actions/debate';

import KaifAPI from '../utils/KaifAPI';
import Article from '../components/Article';
import Debate from '../components/Debate';
import debateModel from '../models/debateModel';
import articleModel from '../models/articleModel';

import TrackKeyboard from '../components/trackKeyboard';

import { renderMarkdown } from '../utils/utils';

let DebateContainer = React.createClass({
  mixins: [Subscribable.Mixin, TrackKeyboard],

  propTypes: {
    requestDebates: PropTypes.func.isRequired,
    createDebate: PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      didFocus: false,
      replyingDebate: null
    }
  },

  componentWillUpdate(props, state) {
    const animations = {
      layout: {
        spring: {
          duration: 300,
          create: {
            duration: 200,
            type: LayoutAnimation.Types.easeInEaseOut,
            property: LayoutAnimation.Properties.opacity
          },
          update: {
            type: LayoutAnimation.Types.spring,
            springDamping: 100
          }
        },
        easeInEaseOut: {
          duration: 300,
          create: {
            type: LayoutAnimation.Types.easeInEaseOut,
            property: LayoutAnimation.Properties.scaleXY
          },
          update: {
            delay: 100,
            type: LayoutAnimation.Types.easeInEaseOut
          }
        }
      }
    };

    if (state.isKeyboardOpened !== this.state.isKeyboardOpened) {
      LayoutAnimation.configureNext(animations.layout.spring);
    }
  },

  resetReplyingDebate() {
    this.setState({replyingDebate: null})
  },

  componentDidMount() {
    const { article, navigator, events, requestDebates } = this.props;

    InteractionManager.runAfterInteractions(() => {
      requestDebates(article.articleId);
      this.setState({didFocus: true});
    });
    this.addListenerOn(events, 'shouldPop', () => { navigator.pop() });
    KeyboardEventEmitter.on(KeyboardEvents.KeyboardWillHideEvent, this.resetReplyingDebate);
  },

  componentWillUnmount() {
    KeyboardEventEmitter.off(KeyboardEvents.KeyboardWillHideEvent, this.resetReplyingDebate);
  },

  _onDebateReply(debate=null) {
    if (!debate.hasOwnProperty("debateId")) {
      debate = null;
    }
    this.setState({replyingDebate: debate, text: ''});
    this.refs.DebateInput.focus();
  },

  _onDebateSubmit() {
    const {article, createDebate} = this.props;
    const {replyingDebate} = this.state;

    if (this.state.text.length < 5) {
      alert("打不到五個字還想回覆，是不是機器人啊！")
      return;
    }

    createDebate(article.articleId, replyingDebate && replyingDebate.debateId, this.state.text);
    this.setState({text: ''});
  },

  renderDebate(data) {
    return(
      <View key={data.debate.debateId} style={{paddingLeft: 5, paddingRight: 5}}>
        <Debate debate={new debateModel(data.debate)} onDebateReply={this._onDebateReply}/>
        <View style={{marginLeft: 5, borderColor: '#d2dbe6', borderLeftWidth: 2, paddingLeft: 5, backgroundColor: '#eeeeee'}} >
          { data.children.map(data => this.renderDebate(data)) }
        </View>
      </View>
    );
  },

  _onRefresh() {
    const {article, requestDebates} = this.props;
    this.setState({isRefreshing: true})
    requestDebates(article.articleId, () => {
      this.setState({isRefreshing: false})
    });
  },

 _renderActivityIndicator: function() {
    return(
      <ActivityIndicatorIOS
        animating={true}
        style={{alignItems: 'center', justifyContent: 'center', height: 80}}
        size="small"
      />
    );
  },

  render() {
    const {
      article,
      navigator,
      rootNavigator,
      handleVotePress,
      debates,
      showModal
    } = this.props;
    var marginBottom = this.state.keyboardSpace / 253 * 205 - 5;

    if (!this.state.didFocus) {
      return(
        <View style={{flex: 1, paddingBottom: 48, backgroundColor: '#eeeeee'}}>
          <ActivityIndicatorIOS
              animating={true}
              style={{alignItems: 'center', justifyContent: 'center', height: 80}}
              size="small"
            />
        </View>
      );
    }

    return(
      <View style={{flex: 1, backgroundColor: '#eeeeee'}}>
        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={{ justifyContent: 'space-between', backgroundColor: '#eeeeee'}}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          <Article
            article={ article }
            touchableStyle={{underlayColor: '#eeeeee'}}
            style={{
              backgroundColor: '#d1dbe5',
              borderTopWidth: 0,
              marginBottom: 5
            }}
            navigator={navigator}
            rootNavigator={rootNavigator}
            showVote={this.state.didFocus}
            handleVotePress={handleVotePress}
            onPress={this._onDebateReply}
            showModal={showModal}
          />
          {
            article.content == null ?
              null :
              <HTMLWebView
                html={renderMarkdown(article.content)}
                makeSafe={false}
                autoHeight={true}
                style={{marginBottom: -10, backgroundColor: '#EEEEEE'}}
                onLink={(href) => {LinkingIOS.openURL(href)}}
              />
          }
          <View style={{paddingHorizontal: 5}}>
            { (debates.loaded && this.state.didFocus && debates[article.articleId]) ? debates[article.articleId].children.map(data => this.renderDebate(data)) : this._renderActivityIndicator() }
          </View>
        </ScrollView>
        <View style={{flexDirection: 'row', alignItems: 'stretch', backgroundColor: "white", paddingBottom: 49, marginTop: -49}}>
          <TextInput style={{paddingHorizontal: 13, left: 0, right: 0, height: 45, marginBottom: marginBottom, marginRight: 20, paddingTop: 5, paddingBottom: 5, borderColor: 'white', borderTopWidth: 2, alignSelf: 'stretch', flex: 5, fontSize: 15}} placeholder={`回覆 ${this.state.replyingDebate && this.state.replyingDebate.debaterName || article.authorName}...`} multiline={true} enablesReturnKeyAutomatically={true} keyboardAppearance="light" onChangeText={(text) => this.setState({text})} value={this.state.text} ref="DebateInput"/>
          <Text style={{marginBottom: marginBottom, paddingTop: 13, flex: 1, fontSize: 15, color: "#2081e4", fontWeight: 'bold'}} onPress={this._onDebateSubmit} suppressHighlighting={false}>送出</Text>
        </View>
      </View>
    );
  }
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(DebateActions, dispatch);
}

export default connect(state => state, mapDispatchToProps)(DebateContainer);
