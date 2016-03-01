import React, {
  ListView,
  TouchableHighlight,
  Text,
  View,
  Component,
  AlertIOS,
  ScrollView
} from 'react-native';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux/native';
import * as ArticleActions from '../actions/article';

import KaifAPI from '../utils/KaifAPI';
import Cell from '../components/Cell';
import ArticleContainer from '../containers/ArticleContainer';
import InterfaceSetting from '../containers/Settings/InterfaceSetting';
import About from '../containers/About';
import Router from '../routers';

import Icon from 'react-native-vector-icons/FontAwesome';

let Setting = React.createClass({
  handleSettingOptionPress: function(value) {
    const {
      navigator,
      rootNavigator,
      logout,
      events,
      emitMessage,
      navigatorType
    } = this.props;

    switch(value) {
      case "interface":
        navigator.push({
          component: InterfaceSetting,
          navigatorType: navigatorType,
          title: '界面設定',
          passProps: {
            ...this.props,
            events: events,
            emitMessage: emitMessage
          }
        });
        return;

      case "faq":
        navigator.push({
          component: ArticleContainer,
          navigatorType: navigatorType,
          title: '常見問題',
          passProps: {
            ...this.props,
            zone: "kaif-faq",
            zoneTitle: "常見問題",
            events: events,
            emitMessage: emitMessage
          }
        });
        return;

      case "terms":
        navigator.push({
          component: ArticleContainer,
          navigatorType: navigatorType,
          title: '服務條款',
          passProps: {
            ...this.props,
            zone: "kaif-terms",
            zoneTitle: "服務條款",
            events: events,
            emitMessage: emitMessage
          }
        });
        return;

      case "logout":
        AlertIOS.alert(
          '登出！',
          '確定登出嗎？',
          [{
            text: '取消', style: 'cancel'
          }, {
            text: '登出', style: 'destructive', onPress: () => {
              logout((data) => {
                rootNavigator.immediatelyResetRouteStack([Router.getHomeRoute()]);
              });
            }
          }]
        )
        return;
      case "about":
        navigator.push({
          component: About,
          title: '關於',
          passProps: {
            ...this.props,
            events: events,
            emitMessage: emitMessage
          }
        })
        return;
      default:
        return null;
    }
  },

  render: function() {
    let rows = [["顯示設定", "interface"], ['常見問題', "faq"], ['服務條款', "terms"], ['關於', "about"]]

    let logoutButtomStyle = {
      paddingVertical: 13,
      backgroundColor: '#f8f8f8',
      marginLeft: 0,
      borderBottomWidth: 0.5,
      borderTopWidth: 0.5,
      borderColor: '#BBBBBB'
    }

    return(
      <ScrollView style={{flex:1 }}>
        {
          rows.map((row) => {
            return(
              <Cell
                text={row[0]}
                value={row[1]}
                onPress={this.handleSettingOptionPress}
                key={row[1]}
                arrow={true}
              />
            );
          })
        }
        <View style={{height: 20}}/>
        <Cell
          text={"登出"}
          value={"logout"}
          onPress={this.handleSettingOptionPress}
          cellTextStyle={{flex: 1, textAlign: 'center', color: 'red'}}
          cellStyle={logoutButtomStyle}
          arrow={false}
          description="登出後本機快取資料會被刪除，需要重新登入：D"
        />
      </ScrollView>
    );
  }
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ArticleActions, dispatch);
}

export default connect(null, mapDispatchToProps)(Setting);
