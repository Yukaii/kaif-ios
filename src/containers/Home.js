import React, {
  Component,
  View,
  Text,
  PropTypes,
  Navigator,
  TabBarIOS,
  NavigatorIOS,
  Button,
  Modal,
  StatusBarIOS
} from 'react-native';

import EventEmitter from 'EventEmitter';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux/native';

import ExNavigator from '@exponent/react-native-navigator';
import Icon from 'react-native-vector-icons/Ionicons';

import Setting from './Setting';
import Profile from './Profile';
import Zone from './Zone';
import ArticleContainer from './ArticleContainer';
import ExternalWebView from './ExternalWebView';

import Router from '../routers';

import KaifAPI from '../utils/KaifAPI';

let Home = React.createClass({
  getInitialState: function() {
    return({
      selectedTab: 'articleList',
      shouldPop: false,
      modalVisible: false
    });
  },

  componentWillMount: function() {
    this.eventEmitter = new EventEmitter();
  },

  componentDidMount: function() {
    StatusBarIOS.setStyle('default');
  },

  openShareAction: function(url) {
    return () => {
      ActionSheetIOS.showShareActionSheetWithOptions({
        url: url || "http://www.google.com.tw",
        message: url || "http://www.google.com.tw",
        subject: '透過 kaif.io 分享'
      },
      (error) => {
        // alert(error);
      },
      (success, method) => {
      });
    }
  },

  renderModal: function() {
    const {modalVisible, modalProps} = this.state;

    return(
      <Modal
        animated={true}
        visible={this.state.modalVisible}
      >
        <ExternalWebView
          {...modalProps}
          closeModal={() => {
            this.setState({modalVisible: false});
          }}
          openShareAction={this.openShareAction(modalProps.url)}
        />
      </Modal>
    );
  },

  render: function() {
    let showModal = (modalProps) => {
      this.setState({modalVisible: true, modalProps: modalProps}) ;
    };

    return (
        <View style={{flex: 1}}>
          {this.state.modalVisible ? this.renderModal() : null }
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

            <NavigatorIOS
              initialRoute={{
                component: ArticleContainer,
                title: '綜合文章',
                passProps: {
                  ...this.props,
                  showModal: showModal,
                  events: this.eventEmitter
                }
              }}
              style={{flex: 1}}/>
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
            <NavigatorIOS
              initialRoute={{
                component: Zone,
                title: '討論區',
                passProps: {
                  ...this.props,
                  showModal: showModal,
                  events: this.eventEmitter
                }
              }}
              style={{flex: 1}}/>
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
            <NavigatorIOS
              initialRoute={{
                component: Setting,
                title: '設定',
                passProps: {
                  ...this.props,
                  events: this.eventEmitter,
                }
              }}
              style={{flex: 1}}/>
          </Icon.TabBarItem>
        </TabBarIOS>
        </View>
    );
  }
});

export default Home;
