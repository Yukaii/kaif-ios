import React, {
  View,
  Text,
  Component,
  ScrollView,
  ActivityIndicatorIOS
} from 'react-native';
import Subscribable from 'Subscribable';

import KaifAPI from '../utils/KaifAPI';
import Article from './Article';
import Debate from './Debate';
import debateModel from '../models/debateModel';
import articleModel from '../models/articleModel';

export default React.createClass({
  mixins: [Subscribable.Mixin],

  getInitialState() {
    return {
      debate: null,
      didFocus: false
    }
  },

  componentDidMount() {
    const { article, navigator, events } = this.props;
    KaifAPI.requestArticleDebates(article.articleId).then(data => {
      this.setState({
        debate: data.data
      });
    });

    let didFocusCallback = () => {
      this.setState({
        didFocus: true,
      })
    }
    navigator.navigationContext.addListener('didfocus', didFocusCallback);
    this.addListenerOn(events, 'shouldPop', () => { navigator.pop() });
  },

  componentWillUnmount() {
    const { navigator } = this.props;
    navigator.navigationContext._bubbleEventEmitter.removeAllListeners('didfocus')
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

  render() {
    const { article, navigator, rootNavigator } = this.props;

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
      <View style={{flex: 1, paddingTop: 64, paddingBottom: 48, backgroundColor: '#eeeeee'}}>
        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={{ paddingBottom: 32, justifyContent: 'space-between', backgroundColor: '#eeeeee'}}
        >
          <Article
            article={ new articleModel(article) }
            touchableStyle={{underlayColor: '#eeeeee'}}
            style={{
              backgroundColor: '#d1dbe5',
            }}
            navigator={navigator}
            rootNavigator={rootNavigator}
            showVote={this.state.didFocus}
          />
        { (this.state.debate !== null && this.state.didFocus) ? this.state.debate.children.map(data => this.renderDebate(data)) : null }
        </ScrollView>
      </View>
    );
  }
});