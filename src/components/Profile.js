import React, {
  SegmentedControlIOS,
  Text,
  Component,
  View,
  ActivityIndicatorIOS
} from 'react-native';
import moment from 'moment';
import KaifAPI from '../utils/KaifAPI';

let Profile = React.createClass({
  getInitialState: function() {
    return({
      profile: null
    });
  },

  componentDidMount: function() {
    KaifAPI.requestBasicUserProfile().then(data => {
      if(data.data) {
        this.setState({profile: data.data});
      }
    })
  },

  _renderUserData: function() {
    const { profile } = this.state;
    if (!profile) {
      return(
        <ActivityIndicatorIOS
          animating={true}
          style={{alignItems: 'center', justifyContent: 'center', height: 80}}
          size="small"
        />
      );
    } else {
      return(
        <View style={{marginTop: 20}}>
          <Text style={{alignSelf: 'center', fontSize: 20, fontWeight: 'bold', marginBottom: 10}}>{profile.username}</Text>
          <Text style={{alignSelf: 'center', paddingLeft: 30, paddingRight: 30, marginBottom: 10, color: 'rgb(122, 122, 122)'}}>{profile.description}</Text>
          <Text style={{alignSelf: 'center', color: 'rgb(122, 122, 122)'}}>since {moment(profile.createTime).fromNow()}</Text>
        </View>
      );
    }
  },

  render: function() {
    return(
      <View style={{flex:1, paddingTop: 64, marginBottom: 48, paddingLeft: 5, paddingRight: 5}}>
        { this._renderUserData() }
        <View style={{paddingTop: 10}}>
          <SegmentedControlIOS values={['我分享的文章', '我的評論']} />
        </View>
      </View>
    );
  }
});

export default Profile;
