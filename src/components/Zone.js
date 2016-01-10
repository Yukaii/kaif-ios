import React, {
  Component,
  View,
  ActivityIndicatorIOS
} from 'react-native';

import TableView, {
  Section,
  Item
} from 'react-native-tableview';

import KaifAPI from '../utils/KaifAPI';
import Router from '../routers';

export default class Zone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zones: []
    }
  }

  componentDidMount = () => {
    KaifAPI.requestZoneAll().then(data => {
      if (data.data) {
        this.setState({zones: data.data});
      }
    });
  }

  render() {
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
}
