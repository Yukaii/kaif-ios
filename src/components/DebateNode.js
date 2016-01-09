import React, {
  View,
  Text,
  Component,
  ScrollView
} from 'react-native';

import KaifAPI from '../utils/KaifAPI';
import Article from './Article';
import Debate from './Debate';
import debateModel from '../models/debateModel';
import articleModel from '../models/articleModel';

export default class DebateNode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      debate: null
    }
  }

  componentDidMount = () => {
    const { article } = this.props;
    KaifAPI.requestArticleDebates(article.articleId).then(data => {
      this.setState({
        debate: data.data
      });
    });
  }

  renderDebate = (data) => {
    return(
      <View key={data.debate.debateId} style={{paddingLeft: 5, paddingRight: 5}}>
        <Debate debate={new debateModel(data.debate)}/>
        <View style={{marginLeft: 5, borderColor: '#d2dbe6', borderLeftWidth: 2, paddingLeft: 5, backgroundColor: '#eeeeee'}} >
          { data.children.map(data => this.renderDebate(data)) }
        </View>
      </View>
    );
  }

  render = () => {
    const { article, navigator } = this.props;
    return(
      <View style={{flex: 1, paddingTop: 64, paddingBottom: 48, backgroundColor: '#eeeeee'}}>
        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={{ paddingBottom: 32, justifyContent: 'space-between', backgroundColor: '#eeeeee'}}
        >
          <Article
            article={ new articleModel(article) }
            touchableStyle={{underlayColor: '#eeeeee'}}
            style={{
              backgroundColor: '#d1dbe5',
            }}
            navigator={navigator}
          />
          { this.state.debate !== null ? this.state.debate.children.map(data => this.renderDebate(data)) : null }
        </ScrollView>
      </View>
    );
  }
}
