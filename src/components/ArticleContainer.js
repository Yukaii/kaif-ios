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

import Router from '../routers';
import Article from './Article';
import ArticleHelper from '../utils/ArticleHelper';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux/native';
import * as ArticleActions from '../actions/article';

import KaifAPI from '../utils/KaifAPI';


let ArticleContainer = React.createClass({
  propTypes: {
    requestHotArticles: PropTypes.func.isRequired
  },

  getInitialState: function() {
    let dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

    return({
      dataSource: dataSource,
      articleRequestPolicy: "hot",
      changingPolicy: false,
      onloading: true,
      didFocus: false
    });
  },

  getDefaultProps: function() {
    return({
      zoneTitle: "綜合"
    });
  },

  componentDidMount: function() {
    this.handleOauthLogin();
    this.articleCache = {
      hot: [],
      latest: []
    }

    InteractionManager.runAfterInteractions(() => {
      this.setState({didFocus: true});
    });
  },

  articleRequestAction: function(lastArticleId=null) {
    const { articleRequestPolicy, dataSource } = this.state;
    const { policyFunctions } = this.props;

    return policyFunctions[articleRequestPolicy](lastArticleId).then(r => {
      KaifAPI.requestIfArticlesVoted(r.data.map(_ => _.articleId)).then(voteData => {
        let newArticles = r.data.map(art => {
          if (!voteData.data || voteData.data.length == 0) { return art; }

          for(let i = 0, l = voteData.data.length; i < l; i++) {
            if (voteData.data[i].targetId == art.articleId) {
              art.vote = voteData.data[i];
            }
          }
          return art;
        });

        if(this.articleCache[articleRequestPolicy] === 'undefined') {
          this.articleCache[articleRequestPolicy] = []
        }

        articlesLength = this.articleCache[articleRequestPolicy].length;
        if (lastArticleId || (!lastArticleId && articlesLength == 0)) {

          if (this.articleCache[articleRequestPolicy][articlesLength-1] != newArticles[newArticles.length-1]) {
            this.articleCache[articleRequestPolicy] = this.articleCache[articleRequestPolicy].concat(newArticles);

            this.setState({
              dataSource: dataSource.cloneWithRows(this.articleCache[articleRequestPolicy]),
            });
          }
        }

        if (this.state.changingPolicy == true) {
          this.setState({changingPolicy: false});
        }

        this.setState({onloading: false})
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
        dataSource: dataSource.cloneWithRows(this.articleCache[policy]),
      });

      this.articleRequestAction();
    }
  },

  _onEndReach: function(e) {
    const { articleRequestPolicy } = this.state;

    if (this.articleCache[articleRequestPolicy].length == 0 || this.hasFired == true) { return }

    this.hasFired = true;

    return this.articleRequestAction(
      this.articleCache[articleRequestPolicy][this.articleCache[articleRequestPolicy].length-1].articleId
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
    const { zoneTitle } = this.props;
    let selectedStyle = articleRequestPolicy == policy ? { backgroundColor: '#eeeeee'} : {}

    let titleHash = {
      "hot": "熱門",
      "latest": "最新"
    }

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
    if (!this.state.onLoading) { return; }
    else {
      return this._renderActivityIndicator();
    }
  },

  render: function() {
    const { navigator, rootNavigator, events } = this.props;

    return(
      <View style={{flex: 1, paddingTop: 64, paddingBottom: 50, overflow: 'hidden'}} >
        <View style={{flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.5, borderColor: 'rgba(178, 178, 178, 0.62)'}}>
          { this._renderTabButton("hot") }
          { this._renderTabButton("latest") }
        </View>
        {
          this.state.changingPolicy || !this.state.didFocus ?
            this._renderActivityIndicator() :
              <ListView
                showsVerticalScrollIndicator={true}
                style={{flex: 1}}
                contentContainerStyle={{justifyContent: 'space-between'}}
                dataSource={this.state.dataSource}
                onEndReached={this._onEndReach}
                // onEndReachedThreshold={20}
                renderFooter={this._renderFooter}
                removeClippedSubviews={true}
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
        }
      </View>
    );
  }
});

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ArticleActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ArticleContainer);
