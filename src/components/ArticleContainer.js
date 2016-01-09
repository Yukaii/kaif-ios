import React, {
  Text,
  Component,
  View,
  ScrollView,
  ListView,
  LinkingIOS,
  PropTypes,
  AsyncStorage
} from 'react-native';
import Article from './Article';
import articleModel from '../models/articleModel';

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
    const { requestHotArticles } = this.props;

    requestHotArticles(data => {
      this.setState({
        articles: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(data.data)
      });
    });

    // this.handleOauthLogin();
  }

  handleOauthLogin = () => {
    KaifAPI.getAccessToken().then(access_token => {
      // todo: test some api first
      if (access_token == null) {
        KaifAPI.oauthLogin(access_token => {
          alert(access_token)
        })
      }
    });
  }

  render = () => {
    const { navigator } = this.props;

    return(
      <ListView
        showsVerticalScrollIndicator={true}
        style={{flex: 1, marginTop: 44}}
        contentContainerStyle={{justifyContent: 'space-between'}}
        dataSource={this.state.articles}
        renderRow={
          (article, sectionID, rowID) => <Article article={ new articleModel(article) } key={ article.articleId } navigator={navigator} canHandleArticlePress={true}/>
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
