import React, {
  View,
  Component,
  Text,
  TouchableHighlight,
  RCTNativeAppEventEmitter
} from 'react-native';

import SafariView from "react-native-safari-view";

import Router from '../routers';
import Icon from 'react-native-vector-icons/Ionicons';
import ArticleHelper from '../utils/ArticleHelper';
import KaifIcon from './KaifIcon';

class Article extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visibility: true
    }
  }

  componentDidMount() {
    this.viewProperties = {
      width: 0,
      height: 0
    }
  }

  onLayout(evt) {
    // When the cell has actually been layed out, record the rendered width & height
    this.viewProperties.width = evt.nativeEvent.layout.width;
    this.viewProperties.height = evt.nativeEvent.layout.height;
  }

  handleArticlePress(event) {
    const {
      article,
      navigator,
      canHandleArticlePress,
      rootNavigator,
      events
    } = this.props;

    if (navigator && canHandleArticlePress) {
      let route = Router.getDebateRoute({
        article: article,
        rootNavigator: rootNavigator,
        events: events
      })
      navigator.push(route);
    }
  }

  handleArticleTitlePress(event) {
    const { article, rootNavigator } = this.props;
    if (ArticleHelper.isExternalLink(article.articleType)) {
      // SafariView.isAvailable()
      // .then(SafariView.show({
      //   url: article.link
      // }))
      // .catch(error => {
        if (rootNavigator) {
          let route = Router.getWebViewRoute({
            url: article.link,
            rootNavigator: rootNavigator
          })
          rootNavigator.push(route);
        }
      // });
    }
  }

  render() {
    const { article, style, touchableStyle } = this.props;

    defaultTouchableStyle = {
      underlayColor: "rgba(128, 128, 128, 0.19)"
    }

    let voteColor = article.vote && article.vote.voteState == "UP" ? '#ff5619' : '#b3b3b3'

    if (!this.state.visibility) {
      return(
        <View style={{width: this.viewProperties.width, height: this.viewProperties.height}}></View>
      );
    }

    return(
      <TouchableHighlight
        {...{...defaultTouchableStyle, ...touchableStyle} }
        onPress={this.handleArticlePress.bind(this)}
      >
        <View key={article.articleId}
          style={{paddingTop: 5, paddingLeft: 6, paddingRight: 10, paddingBottom: 5, marginBottom: 5, ...style}}>
          <View style={{flexDirection: 'row', flex: 1}}>
            <TouchableHighlight underlayColor='rgba(255, 255, 255, 0)' style={{marginRight: 8, paddingTop: 1}}>
              <View style={{flexDirection: 'column', width: 22, alignItems: 'center'}}>
                <KaifIcon color={voteColor} style={{}}/>
                <Text style={{textAlign: 'left', color: voteColor, marginTop: 3}}>{article.upVote}</Text>
              </View>
            </TouchableHighlight>
            <View style={{flexDirection: 'column', flex: 1}}>
              <View style={{flex: 3}}>
                <TouchableHighlight underlayColor='rgba(255, 255, 255, 0)'
                  onPress={this.handleArticleTitlePress.bind(this)}
                  >
                  <Text style={{fontSize: 16, marginBottom: 2}}>{ArticleHelper.procceedTitle(article.title)}</Text>
                </TouchableHighlight>
                <Text style={{color: 'rgb(97, 97, 97)', marginBottom: 3}}>{`(${ArticleHelper.linkHost(article.link, article.articleType)})`}</Text>
              </View>
              <View style={{flexDirection: 'row', flex: 1, justifyContent: 'flex-start'}}>
                <View style={{flexDirection: 'row', flex: 1}}>
                  <Icon name="arrow-right-b" size={10} color='rgb(97, 97, 97)' style={{marginTop: 3.5, marginRight: 3}}/>
                  <Text style={{color: 'rgb(97, 97, 97)'}}>{ArticleHelper.debateCountString(article.debateCount)}</Text>
                </View>
                <View style={{flexDirection: 'row', flex: 2.5}}>
                  <Icon name="arrow-right-b" size={10} color='rgb(97, 97, 97)' style={{marginTop: 3.5, marginRight: 3}}/>
                  <Text style={{color: 'rgb(97, 97, 97)', flex: 2}}>{article.zoneTitle}</Text>
                </View>
              </View>
              <View style={{flexDirection: 'row', flex: 1}}>
                <Text style={{color: 'rgb(97, 97, 97)'}}>{`${article.authorName} 張貼於 ${ArticleHelper.createTimeFromNow(article.createTime)}`}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  };
}

Article.defaultProps = {
  showVote: true
}

export default Article;
