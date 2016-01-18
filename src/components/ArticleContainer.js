import React, {
  Text,
  Component,
  View,
  ScrollView,
  ListView,
  PropTypes,
  ActivityIndicatorIOS,
  TouchableHighlight,
  RefreshControl
} from 'react-native';

import TableView, {
  Section,
  Item,
  Cell
} from 'react-native-tableview';

// import SGListView from '../utils/SGListView';
import Router from '../routers';
import Article from './Article';
import ArticleHelper from '../utils/ArticleHelper';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux/native';
import * as ArticleActions from '../actions/article';

import KaifAPI from '../utils/KaifAPI';

let articleCache = {
  hot: [],
  latest: []
}

let ArticleContainer = React.createClass({
  propTypes: {
    requestHotArticles: PropTypes.func.isRequired
  },

  getInitialState: function() {
    let dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

    return({
      // dataSource: dataSource,
      articleRequestPolicy: "hot",
      // onLoadingMore: false,
      changingPolicy: false,
      articles: []
    });
  },

  componentDidMount: function() {
    this.handleOauthLogin();
  },

  articleRequestAction: function(lastArticleId=null) {
    const { articleRequestPolicy, dataSource } = this.state;
    const { policyFunctions } = this.props;

    return policyFunctions[articleRequestPolicy](lastArticleId).then(articleData => {
      KaifAPI.requestIfArticlesVoted(articleData.data.map(_ => _.articleId)).then(voteData => {
        let newArticles = articleData.data.map(art => {
          if (!voteData.data || voteData.data.length == 0) { return art; }

          for(let i = 0, l = voteData.data.length; i < l; i++) {
            if (voteData.data[i].targetId == art.articleId) {
              art.vote = voteData.data[i];
            }
          }
          return art;
        });

        if(articleCache[articleRequestPolicy] === 'undefined') {
          articleCache[articleRequestPolicy] = []
        }

        articlesLength = articleCache[articleRequestPolicy].length;
        if (lastArticleId || (!lastArticleId && articlesLength == 0)) {

          if (articleCache[articleRequestPolicy][articlesLength-1] != newArticles[newArticles.length-1]) {
            articleCache[articleRequestPolicy] = articleCache[articleRequestPolicy].concat(newArticles);

            this.setState({
              // dataSource: dataSource.cloneWithRows(articleCache[articleRequestPolicy]),
              articles: articleCache[articleRequestPolicy],
              // onLoadingMore: false
            });
          }
        }

        if (this.state.changingPolicy == true) {
          this.setState({changingPolicy: false});
        }

        this.hasFired = false;
      })
    });
  },

  _isCurrentPolicyChanged: function(policy) {
    return policy != this.state.articleRequestPolicy
  },

  handleOauthLogin: function() {
    KaifAPI.testAPI().then(success => {
      if (success) {
        this.articleRequestAction();
      }
      else {
        KaifAPI.oauthLogin(access_token => {
          this.articleRequestAction();
        });
      }
    });
  },

  _handleArticleRequestPolicyChange: function(policy) {
    if (!this._isCurrentPolicyChanged) { return; }

    const { dataSource } = this.state;

    return () => {
      this.setState({
        articleRequestPolicy: policy,
        changingPolicy: true,
        // dataSource: dataSource.cloneWithRows(articleCache[policy]),
        articles: articleCache[policy]
      });

      this.articleRequestAction();
    }
  },

  _onEndReach: function(e) {
    const { articleRequestPolicy } = this.state;

    if (articleCache[articleRequestPolicy].length == 0 || this.hasFired == true) { return }

    this.hasFired = true;

    return this.articleRequestAction(
      articleCache[articleRequestPolicy][articleCache[articleRequestPolicy].length-1].articleId
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

  _renderTabButton: function(policy, text) {
    const { articleRequestPolicy } = this.state;
    let selectedStyle = articleRequestPolicy == policy ? { backgroundColor: '#eeeeee'} : {}

    return(
      <TouchableHighlight underlayColor="transparent" style={{flex: 1, height: 28, justifyContent: 'center', ...selectedStyle}} onPress={this._handleArticleRequestPolicyChange(policy)}>
        <Text style={{color: 'black', textAlign: 'center'}}>
          {text}
        </Text>
      </TouchableHighlight>
    );
  },

  _renderTabSeperator: function() {
    return(
      <View style={{width: 1, height: 18, borderLeftWidth: 0.5, borderColor: 'rgba(178, 178, 178, 0.62)'}}/>
    );
  },

  _handleArticlePress(event) {
    const {
      navigator,
      rootNavigator,
      events
    } = this.props;

    let article = this.state.articles[event.selectedIndex]

    if (navigator) {
      let route = Router.getDebateRoute({
        article: article,
        rootNavigator: rootNavigator,
        events: events
      })
      navigator.push(route);
    }
  },

  onScroll(event) {
    let contentLength = event.nativeEvent.contentSize['height']
    let visibleLength = event.nativeEvent.layoutMeasurement['height']
    let offset = event.nativeEvent.contentOffset['y']

    let maxLength = Math.max(contentLength, visibleLength)

    if (maxLength - visibleLength - offset < 40 && this._sentEndForContentLength !== contentLength) {
      this._sentEndForContentLength = contentLength;
      this._onEndReach(event);
    }
  },

  render: function() {
    const { navigator, rootNavigator, events } = this.props;

    return(
      <View style={{flex: 1, paddingTop: 64, paddingBottom: 50, overflow: 'hidden'}} >
        <View style={{flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.5, borderColor: 'rgba(178, 178, 178, 0.62)'}}>
          { this._renderTabButton("hot", "綜合熱門") }
          { this._renderTabButton("latest", "綜合最新") }
        </View>
        {
          this.state.changingPolicy || this.state.articles.length == 0 ?
            this._renderActivityIndicator() :
              <TableView style={{flex:1}}
                separatorStyle={TableView.Consts.SeparatorStyle.None}
                onPress={this._handleArticlePress}
                onScroll={this.onScroll}
              >
                <Section>
                  {
                    this.state.articles.map(article => {
                      return(
                        <Cell key={ article.articleId }>
                          <Article
                            article={ article }
                            key={ article.articleId }
                            navigator={navigator}
                            events={events}
                            rootNavigator={rootNavigator}
                          />
                        </Cell>
                      );
                    })
                  }
                  <Cell>
                    { this._renderActivityIndicator() }
                  </Cell>
                </Section>
              </TableView>
        }
      </View>
    );
  }
});


/*
<ListView
  showsVerticalScrollIndicator={false}
  style={{flex: 1}}
  contentContainerStyle={{justifyContent: 'space-between'}}
  dataSource={this.state.dataSource}
  onEndReached={this._onEndReach}
  // onEndReachedThreshold={20}
  renderFooter={this._renderFooter}
  // removeClippedSubviews={true}
  initialListSize={10}
  onChangeVisibleRows={this._onChangeVisibleRows}
  pageSize={5}
  // scrollRenderAheadDistance={200}
  // premptiveLoading={65}
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
        />
      );
    }
  }
/>
*/

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ArticleActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ArticleContainer);
