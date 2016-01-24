import React, {
  ListView,
  TouchableHighlight,
  Text,
  View,
  Component,
  ScrollView
} from 'react-native';

import TableView, {
  Section,
  Item
} from 'react-native-tableview';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux/native';
import * as ArticleActions from '../actions/article';

import KaifAPI from '../utils/KaifAPI';

import Router from '../routers';

let Setting = React.createClass({
  handleSettingOptionPress: function(event) {
    const { navigator, rootNavigator, logout, events } = this.props;

    switch(event.value) {
      case "faq":
        navigator.push(Router.getArticleRoute({
          ...this.props,
          zone: "kaif-faq",
          zoneTitle: "常見問題"
        }));
        return;

      case "terms":
        navigator.push(Router.getArticleRoute({
          ...this.props,
          zone: "kaif-terms",
          zoneTitle: "服務條款"
        }));
        return;

      case "logout":
        logout((data) => {
          rootNavigator.immediatelyResetRouteStack([Router.getHomeRoute()]);
        })
        return;
      default:
        return null;
    }
  },

  render: function() {
    return(
      <TableView style={{flex:1, paddingTop: 32}}
        tableViewStyle={TableView.Consts.Style.Plain}
        tableViewCellStyle={TableView.Consts.CellStyle.Subtitle}
        onPress={this.handleSettingOptionPress}>
        <Section arrow={true}>
          <Item value="1">個人資料設定</Item>
          <Item value="faq">常見問題</Item>
          <Item value="terms">服務條款</Item>
          <Item value="4">關於</Item>
        </Section>

        <Section>
          <Item value="logout" style={{textAlign: 'center'}}>登出</Item>
        </Section>
      </TableView>
    );
  }
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ArticleActions, dispatch);
}

export default connect(null, mapDispatchToProps)(Setting);
