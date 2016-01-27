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
  LayoutAnimation
} from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Subscribable from 'Subscribable';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux/native';
import * as DebateActions from '../actions/debate';

import KaifAPI from '../utils/KaifAPI';
import Article from './Article';
import Debate from './Debate';
import debateModel from '../models/debateModel';
import articleModel from '../models/articleModel';

import TrackKeyboard from '../components/trackKeyboard';

let DebateContainer = React.createClass({
  mixins: [Subscribable.Mixin, TrackKeyboard],

  propTypes: {
    requestDebates: PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      didFocus: false
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

  componentDidMount() {
    const { article, navigator, events, requestDebates } = this.props;

    InteractionManager.runAfterInteractions(() => {
      requestDebates(article.articleId);
      this.setState({didFocus: true});
    });
    this.addListenerOn(events, 'shouldPop', () => { navigator.pop() });
  },

  renderDebate(data) {
    return(
      <View key={data.debate.debateId} style={{paddingLeft: 5, paddingRight: 5}}>
        <Debate debate={new debateModel(data.debate)}/>
        <View style={{marginLeft: 5, borderColor: '#d2dbe6', borderLeftWidth: 2, paddingLeft: 5, backgroundColor: '#eeeeee'}} >
          { data.children.map(data => this.renderDebate(data)) }
        </View>
      </View>
    );
  },

  _onDebateSubmit(event) {

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
    const { article, navigator, rootNavigator, handleVotePress, debates } = this.props;
    var marginBottom = this.state.keyboardSpace / 253 * 205 - 5;

    if (!this.state.didFocus) {
      return(
        <View style={{flex: 1, paddingTop: 64, paddingBottom: 48, backgroundColor: '#eeeeee'}}>
          <ActivityIndicatorIOS
              animating={true}
              style={{alignItems: 'center', justifyContent: 'center', height: 80}}
              size="small"
            />
        </View>
      );
    }

    return(
      <View style={{flex: 1, paddingTop: 64, paddingBottom: 49, backgroundColor: '#eeeeee'}}>
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
          />
          <View style={{paddingHorizontal: 5}}>
            { (debates.loaded && this.state.didFocus && debates[article.articleId]) ? debates[article.articleId].children.map(data => this.renderDebate(data)) : this._renderActivityIndicator() }
          </View>
        </ScrollView>
        <View style={{flexDirection: 'row', alignItems: 'stretch', backgroundColor: "white"}}>
          <TextInput style={{paddingHorizontal: 13, left: 0, right: 0, height: 45, marginBottom: marginBottom, marginRight: 20, paddingBottom: 5, borderColor: '#7d8287', borderTopWidth: 2, alignSelf: 'stretch', flex: 5}} placeholder={`回覆 ${article.authorName}...`}/>
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
