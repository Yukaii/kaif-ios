import React, {
  ListView,
  TouchableHighlight,
  Text,
  View,
  Component
} from 'react-native';

import TableView, {
  Section,
  Item
} from 'react-native-tableview';

import { Actions } from 'react-native-router-flux';

import NavigationBar from 'react-native-navbar';
import ExNavigator from '@exponent/react-native-navigator';
import Router from '../routers';

export default class Setting extends Component {
  componentWillUpdate() {

  }

  render() {
    return(
      <TableView style={{flex:1, paddingTop: 32}}
        tableViewStyle={TableView.Consts.Style.Plain}
        tableViewCellStyle={TableView.Consts.CellStyle.Subtitle}
        onPress={() => {
           this.props.navigator.push(Router.getSettingRoute(this.props.settingShouldBack));
        }}>
        <Section arrow={true}>
          <Item value="1">個人資料設定</Item>
          <Item value="2">常見問題</Item>
          <Item value="3">服務條款</Item>
          <Item value="4">關於</Item>
        </Section>
      </TableView>
    );
  }
}
