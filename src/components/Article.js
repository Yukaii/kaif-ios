import React, {
  View,
  Component,
  Text,
  TouchableHighlight
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default class Article extends Component {
  render = () => {
    const { article } = this.props;

    return(
      <TouchableHighlight underlayColor="rgba(128, 128, 128, 0.19)">
        <View style={{marginBottom: 8}} key={article.articleId} style={{paddingTop: 5, paddingLeft: 10, paddingRight: 10, marginBottom: 8}}>
          <View style={{flexDirection: 'row', flex: 1}}>
            <View style={{marginRight: 5}}>
              <Icon name="arrow-up-b" size={20} color="#ff5619"/>
            </View>
            <View style={{flexDirection: 'column', flex: 1}}>
              <View style={{flex: 3}}>
                <Text style={{fontSize: 16, marginBottom: 2}}>{article.procceedTitle()}</Text>
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
