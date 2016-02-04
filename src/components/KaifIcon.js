import React, {
  Component,
  Image,
  View,
  StyleSheet
} from 'react-native';

let styles = StyleSheet.create({
  triangle: {
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderLeftWidth: 7,
      borderRightWidth: 7,
      borderBottomWidth: 13,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: '#ff5619'
    }
});

export default class KaifIcon extends Component {
  render() {
    const { color, width, height, style } = this.props;

    let borderColorStyle = {
      borderBottomColor: color || '#ff5619',
      borderLeftWidth: width/2 || 7,
      borderRightWidth: width/2 || 7,
      borderBottomWidth: height || 13
    }

    return(
      <View style={[styles.triangle, borderColorStyle, style]} />
    );
  }
}
