import React, {
  ListView,
  TouchableHighlight,
  Text,
  View,
  Component,
  AlertIOS,
  ScrollView
} from 'react-native';

import TableView, {
  Section,
  Item,
} from 'react-native-tableview';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux/native';
import * as ArticleActions from '../actions/article';

import KaifAPI from '../utils/KaifAPI';
import ArticleContainer from '../containers/ArticleContainer';
import Router from '../routers';

import Icon from 'react-native-vector-icons/FontAwesome';

let Setting = React.createClass({
  handleSettingOptionPress: function(value) {
    const { navigator, rootNavigator, logout, events } = this.props;

    switch(value) {
      case "faq":
        navigator.push({
          component: ArticleContainer,
          title: '常見問題',
          passProps: {
            ...this.props,
            zone: "kaif-faq",
            zoneTitle: "常見問題"
          }
        });
        return;

      case "terms":
        navigator.push({
          component: ArticleContainer,
          title: '常見問題',
          passProps: {
            ...this.props,
            zone: "kaif-terms",
            zoneTitle: "服務條款"
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
              })
            }
          }]
        )
        return;
      default:
        return null;
    }
  },

  _onPress: function(callback, value) {
    return () => {
      callback(value);
    }
  },

  renderArrow: function() {
    return(
      <Icon style={{
        position: 'absolute',
        right: 7,
        width: 15,
        color: '#C8C7CC',
        alignSelf: 'flex-end',
      }} name='angle-right' size={22} />
    );
  },

  renderCell: function(passProps) {
    const { value, text, cellTextStyle, cellStyle, arrow, onPress, others } = passProps;

    let defaultCellTextStyle = {
      fontSize: 17,
    }

    let defaultCellStyle = {
      flexDirection: 'row',
      paddingVertical: 13,
      marginLeft: 13,
      borderBottomWidth: 0.5,
      borderColor: '#BBBBBB'
    }

    return(
      <TouchableHighlight underlayColor="#D9D9D9" key={value} onPress={this._onPress(onPress, value)} {...others}>
        <View style={[defaultCellStyle, cellStyle]}>
          <Text style={[defaultCellTextStyle, cellTextStyle]}>{text}</Text>
          { arrow ? this.renderArrow() : null }
        </View>
      </TouchableHighlight>
    );
  },

  render: function() {
    let rows = [['常見問題', "faq"], ['服務條款', "terms"], ['關於', "about"]]

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
          rows.map((r) => {
            return this.renderCell({
              text: r[0],
              value: r[1],
              onPress: this.handleSettingOptionPress,
              key: r[1],
              arrow: true
            });
          })
        }
        <View style={{height: 20}}/>
        {
          this.renderCell({
            text: "登出",
            value: "logout",
            onPress: this.handleSettingOptionPress,
            cellTextStyle: {flex: 1, textAlign: 'center', color: 'red'},
            cellStyle: logoutButtomStyle,
            arror: false
          })
        }
      </ScrollView>
    );
  }
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ArticleActions, dispatch);
}

export default connect(null, mapDispatchToProps)(Setting);
