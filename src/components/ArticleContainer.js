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
import SGListView from 'react-native-sglistview';

import Article from './Article';
import articleModel from '../models/articleModel';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux/native';
import * as ArticleActions from '../actions/article';

import KaifAPI from '../utils/KaifAPI';

let ArticleContainer = React.createClass({
  getInitialState: function() {
    return({
      articles: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows([]),
      rawArticles: {
        hot: [],
        latest: []
      },
      articleRequestPolicy: "hot",
      onLoading: false,
      changingPolicy: false
    });
  },

  componentDidMount: function() {
    this.handleOauthLogin();
    this.dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
  },

  articleRequestAction: function(lastArticleId=null) {
    const { articleRequestPolicy, rawArticles } = this.state;
    const { policyFunctions } = this.props;

    return policyFunctions[articleRequestPolicy](lastArticleId).then(articleData => {
      KaifAPI.requestIfArticlesVoted(articleData.data.map(_ => _.articleId)).then(voteData => {

        let articles = articleData.data.map(art => {
          if (!voteData.data || voteData.data.length == 0) { return art; }

          for(let i = 0, l = voteData.data.length; i < l; i++) {
            if (voteData.data[i].targetId == art.articleId) {
              art.vote = voteData.data[i];
            }
          }
          return art;
        });


        if (lastArticleId || (!lastArticleId && rawArticles[articleRequestPolicy].length == 0)) {
          rawArticles[articleRequestPolicy] = rawArticles[articleRequestPolicy].concat(articles);
          this.setState({
            articles: this.dataSource.cloneWithRows(rawArticles[articleRequestPolicy]),
            rawArticles: rawArticles,
            onLoading: false
          });
        }

        this.setState({changingPolicy: false});

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

    const { rawArticles } = this.state;

    return () => {
      this.setState({
        articleRequestPolicy: policy,
        changingPolicy: true,
        articles: this.dataSource.cloneWithRows(rawArticles[policy]),
      });

      this.articleRequestAction();
    }
  },

  _onEndReach: function() {
    const { articleRequestPolicy, rawArticles } = this.state;

    if (rawArticles[articleRequestPolicy].length == 0 || this.state.onLoading) { return }

    this.setState({onLoading: true})

    return this.articleRequestAction(
      rawArticles[articleRequestPolicy][rawArticles[articleRequestPolicy].length-1].articleId
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

  _renderFooter: function() {
    if (!this.state.onLoading) { return; }
    else {
      return this._renderActivityIndicator();
    }
  },

  _onRefresh: function() {
    // alert("refresh!")
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

  render: function() {
    const { navigator, rootNavigator, events } = this.props;

    return(
      <View style={{flex: 1, paddingTop: 64, overflow: 'hidden'}} >
        <View style={{flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.5, borderColor: 'rgba(178, 178, 178, 0.62)'}}>
          { this._renderTabButton("hot", "綜合熱門") }
          { this._renderTabButton("latest", "綜合最新") }
        </View>
        {
          this.state.changingPolicy ?
            this._renderActivityIndicator() :
            <ListView
              showsVerticalScrollIndicator={true}
              style={{flex: 1}}
              contentContainerStyle={{justifyContent: 'space-between'}}
              dataSource={this.state.articles}
              onEndReached={this._onEndReach}
              onEndReachedThreshold={20}
              renderFooter={this._renderFooter}
              removeClippedSubviews={true}
              premptiveLoading={30}
              renderRow={
                (article, sectionID, rowID) => {
                  return(
                    <Article
                      article={ new articleModel(article) }
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
        }
      </View>
    );
  }
});

ArticleContainer.propTypes = {
  requestHotArticles: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ArticleActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ArticleContainer);
