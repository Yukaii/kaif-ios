import React, {
  Text,
  Component,
  View,
  ScrollView,
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
      articles: []
    }
  }

  componentDidMount = () => {
    const { requestHotArticles } = this.props;

    requestHotArticles(data => {
      this.setState({articles: data.data});
    });

    // this.handleOauthLogin();
  }

  handleOauthLogin = () => {
    KaifAPI.getAccessToken().then(access_token => {
      // todo: test some api first
      if (access_token == 'undefined') {
        KaifAPI.oauthLogin(access_token => {
          alert(access_token)
        })
      }
    });
  }

  render = () => {
    return(
      <ScrollView
        style={{flex: 1, paddingTop: 14}}
        contentContainerStyle={{justifyContent: 'space-between', marginTop: 32}}>
        { this.state.articles.map(article => {
          return <Article article={ new articleModel(article) } key={ article.articleId } />
        }) }
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
