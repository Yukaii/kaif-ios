import React, {
  Navigator,
  NavigatorIOS,
  Text,
  PropTypes,
  TouchableHighlight
} from 'react-native';

import ExNavigator from '@exponent/react-native-navigator';

export function createRoute(props) {
  const {
    component,
    passProps,
    ...otherProps
  } = props;

  if (props.navigatorType == 'ios') {
    return({
      component: component,
      passProps: passProps,
      ...otherProps
    });
  }

  return createExRoute(props)
}

export function createExRoute(props) {
  const {
    component,
    passProps,
    title,
    rightButtonText,
    onRightButtonPress,
    renderRightButton,
    componentStyle,
    ...otherProps
  } = props;

  let _renderRightButton = typeof rightButtonText !== 'undefined' ?
    () => {
      return(
        <TouchableHighlight underlayColor="transparent" onPress={onRightButtonPress} style={{marginTop: 10, marginRight: 10}}>
          <Text style={{color: '#0078e7', fontSize: 16}}>{rightButtonText}</Text>
        </TouchableHighlight>
      );
    } :
    false;

  var Component = component;

  return({
    renderScene(navigator) {
      return <Component navigator={navigator} {...passProps} {...otherProps} style={componentStyle}/>;
    },

    getTitle() {
      return title || '';
    },

    configureScene() {
      return Navigator.SceneConfigs.FloatFromRight;
    },

    renderRightButton: renderRightButton || _renderRightButton
  });
}

export default React.createClass({
  propTypes: {
    navigatorType: PropTypes.string
  },

  render() {
    const {
      title,
      component,
      passProps,
      routeFunction,
      ...otherProps
    } = this.props;

    if (this.props.navigatorType == 'ios') {
      return(
        <NavigatorIOS
          initialRoute={{
            component: component,
            title: title,
            passProps: {...passProps, ...otherProps}
          }}
          style={{flex: 1}}/>
      );
    }

    return(
      <ExNavigator
        initialRoute={createExRoute(this.props)}
        {...otherProps}
      />
    );
  }
});
