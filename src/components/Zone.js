import React, {
  Component,
  View,
  ActivityIndicatorIOS,
  NativeAppEventEmitter
} from 'react-native';

import TableView, {
  Section,
  Item,
  Cell
} from 'react-native-tableview';

import KaifAPI from '../utils/KaifAPI';
import Router from '../routers';

let Zone = React.createClass({
  getInitialState: function() {
    return({
      zones: []
    });
  },

  componentDidMount: function() {
    KaifAPI.requestZoneAll().then(data => {
      if (data.data) {
        this.setState({zones: data.data});
      }
    });

    // this.eventEmitter = NativeAppEventEmitter.addListener('OnEndReach', (h) => {
    //   // alert(h);
    // })
  },

  render: function() {
    if (this.state.zones.length == 0) {
      return(
        <View style={{flex: 1, paddingTop: 64, marginBottom: 40, backgroundColor: '#eeeeee'}}>
          <ActivityIndicatorIOS
            animating={true}
            style={{alignItems: 'center', justifyContent: 'center', height: 80}}
            size="small"
          />
        </View>
      );
    }

    return(
      <View style={{flex:1, paddingTop: 64, marginBottom: 48}}>
        <TableView style={{flex:1}}
          tableViewStyle={TableView.Consts.Style.Plain}
          tableViewCellStyle={TableView.Consts.CellStyle.Subtitle}
          onPress={(event) => {
            alert(JSON.stringify(event.value));
          }}>
          <Section arrow={true}>
            { this.state.zones.map(zone => <Item value={zone.name} key={zone.name}>{zone.title}</Item>) }
          </Section>
        </TableView>
      </View>
    );
  }
});

export default Zone;
