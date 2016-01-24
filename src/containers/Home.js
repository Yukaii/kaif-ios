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

import KaifAPI from '../utils/KaifAPI';

let Home = React.createClass({
  getInitialState: function() {
    return({
      selectedTab: 'articleList',
      shouldPop: false
    });
  },

  componentWillMount: function() {
    this.eventEmitter = new EventEmitter();
  },

  componentDidMount: function() {
    StatusBarIOS.setStyle('default');
  },

  render: function() {
    return (
        <TabBarIOS
          tintColor="#0078e7"
          translucent={true}
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
            initialRoute={Router.getArticleRoute(
              {...this.props,
                events: this.eventEmitter,
                policyFunctions: {
                  "hot": KaifAPI.requestHotArticles,
                  "latest": KaifAPI.requestLatestArticles
                }
              })
            }
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
            if (this.state.selectedTab === 'settingTab') {
              this.eventEmitter.emit('shouldPop');
            }
            this.setState({
              selectedTab: 'settingTab'
            });
        }}>
        <ExNavigator
          initialRoute={Router.getSettingRoute({...this.props, events: this.eventEmitter})}
          style={{ flex: 1 }}
        />
        </Icon.TabBarItem>
      </TabBarIOS>
    );
  }
});

export default Home;
