import React, {
  SegmentedControlIOS,
  Text,
  Component,
  View,
  ActivityIndicatorIOS,
  PropTypes,
  ListView
} from 'react-native';
import moment from 'moment';
import KaifAPI from '../utils/KaifAPI';
import Article from '../components/Article';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux/native';
import * as ArticleActions from '../actions/article';
import { renderMarkdown } from '../utils/utils';

import HTMLWebView from 'react-native-html-webview';

let Profile = React.createClass({
  propTypes: {
    dataSource: PropTypes.object,
    requestUserArticles: PropTypes.func.isRequired
  },

  getInitialState: function() {
    return({
      profile: null,
      selectedIndex: 0
    });
  },

  componentDidMount: function() {
    const { requestUserArticles } = this.props;
    KaifAPI.requestBasicUserProfile().then(data => {
      if(data.data) {
        this.setState({profile: data.data});
      }
    });

    requestUserArticles(null, null);
  },

  _renderUserData: function() {
    const { profile } = this.state;
    if (!profile) {
      return(
        <ActivityIndicatorIOS
          animating={true}
          style={{alignItems: 'center', justifyContent: 'center', height: 80}}
          size="small"
        />
      );
    } else {
      return(
        <View style={{marginVertical: 5}}>
          <Text style={{alignSelf: 'center', fontSize: 20, fontWeight: 'bold', marginBottom: 10}}>{profile.username}</Text>
          <HTMLWebView style={{alignSelf: 'center', paddingLeft: 30, paddingRight: 30, marginBottom: 10}} html={renderMarkdown(profile.description, {backgroundColor: 'white', color: 'rgb(122, 122, 122)'})} />
          <Text style={{alignSelf: 'center', color: 'rgb(122, 122, 122)'}}>since {moment(profile.createTime).fromNow()}</Text>
        </View>
      );
    }
  },

  _onChange(event) {
    this.setState({
      selectedIndex: event.nativeEvent.selectedSegmentIndex,
    });
  },

  _renderHeader() {
    return(
      <View style={{marginBottom: 5}}>
        { this._renderUserData() }
        <View style={{paddingTop: 10, paddingHorizontal: 5}}>
          <SegmentedControlIOS
            values={['分享的文章', '贊同的文章']}
            selectedIndex={this.state.selectedIndex}
          />
        </View>
      </View>
    );
  },

  _handleVotePress: function(article) {
    const { articleRequestPolicy } = this.state;
    const { zone, voteForArticle, navigator } = this.props;

    return (event) => {
      let voteState = (article.vote.voteState == 'EMPTY' || typeof article.vote.voteState === 'undefined') ? 'UP' : 'EMPTY';
      voteForArticle(
        null, // callback
        article.articleId,
        voteState,
        articleRequestPolicy,
        (zone || article.zone)
      );
    }
  },

  render: function() {
    const {
      dataSource,
      submittedArticles,
      rootNavigator,
      events,
      navigator,
      showModal
    } = this.props;

    return(
      <View style={{flex:1, paddingTop: 64, marginBottom: 48}}>
        <ListView
          showsVerticalScrollIndicator={false}
          style={{flex: 1}}
          contentContainerStyle={{justifyContent: 'flex-start'}}
          automaticallyAdjustContentInsets={false}
          dataSource={dataSource.cloneWithRows(submittedArticles)}
          // onEndReached={this._onEndReach}
          // onEndReachedThreshold={20}
          // renderFooter={this._renderFooter}
          removeClippedSubviews={true}
          renderHeader={this._renderHeader}
          initialListSize={10}
          renderRow={
            (article, sectionID, rowID) => {
              return(
                <Article
                  article={ article }
                  key={ article.articleId }
                  navigator={navigator}
                  events={events}
                  rootNavigator={rootNavigator}
                  canHandleArticlePress={true}
                  handleVotePress={this._handleVotePress(article)}
                  showModal={showModal}
                />
              );
            }
          }
        />
      </View>
    );
  }
});

function mapStateToProps(state) {
  const { articles } = state;
  const dataSource = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2,
  });

  return {
    ...state,
    submittedArticles: articles.userSubmittedArticleIds.map(articleId => articles.articleHash[articleId]),
    dataSource: dataSource.cloneWithRows([]),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ArticleActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
