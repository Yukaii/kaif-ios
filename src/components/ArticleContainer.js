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
      articleRequestPolicy: "hot"
    }
  }

  componentDidMount = () => {
    this.handleOauthLogin();
  }

  articleRequestAction = () => {
    let policyFunctions = {
      "hot": KaifAPI.requestHotArticles,
      "latest": KaifAPI.requestLatestArticles
    }

    return policyFunctions[this.state.articleRequestPolicy]().then(articleData => {
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

        this.setState({
          articles: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(articles)
        });
      })
    });
  }

  currentPolicyChanged = (policy) => {
    return policy != this.state.articleRequestPolicy
  }

  handleOauthLogin = () => {
    const { requestHotArticles } = this.props;

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
    if (!this.currentPolicyChanged) { return; }

    return () => {
      this.setState({
        articleRequestPolicy: policy
      });
      this.articleRequestAction();
    }
  }

  render = () => {
    const { navigator, rootNavigator, events } = this.props;

    return(
      <ScrollView style={{flex: 1, marginTop: 43}}>
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
          renderRow={
            (article, sectionID, rowID) => <Article article={ new articleModel(article) } key={ article.articleId } navigator={navigator} events={events} rootNavigator={rootNavigator} canHandleArticlePress={true}/>
        }/>
      </ScrollView>
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
