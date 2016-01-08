import React, {
  Component,
  View,
  Text,
  PropTypes,
  Navigator,
  TabBarIOS,
  Button
} from 'react-native';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux/native';

import ExNavigator from '@exponent/react-native-navigator';
import Icon from 'react-native-vector-icons/Ionicons';

import Setting from '../components/Setting';
import Profile from '../components/Profile';
import Zone from '../components/Zone';
import ArticleContainer from '../components/ArticleContainer';

import Router from '../routers';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'articleList'
    }
  }

  render() {
    return (
        <TabBarIOS
          tintColor="#0078e7"
        >
        <Icon.TabBarItem
          title="文章"
          iconName="ios-paper"
          selectedIconName="ios-paper"
          selected={this.state.selectedTab === 'articleList'}
          onPress={() => {
            this.setState({
              selectedTab: 'articleList',
            });
          }}>
          <ExNavigator
            initialRoute={Router.getArticleRoute()}
            style={{ flex: 1 }}
            sceneStyle={{  }}
            configureScene={ (route) => Navigator.SceneConfigs.FloatFromLeft }
          />
        </Icon.TabBarItem>
        <Icon.TabBarItem
          title="討論區"
          iconName="chatboxes"
          selectedIconName="chatboxes"
          selected={this.state.selectedTab === 'zoneList'}
          onPress={() => {
            this.setState({
              selectedTab: 'zoneList'
            });
        }}>
        <View></View>
        </Icon.TabBarItem>
        <Icon.TabBarItem
          title="個人資料"
          iconName="person"
          selectedIconName="person"
          selected={this.state.selectedTab === 'profileTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'profileTab'
            });
        }}>
        <View></View>
        </Icon.TabBarItem>
        <Icon.TabBarItem
          title="設定"
          iconName="ios-cog"
          selectedIconName="ios-cog"
          selected={this.state.selectedTab === 'settingTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'settingTab'
            });
        }}>
        <ExNavigator
          initialRoute={Router.getSettingRoute()}
          style={{ flex: 1 }}
          sceneStyle={{ }}
          configureScene={ (route) => Navigator.SceneConfigs.FloatFromLeft }
        />
        </Icon.TabBarItem>
      </TabBarIOS>
    );
  }
}
