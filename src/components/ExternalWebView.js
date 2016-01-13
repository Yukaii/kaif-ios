'use strict';

import React, {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  WebView,
  Component,
  TouchableHighlight,
  StatusBarIOS,
  ActivityIndicatorIOS,
  InteractionManager
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
      didFocus: false
    }
  };

  onNavigationStateChange = (navState) => {
    this.setState({
      // backButtonEnabled: navState.canGoBack,
      // forwardButtonEnabled: navState.canGoForward,
      // url: navState.url,
      // status: navState.title,
      loading: navState.loading,
      // scalesPageToFit: true
    });
  };

  componentDidMount = () => {
    const { rootNavigator } = this.props;

    InteractionManager.runAfterInteractions(() => {
      this.setState({didFocus: true});
      StatusBarIOS.setStyle('light-content');
    });
  };

  componentWillUnmount = () => {
    const { rootNavigator } = this.props;
    StatusBarIOS.setStyle('default');
  };

  _renderWebView = () => {
    const { url, rootNavigator } = this.props;

    if (!this.state.didFocus) {
      return(
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicatorIOS
            animating={true}
            style={{flex: 1, alignItems: 'center', justifyContent: 'center', height: 80}}
            size="small"
            />
        </View>
      );
    }

    return(
      <WebView
        style={{flex: 1}}
        ref={WEBVIEW_REF}
        automaticallyAdjustContentInsets={true}
        url={url}
        javaScriptEnabled={true}
        allowsInlineMediaPlayback={true}
        scalesPageToFit={true}
        onNavigationStateChange={this.onNavigationStateChange}
        startInLoadingState={true}
        scalesPageToFit={this.state.scalesPageToFit}
        />
    );
  };

  render(){
    const { url, rootNavigator } = this.props;
    return(
      <View style={{flex: 1}}>
        <View style={{height: 64, paddingBottom: 10, flexDirection: 'row', backgroundColor: '#2d3e50', borderWidth: 3, borderColor: '#2d3e50', borderTopLeftRadius: 5,  borderTopRightRadius: 5}}>
          <TouchableHighlight underlayColor="rgba(128, 128, 128, 0)" style={{alignSelf: 'flex-end', alignItems: 'center', flexDirection: 'row', width: 50}} onPress={() => { rootNavigator.pop(); }}>
            <Icon name="close-round" size={20} color='#5ea7e9' style={{marginLeft: 12}}/>
          </TouchableHighlight>
          <View style={{flex: 1}}/>
          <TouchableHighlight underlayColor="rgba(128, 128, 128, 0)" style={{alignSelf: 'flex-end', alignItems: 'center', flexDirection: 'row', width: 50}} onPress={() => { }}>
            <Text style={{color: '#5ea7e9', textAlign:'right', fontWeight: 'bold', fontSize: 16, marginBottom: 2}}>分享</Text>
          </TouchableHighlight>
        </View>
        { this._renderWebView() }
      </View>
    );
  };
}
