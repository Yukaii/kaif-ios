import React, {
  Component,
  View,
  ActivityIndicatorIOS,
  NativeAppEventEmitter,
  Alert
} from 'react-native';

import TableView, {
  Section,
  Item,
  Cell
} from 'react-native-tableview';
import Subscribable from 'Subscribable';

import Icon from 'react-native-vector-icons/Ionicons';

import KaifAPI from '../utils/KaifAPI';
import Router from '../routers';
import ArticleContainer from '../containers/ArticleContainer';

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

    Icon.getImageSource('ios-information-outline', 25).then(source => this.setState({infoButton: source}));
  },

  onZonePress: function(event) {
    const { navigator } = this.props;
    let [zoneName, zoneTitle] = event.value.split(',');

    KaifAPI.requestZoneAdmin(zoneName).then(data => {
      let admins = data.data.join(',')

      let route = {
        component: ArticleContainer,
        title: zoneTitle,
        passProps: {
          ...this.props,
          zone: zoneName,
          zoneTitle: zoneTitle
        },
        rightButtonIcon: this.state.infoButton,
        onRightButtonPress: () => {
          Alert.alert(
            '討論區資訊',
            `版名：${zoneTitle}\n路徑：/z/${zoneName}\n版主群：${admins}`,
            [
              {text: '確定'}
            ]
          );
        }
      }

      navigator.push(route);
    });
  },

  render: function() {
    if (!this.state.infoButton) { return false }

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
