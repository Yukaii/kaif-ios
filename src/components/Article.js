import React, {
  View,
  Component,
  Text,
  TouchableHighlight
} from 'react-native';

import Router from '../routers';
import Icon from 'react-native-vector-icons/Ionicons';
import KaifIcon from './KaifIcon';

export default class Article extends Component {
  static defaultProps = {
    showVote: true
  }

  handleArticlePress = (event) => {
    const { article, navigator, canHandleArticlePress } = this.props;
    if (navigator && canHandleArticlePress) {
      let route = Router.getDebateRoute({
        article: article,
      })
      navigator.push(route);
    }
  }

  handleArticleTitlePress = (event) => {
    const { article, navigator } = this.props;
    if (navigator && article.isExternalLink() ) {
      let route = Router.getWebViewRoute({
        url: article.link
      })
      navigator.push(route);
    }
  }

  render = () => {
    const { article, style, touchableStyle, showVote } = this.props;

    defaultTouchableStyle = {
      underlayColor: "rgba(128, 128, 128, 0.19)"
    }

    return(
      <TouchableHighlight
        {...{...defaultTouchableStyle, ...touchableStyle} }
        onPress={this.handleArticlePress}
      >
        <View key={article.articleId}
          style={{paddingTop: 5, paddingLeft: 6, paddingRight: 10, paddingBottom: 5, marginBottom: 5, ...style}}>
          <View style={{flexDirection: 'row', flex: 1}}>
            {
              showVote ? (<TouchableHighlight underlayColor='rgba(255, 255, 255, 0)' style={{marginRight: 8, paddingTop: 1}}>
                <View style={{flexDirection: 'column', width: 22, alignItems: 'center'}}>
                  <KaifIcon style={{width: 13, height: 13, tintColor: "#b3b3b3", paddingTop: 3}}/>
                  <Text style={{textAlign: 'left', color: '#b3b3b3', marginTop: 3}}>{article.upVote}</Text>
                </View>
              </TouchableHighlight>) : (<View style={{marginRight: 8, width: 22}}/>)
            }
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
