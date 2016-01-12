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
import KaifIcon from './KaifIcon';

export default class Article extends Component {
  static defaultProps = {
    showVote: true
  }

  handleArticlePress = (event) => {
    const { article, navigator, canHandleArticlePress, rootNavigator, events } = this.props;
    if (navigator && canHandleArticlePress) {
      let route = Router.getDebateRoute({
        article: article,
        rootNavigator: rootNavigator,
        events: events
      })
      navigator.push(route);
    }
  }

  handleArticleTitlePress = (event) => {
    const { article, rootNavigator } = this.props;
    if (article.isExternalLink()) {
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

  render = () => {
    const { article, style, touchableStyle } = this.props;

    defaultTouchableStyle = {
      underlayColor: "rgba(128, 128, 128, 0.19)"
    }

    let voteColor = article.vote && article.vote.voteState == "UP" ? '#ff5619' : '#b3b3b3'

    return(
      <TouchableHighlight
        {...{...defaultTouchableStyle, ...touchableStyle} }
        onPress={this.handleArticlePress}
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
                  onPress={this.handleArticleTitlePress}
                  >
                  <Text style={{fontSize: 16, marginBottom: 2}}>{article.procceedTitle()}</Text>
                </TouchableHighlight>
                <Text style={{color: 'rgb(97, 97, 97)', marginBottom: 3}}>{`(${article.linkHost()})`}</Text>
              </View>
              <View style={{flexDirection: 'row', flex: 1, justifyContent: 'flex-start'}}>
                <View style={{flexDirection: 'row', flex: 1}}>
                  <Icon name="arrow-right-b" size={10} color='rgb(97, 97, 97)' style={{marginTop: 3.5, marginRight: 3}}/>
                  <Text style={{color: 'rgb(97, 97, 97)'}}>{article.debateCountString()}</Text>
                </View>
                <View style={{flexDirection: 'row', flex: 2.5}}>
                  <Icon name="arrow-right-b" size={10} color='rgb(97, 97, 97)' style={{marginTop: 3.5, marginRight: 3}}/>
                  <Text style={{color: 'rgb(97, 97, 97)', flex: 2}}>{article.zoneTitle}</Text>
                </View>
              </View>
              <View style={{flexDirection: 'row', flex: 1}}>
                <Text style={{color: 'rgb(97, 97, 97)'}}>{`${article.authorName} 張貼於 ${article.createTimeFromNow()}`}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}
