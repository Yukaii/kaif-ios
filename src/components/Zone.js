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
import Subscribable from 'Subscribable';

import KaifAPI from '../utils/KaifAPI';
import Router from '../routers';

let Zone = React.createClass({
  mixins: [Subscribable.Mixin],

  getInitialState: function() {
    return({
      zones: []
    });
  },

  componentDidMount: function() {
    const { events, navigator } = this.props;

    KaifAPI.requestZoneAll().then(data => {
      if (data.data) {
        if (__DEV__) {
          this.setState({zones: [{name: 'test', title: '測試專區'}, ...data.data]});
        } else {
          this.setState({zones: data.data});
        }
      }
    });

    this.addListenerOn(events, 'shouldPop', () => { navigator.pop() });
  },

  onZonePress: function(event) {
    const { navigator } = this.props;
    let [zoneName, zoneTitle] = event.value.split(',');

    let zoneFunction = (func, zone) => {
      return (startId) => {
        return func(zone, startId);
      }
    }

    let route = Router.getArticleRoute({
      ...this.props,
      zone: zoneName,
      zoneTitle: zoneTitle
    });

    navigator.push(route);
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
          onPress={this.onZonePress}>
          <Section arrow={true}>
            { this.state.zones.map(zone => <Item value={zone.name + ',' + zone.title} key={zone.name}>{zone.title}</Item>) }
          </Section>
        </TableView>
      </View>
    );
  }
});

export default Zone;
