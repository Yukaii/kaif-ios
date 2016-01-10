import React, {
  Component,
  View,
  Text,
  PropTypes,
  Navigator,
  TabBarIOS,
  Button,
  StatusBarIOS
} from 'react-native';

import EventEmitter from 'EventEmitter';

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
      selectedTab: 'articleList',
      shouldPop: false
    }
  }

  componentWillMount = () => {
    this.eventEmitter = new EventEmitter();
  }

  componentDidMount = () => {
    StatusBarIOS.setStyle('default');
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
            if (this.state.selectedTab === 'articleList') {
              this.eventEmitter.emit('shouldPop');
            }
            this.setState({
              selectedTab: 'articleList',
            });
          }}>
          <ExNavigator
            initialRoute={Router.getArticleRoute({...this.props, events: this.eventEmitter})}
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
            if (this.state.selectedTab === 'zoneList') {
              this.eventEmitter.emit('shouldPop');
            }
            this.setState({
              selectedTab: 'zoneList'
            });
        }}>
          <ExNavigator
            initialRoute={Router.getZoneRoute({...this.props, events: this.eventEmitter})}
            style={{ flex: 1 }}
            sceneStyle={{  }}
            configureScene={ (route) => Navigator.SceneConfigs.FloatFromLeft }
          />
        </Icon.TabBarItem>
        <Icon.TabBarItem
          title="個人資料"
          iconName="person"
          selectedIconName="person"
          selected={this.state.selectedTab === 'profileTab'}
          onPress={() => {
            if (this.state.selectedTab === 'profileTab') {
              this.eventEmitter.emit('shouldPop');
            }
            this.setState({
              selectedTab: 'profileTab'
            });
        }}>
          <ExNavigator
            initialRoute={Router.getProfileRoute({...this.props, events: this.eventEmitter})}
            style={{ flex: 1 }}
          />
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
        />
        </Icon.TabBarItem>
      </TabBarIOS>
    );
  }
}
