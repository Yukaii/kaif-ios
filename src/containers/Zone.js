import React, {
  Component,
  View,
  ActivityIndicatorIOS,
  Alert,
  ListView,
  RefreshControl
} from 'react-native';
import Subscribable from 'Subscribable';

import KaifAPI from '../utils/KaifAPI';
import Router from '../routers';
import ArticleContainer from '../containers/ArticleContainer';

import Icon from 'react-native-vector-icons/Ionicons';
import Cell from '../components/Cell';

let Zone = React.createClass({
  mixins: [Subscribable.Mixin],

  getInitialState: function() {
    let dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    return({
      zones: [],
      isRefreshing: false,
      dataSource: dataSource.cloneWithRows([])
    });
  },

  componentDidMount: function() {
    const { events, navigator } = this.props;

    KaifAPI.requestZoneAll().then(data => {
      if (data.data) {
        let zones = [];
        if (__DEV__) {
          zones = [{name: 'test', title: '測試專區'}, ...data.data];
        } else {
          zones = data.data;
        }
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(zones),
          zones: zones
        });
      }
    });

    this.addListenerOn(events, 'shouldPop', () => { navigator.pop() });

    Icon.getImageSource('ios-information-outline', 25).then(source => this.setState({infoButton: source}));
  },

  onZoneItemPress: function(value) {
    const { navigator } = this.props;
    let [zoneName, zoneTitle] = value.split(',');

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

  reloadZones() {
    this.setState({isRefreshing: true});
    KaifAPI.requestZoneAll().then(data => {
      if (data.data) {
        let zones = [];
        if (__DEV__) {
          zones = [{name: 'test', title: '測試專區'}, ...data.data];
        } else {
          zones = data.data;
        }
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(zones),
          zones: zones
        });
      }
      this.setState({isRefreshing: false});
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
      <ListView
        style={{flex:1, marginTop: 64, marginBottom: 48}}
        automaticallyAdjustContentInsets={false}
        removeClippedSubviews={true}
        dataSource={this.state.dataSource}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={this.reloadZones}
          />
        }
        renderRow={
          (zone, sectionID, rowID) => {
            return(
              <Cell
                value={`${zone.name},${zone.title}`}
                key={zone.name}
                text={zone.title}
                onPress={this.onZoneItemPress}
                arrow={true}
              />
            );
          }
        }
      />
    );
  }
});

export default Zone;
