'use strict';

import React, {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  WebView,
  Component
} from 'react-native';

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

  componentDidMount = () => {

  }

  render(){
    const { url } = this.props;
    return(
      <WebView
        style={{marginTop: 64, marginBottom: 32}}
        ref={WEBVIEW_REF}
        automaticallyAdjustContentInsets={false}
        url={url}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={this.state.scalesPageToFit}
      />
    );
  }
}
