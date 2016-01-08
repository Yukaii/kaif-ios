import React, {
  View,
  Component,
  Text
} from 'react-native';

export default class Debate extends Component {
  render() {
    const {debate} = this.props;

    return(
      <View style={{flex: 1, backgroundColor: '#eeeeee', marginBottom: 6}}>
        <View style={{flexDirection: 'row', marginTop: 4, marginBottom: 3}}>
          <Text style={{color: 'rgb(97, 97, 97)'}}>{debate.debaterName}</Text>
          <View style={{ borderRadius: 2, borderWidth: 1.5, paddingLeft: 2, paddingRight: 2, marginTop: -1, marginLeft: 4, marginRight: 4, borderColor: '#cccccc' }}>
            <Text style={{color: '#777777'}}>{debate.upVote - debate.downVote}</Text>
          </View>
          <Text style={{color: '#777777'}}>{debate.lastUpdateTimeFromNow()}</Text>
        </View>
        <Text>{debate.content}</Text>
      </View>
    );
  }
}
