import React, {
  Text,
  Component,
  View,
  ScrollView,
  ListView,
  PropTypes,
  ActivityIndicatorIOS,
  TouchableHighlight,
  RefreshControl,
  InteractionManager
} from 'react-native';

import TableView, {
  Section,
  Item,
  Cell
} from 'react-native-tableview';

import RefreshableListView from 'react-native-refreshable-listview';

import Router from '../routers';
import Article from './Article';
import ArticleHelper from '../utils/ArticleHelper';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux/native';
import * as ArticleActions from '../actions/article';

import KaifAPI from '../utils/KaifAPI';

let ArticleContainer = React.createClass({
  propTypes: {
    dataSource: PropTypes.object,
    requestArticles: PropTypes.func.isRequired
  },

  _currentArticles: function(_policy=null) {
    const { articleRequestPolicy } = this.state;
    const { article, zone } = this.props;

    let policy = _policy || articleRequestPolicy;

    if (zone && article.zoneArticles) {
      return article.zoneArticles[zone] && article.zoneArticles[zone][policy] || [];
    }
    else {
      return article[policy];
    }
  },

  getInitialState: function() {
    return({
      articleRequestPolicy: "hot",
      changingPolicy: false,
      isLoadingMore: true,
      didFocus: false,
      isRefreshing: false
    });
  },

  getDefaultProps: function() {
    return({
      zoneTitle: "綜合",
      zone: null
    });
  },

  componentDidMount: function() {
    const { requestArticles, zone } = this.props;
    const { articleRequestPolicy }  = this.state;

    this.setState({zone: zone});

    // handle oauth login
    KaifAPI.testAPI().then(data => {
      requestArticles(() => {this.setState({isLoadingMore: false})}, null, articleRequestPolicy, zone);
    }).catch(error => {
      KaifAPI.oauthLogin(access_token => {
        requestArticles(() => {this.setState({isLoadingMore: false})}, null, articleRequestPolicy, zone);
      });
    });

    InteractionManager.runAfterInteractions(() => {
      this.setState({didFocus: true});
    });
  },

  _handleArticleRequestPolicyChange: function(policy) {
    if (policy == this.state.articleRequestPolicy) { return }
    const { zone, requestArticles } = this.props;

    return () => {
      if (this._currentArticles(policy).length == 0) {
        this.setState({changingPolicy: true})

        requestArticles(
          () => { this.setState({changingPolicy: false, isLoadingMore: false}) },
          null,
          policy,
          zone
        );
      }

      this.setState({
        articleRequestPolicy: policy,
      });
    }
  },

  _onEndReach: function(e) {
    const { articleRequestPolicy }           = this.state;
    const { article, requestArticles, zone } = this.props;

    let currentArticles = this._currentArticles();

    if (currentArticles.length == 0 || this.state.fetchingArticles) { return }

    this.setState({
      fetchingArticles: true
    });

    requestArticles(
      () => { this.setState({fetchingArticles: false, isLoadingMore: false}) },  // callback
      currentArticles[currentArticles.length-1].articleId, // last articleId
      articleRequestPolicy,                                // "hot" or "latest"
      zone                                                 // default is null
    );
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

  _renderTabButton: function(policy) {
    const { articleRequestPolicy } = this.state;
    const { zoneTitle, zone } = this.props;
    let selectedStyle = (articleRequestPolicy == policy) ? { backgroundColor: '#eeeeee'} : {}

    let titleHash = {
      "hot": "熱門",
      "latest": "最新"
    }

    if (zone == "kaif-faq" || zone == "kaif-terms") return null;

    return(
      <TouchableHighlight underlayColor="transparent" style={{flex: 1, height: 28, justifyContent: 'center', ...selectedStyle}} onPress={this._handleArticleRequestPolicyChange(policy)}>
        <Text style={{color: 'black', textAlign: 'center'}}>
          {zoneTitle + titleHash[policy]}
        </Text>
      </TouchableHighlight>
    );
  },

  _renderTabSeperator: function() {
    return(
      <View style={{width: 1, height: 18, borderLeftWidth: 0.5, borderColor: 'rgba(178, 178, 178, 0.62)'}}/>
    );
  },

  _renderFooter: function() {
    if (this.state.isLoadingMore)
      return this._renderActivityIndicator();
    else {return null};
  },

  reloadArticles: function() {
    const { articleRequestPolicy, zone } = this.state;
    const { reloadArticles, requestArticles } = this.props;
    reloadArticles(
      () => { requestArticles(null, null, articleRequestPolicy, zone);},
      articleRequestPolicy,
      zone
    )
  },

  _handleVotePress: function(article) {
    const { articleRequestPolicy } = this.state;
    const { zone, voteForArticle, navigator } = this.props;

    return (event) => {
      let voteState = (article.vote.voteState == 'EMPTY') ? 'UP' : 'EMPTY';
      voteForArticle(
        null, // callback
        article.articleId,
        voteState,
        articleRequestPolicy,
        zone
      );
    }
  },

  render: function() {
    const {
      article,
      navigator,
      rootNavigator,
      events,
      dataSource
    } = this.props;

    return(
      <View style={{flex: 1, paddingTop: 64, paddingBottom: 50, overflow: 'hidden'}} >
        <View style={{flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.5, borderColor: 'rgba(178, 178, 178, 0.62)'}}>
          { this._renderTabButton("hot") }
          { this._renderTabButton("latest") }
        </View>
        {
          this.state.changingPolicy || !this.state.didFocus ?
            this._renderActivityIndicator() :
              <RefreshableListView
                showsVerticalScrollIndicator={true}
                style={{flex: 1}}
                contentContainerStyle={{justifyContent: 'space-between'}}
                dataSource={dataSource.cloneWithRows(this._currentArticles())}
                onEndReached={this._onEndReach}
                // onEndReachedThreshold={20}
                renderFooter={this._renderFooter}
                removeClippedSubviews={true}
                initialListSize={10}
                onChangeVisibleRows={this._onChangeVisibleRows}
                // pageSize={5}
                // scrollRenderAheadDistance={200}
                // premptiveLoading={65}
                loadData={this.reloadArticles}
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
                      />
                    );
                  }
                }
              />
        }
      </View>
    );
  }
});

function mapStateToProps(state) {
  // via https://github.com/rackt/redux/issues/683
  const { articleRequestPolicy, zone, article } = state;
  const dataSource = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2,
  });

  let policy = articleRequestPolicy;
  let articles;

  if (zone && article.zoneArticles) {
    articles = article.zoneArticles[zone] && article.zoneArticles[zone][policy] || [];
  }
  else {
    articles = article[policy] || [];
  }

  return {
    ...state,
    dataSource: dataSource.cloneWithRows(articles),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ArticleActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ArticleContainer);
