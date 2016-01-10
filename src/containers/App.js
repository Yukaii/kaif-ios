import React, { Component, View } from 'react-native';
import ExNavigator from '@exponent/react-native-navigator';
import Router from '../routers';
import Home from './Home'

export default class App extends Component {
  render() {
    return(
      <ExNavigator
        initialRoute={Router.getHomeRoute()}
        style={{ flex: 1 }}
        sceneStyle={{  }}
        showNavigationBar={false}
      />
    );
  }
}
