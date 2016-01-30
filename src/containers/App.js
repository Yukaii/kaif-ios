import React, { Component, View, Modal, ActionSheetIOS } from 'react-native';
import ExNavigator from '@exponent/react-native-navigator';
import Router from '../routers';
import Home from './Home'


export default class App extends Component {

  render() {
    return(
      <View style={{flex: 1}}>
        <ExNavigator
          initialRoute={Router.getHomeRoute()}
          style={{flex: 1}}
          showNavigationBar={false}
        />
      </View>
    );
  }
}
