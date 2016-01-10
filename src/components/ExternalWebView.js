'use strict';

import React, {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  WebView,
  Component,
  TouchableHighlight
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

const TEXT_INPUT_REF = 'urlInput';
const WEBVIEW_REF = 'webview';

export default class ExternalWebView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'No Page Loaded',
      backButtonEnabled: false,
      forwardButtonEnabled: false,
      loading: true,
      scalesPageToFit: true,
    }
  }

  render(){
    const { url, rootNavigator } = this.props;
    return(
      <View style={{flex: 1}}>
        <View style={{height: 64, paddingBottom: 10, flexDirection: 'row', backgroundColor: '#f8f8f8', borderBottomWidth: 0.5, borderColor: '#b2b2b2'}}>
          <TouchableHighlight underlayColor="rgba(128, 128, 128, 0)" style={{alignSelf: 'flex-end', alignItems: 'center', flexDirection: 'row', width: 50}} onPress={() => { rootNavigator.pop() }}>
            <Icon name="close-round" size={20} color='#0078e7' style={{marginLeft: 12}}/>
          </TouchableHighlight>
          <View style={{flex: 1}}/>
          <TouchableHighlight underlayColor="rgba(128, 128, 128, 0)" style={{alignSelf: 'flex-end', alignItems: 'center', flexDirection: 'row', width: 50}} onPress={() => { rootNavigator.pop() }}>
            <Text style={{color: '#0078e7', textAlign:'center', fontWeight: 'bold', fontSize: 16, marginBottom: 2}}>分享</Text>
          </TouchableHighlight>
        </View>
        <WebView
          style={{flex: 1}}
          ref={WEBVIEW_REF}
          automaticallyAdjustContentInsets={false}
          url={url}
          javaScriptEnabled={true}
          allowsInlineMediaPlayback={true}
          scalesPageToFit={true}
          startInLoadingState={true}
          scalesPageToFit={this.state.scalesPageToFit}
          />
      </View>
    );
  }
}
