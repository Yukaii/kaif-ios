import React, {
  View,
  Text,
  Switch,
  ScrollView
} from 'react-native';
import {
  TableView,
  Section,
  Cell,
  CustomCell,
} from 'react-native-tableview-simple';
import Subscribable from 'Subscribable';

let InterfaceSetting = React.createClass({
  mixins: [Subscribable.Mixin],

  componentDidMount() {
    const { events, navigator } = this.props;
    this.addListenerOn(events, 'shouldPop', () => { navigator.pop() });
  },

  render() {
    return(
      <ScrollView style={{backgroundColor: '#EFEFF4', flex: 1}}>
        <TableView>
          <Section header="主題相關">
            <CustomCell>
              <Text style={{flex: 1, fontSize: 16}}>使用暗系配色</Text>
              <Switch onTintColor="#4E98F4" />
            </CustomCell>
          </Section>
          <Section header="實驗性功能，use at your own risk.">
            <Cell title="Navigator 類型" cellStyle="RightDetail" detail="Navigator" accessory="DisclosureIndicator" onPress={() => {}}/>
          </Section>
        </TableView>
      </ScrollView>
    );
  }
});

export default InterfaceSetting;
