import React, {
  Text,
  Component,
  View,
  ScrollView,
  ListView,
  PropTypes,
  ActivityIndicatorIOS
} from 'react-native';
import Article from './Article';
import articleModel from '../models/articleModel';
import RefreshableListView from 'react-native-refreshable-listview';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux/native';
import * as ArticleActions from '../actions/article';

import KaifAPI from '../utils/KaifAPI';

export default class ArticleContainer extends Component {
  static defaultProps = {
    articles: []
  }

  static propTypes = {
    requestHotArticles: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      articles: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows([])
    }
  }

  componentDidMount = () => {
    this.handleOauthLogin();
  }

  reloadArticles = () => {
    const { requestHotArticles } = this.props;
    return new Promise((resolve, reject) => {
      requestHotArticles(data => {
        let articles = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(data.data)
        this.setState({
          articles: articles
        });
        resolve(articles);
      });
    })
  }

  handleOauthLogin = () => {
    const { requestHotArticles } = this.props;

    let action = () => {
      return requestHotArticles(articleData => {
        KaifAPI.requestIfArticlesVoted(articleData.data.map(_ => _.articleId)).then(voteData => {
          let articles = articleData.data.map(art => {
            for(let i = 0, l = voteData.data ? voteData.data.length : 0; i < l; i++) {
              if (voteData[i].data.targetId == art.articleId) {
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

    KaifAPI.testAPI().then(success => {
      if (success) {
        action();
      }
      else {
        KaifAPI.oauthLogin(access_token => {
          action();
        });
      }
    });
  }

  render = () => {
    const { navigator, rootNavigator } = this.props;

    return(
      <RefreshableListView
        showsVerticalScrollIndicator={true}
        style={{flex: 1, marginTop: 44}}
        contentContainerStyle={{justifyContent: 'space-between'}}
        dataSource={this.state.articles}
        loadData={this.reloadArticles}
        renderRow={
          (article, sectionID, rowID) => <Article article={ new articleModel(article) } key={ article.articleId } navigator={navigator} rootNavigator={rootNavigator} canHandleArticlePress={true}/>
        }
      />
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
