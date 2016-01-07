import React, {
  SegmentedControlIOS,
  Text,
  Component,
  View
} from 'react-native';
import config from '../config/config';

export default class Profile extends Component {
  render = () => {
    return(
      <View >
        <View style={{margin: 10, marginTop: 0}}>
          <SegmentedControlIOS values={['分享文章', '評論', '按讚']} />
        </View>
      </View>
    );
  }
}
