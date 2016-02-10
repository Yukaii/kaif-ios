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
import Subscribable from 'Subscribable';

import TableView, {
  Section,
  Item,
  Cell
} from 'react-native-tableview';

import Icon from 'react-native-vector-icons/Ionicons';

import Router from '../routers';
import Article from '../components/Article';
import ArticleListView from '../components/ArticleListView';
import ArticleHelper from '../utils/ArticleHelper';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux/native';
import * as ArticleActions from '../actions/article';

import KaifAPI from '../utils/KaifAPI';

const dataSource = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
});

let ArticleContainer = React.createClass({
  mixins: [Subscribable.Mixin],

  propTypes: {
    dataSource: PropTypes.object,
    requestArticles: PropTypes.func.isRequired
  },

  _currentArticles: function(_policy=null) {
    const { articleRequestPolicy } = this.state;
    const { articles, zone } = this.props;

    let policy = _policy || articleRequestPolicy;

    if (zone && articles.zoneArticleIdArray) {
      return articles.zoneArticleIdArray[zone] && articles.zoneArticleIdArray[zone][policy].map(articleId => articles.articleHash[articleId]).filter(article => typeof article != 'undefined') || [];
    }
    else {
      return articles.articleIdArray[policy] && articles.articleIdArray[policy].map(articleId  => articles.articleHash[articleId]).filter(article => typeof article != 'undefined');
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
    const { requestArticles, zone, events, navigator, navigatorType } = this.props;
    const { articleRequestPolicy }  = this.state;

    this.setState({zone: zone});

    InteractionManager.runAfterInteractions(() => {
      // handle oauth login
      KaifAPI.testAPI().then(data => {
        requestArticles(() => {this.setState({isLoadingMore: false})}, null, articleRequestPolicy, zone);
      }).catch(error => {
        KaifAPI.oauthLogin(access_token => {
          requestArticles(() => {this.setState({isLoadingMore: false})}, null, articleRequestPolicy, zone);
        });
      });
      this.setState({didFocus: true});
    });
    Icon.getImageSource('ios-upload-outline', 25, "#0078e7").then(source => this.setState({shareButtonSource: source}));
    this.addListenerOn(events, 'shouldPop', () => { navigator.pop() });
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
    const { articleRequestPolicy }  = this.state;
    const { requestArticles, zone } = this.props;

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
    let touchSelectedStyle = (articleRequestPolicy == policy) ? {} : {}
    let textSelectedStyle = (articleRequestPolicy == policy) ? { color: '#0078e7' } : {}

    let titleHash = {
      "hot": "熱門",
      "latest": "最新"
    }

    if (zone == "kaif-faq" || zone == "kaif-terms") return false;

    return(
      <TouchableHighlight underlayColor="transparent" style={{flex: 1, height: 28, justifyContent: 'center', ...touchSelectedStyle}} onPress={this._handleArticleRequestPolicyChange(policy)}>
        <Text style={[{color: 'black', textAlign: 'center'}, textSelectedStyle]}>
          {titleHash[policy]}
        </Text>
      </TouchableHighlight>
    );
  },

  _renderTabSeperator: function() {
    const { zoneTitle, zone } = this.props;

    if (zone == "kaif-faq" || zone == "kaif-terms") return false;
    return(
      <View style={{width: 1, height: 18, borderLeftWidth: 0.5, borderColor: 'rgba(178, 178, 178, 0.62)'}}/>
    );
  },

  _renderFooter: function() {
    if (this.state.isLoadingMore)
      return this._renderActivityIndicator();
    else { return false; }
  },

  reloadArticles: function() {
    const { articleRequestPolicy, zone } = this.state;
    const { reloadArticles, requestArticles } = this.props;

    this.setState({isRefreshing: true});
    reloadArticles(
      () => {
        requestArticles(null, null, articleRequestPolicy, zone);
        this.setState({isRefreshing: false});
      },
      articleRequestPolicy,
      zone
    )
  },

  render: function() {
    const {
      articles,
      navigator,
      navigatorType,
      rootNavigator,
      events,
      dataSource,
      showModal
    } = this.props;

    if (!this.state.shareButtonSource) { return false; }

    return(
      <View style={{flex: 1, paddingTop: 64, paddingBottom: 50, overflow: 'hidden'}} >
        <View style={{flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.5, borderColor: 'rgba(178, 178, 178, 0.62)'}}>
          { this._renderTabButton("hot") }
          { this._renderTabSeperator() }
          { this._renderTabButton("latest") }
        </View>
        {
          this.state.changingPolicy || !this.state.didFocus ?
            this._renderActivityIndicator() :
              <ArticleListView
                dataSource={dataSource.cloneWithRows(this._currentArticles())}
                onEndReached={this._onEndReach}
                renderFooter={this._renderFooter}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.isRefreshing}
                    onRefresh={this.reloadArticles}
                  />
                }
                articleProps={{
                  navigatorType: navigatorType,
                  navigator: navigator,
                  events: events,
                  rootNavigator: rootNavigator,
                  canHandleArticlePress: true,
                  shareButtonSource: this.state.shareButtonSource
                }}
              />
        }
      </View>
    );
  }
});

function mapStateToProps(state) {
  // via https://github.com/rackt/redux/issues/683
  const { articleRequestPolicy, zone, articles } = state;

  let policy = articleRequestPolicy;
  let articleRows;

  if (zone && articles.zoneArticles) {
    articleRows = articles.zoneArticleIdArray[zone] && articles.zoneArticleIdArray[zone][policy].map(articleId => articles.articleHash[articleId]).filter(article => typeof article != 'undefined');
  }
  else {
    articleRows = articles.articleIdArray[policy] && articles.articleIdArray[policy].map(articleId => articles.articleHash[articleId]).filter(article => typeof article != 'undefined') || [];
  }

  return {
    ...state,
    dataSource: dataSource.cloneWithRows(articleRows),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ArticleActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ArticleContainer);
