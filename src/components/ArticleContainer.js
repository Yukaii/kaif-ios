import React, {
  Text,
  Component,
  View,
  ScrollView,
  ListView,
  PropTypes,
  ActivityIndicatorIOS,
  TouchableHighlight
} from 'react-native';

import Article from './Article';
import articleModel from '../models/articleModel';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux/native';
import * as ArticleActions from '../actions/article';

import KaifAPI from '../utils/KaifAPI';

export default class ArticleContainer extends Component {
  static propTypes = {
    requestHotArticles: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      articles: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows([]),
      rawArticles: {
        hot: [],
        latest: []
      },
      articleRequestPolicy: "hot",
      onLoading: false
    }
  }

  componentDidMount = () => {
    this.handleOauthLogin();
    this.dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
  }

  articleRequestAction = (lastArticleId=null) => {
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

      })
    });
  }

  _isCurrentPolicyChanged = (policy) => {
    return policy != this.state.articleRequestPolicy
  }

  handleOauthLogin = () => {
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
  }

  handleArticleRequestPolicyChange = (policy) => {
    if (!this._isCurrentPolicyChanged) { return; }

    const { rawArticles } = this.state;

    return () => {
      this.setState({
        articleRequestPolicy: policy,
        articles: this.dataSource.cloneWithRows(rawArticles[policy]),
      });

      this.articleRequestAction();
    }
  }

  _onEndReach = () => {
    const { articleRequestPolicy, rawArticles } = this.state;

    if (rawArticles[articleRequestPolicy].length == 0 || this.state.onLoading) { return }

    this.setState({onLoading: true})

    return this.articleRequestAction(
      rawArticles[articleRequestPolicy][rawArticles[articleRequestPolicy].length-1].articleId
    );
  }

  _renderFooter = () => {
    if (!this.state.onLoading) { return; }
    else {
      return(
        <ActivityIndicatorIOS
            animating={true}
            style={{alignItems: 'center', justifyContent: 'center', height: 80}}
            size="small"
          />
      );
    }

  }

  render = () => {
    const { navigator, rootNavigator, events } = this.props;

    return(
      <View style={{flex: 1, paddingTop: 64}} >
        <View style={{height: 28, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.5, borderColor: 'rgba(178, 178, 178, 0.62)'}}>
          <TouchableHighlight underlayColor="transparent" style={{flex: 1, height: 28, justifyContent: 'center'}} onPress={this.handleArticleRequestPolicyChange("hot")}>
            <Text style={{color: 'black', textAlign: 'center'}}>
              綜合熱門
            </Text>
          </TouchableHighlight>
          <View style={{width: 1, height: 18, borderLeftWidth: 0.5, borderColor: 'rgba(178, 178, 178, 0.62)'}}/>
          <TouchableHighlight underlayColor="transparent" style={{flex: 1, height: 28, justifyContent: 'center'}} onPress={this.handleArticleRequestPolicyChange("latest")}>
            <Text style={{color: 'black', textAlign: 'center'}}>
              綜合最新
            </Text>
          </TouchableHighlight>
        </View>
        <ListView
          showsVerticalScrollIndicator={true}
          style={{flex: 1}}
          contentContainerStyle={{justifyContent: 'space-between'}}
          dataSource={this.state.articles}
          onEndReached={this._onEndReach}
          onEndReachedThreshold={15}
          renderFooter={this._renderFooter}
          renderRow={
            (article, sectionID, rowID) => <Article article={ new articleModel(article) } key={ article.articleId } navigator={navigator} events={events} rootNavigator={rootNavigator} canHandleArticlePress={true}/>
          }/>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ArticleActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ArticleContainer);
