import React, {
  View,
  Text,
  TouchableHighlight
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

export default React.createClass({
  getDefaultProps() {
    return({
      arrow: true,
      defaultCellTextStyle: {
        fontSize: 16.5,
      },
      defaultCellStyle: {
        flexDirection: 'row',
        paddingVertical: 13,
        marginLeft: 14,
        borderBottomWidth: 0.5,
        borderColor: '#BBBBBB'
      },
      defaultDescriptionStyle: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        color: '#747479'
      }
    });
  },

  renderArrow() {
    const { arrowStyle, renderArrow } = this.props;

    let defaultArrowStyle = {
      position: 'absolute',
      top: 9.5,
      right: 8,
      width: 15,
      color: '#C8C7CC',
      alignSelf: 'flex-end'
    }

    if (renderArrow) { return renderArrow(); }

    return(
      <Icon style={[defaultArrowStyle, arrowStyle]} name='angle-right' size={22.5} />
    );
  },

  _onPress() {
    const { onPress, value } = this.props;
    onPress(value);
  },

  renderDescription() {
    const { description, descriptionStyle, defaultDescriptionStyle } = this.props;
    if (!description) { return false; }

    return(
      <Text style={[defaultDescriptionStyle, descriptionStyle]}>{ description }</Text>
    );
  },

  render() {
    const {
      value,
      text,
      cellTextStyle,
      cellStyle,
      arrow,
      onPress,
      defaultCellStyle,
      defaultCellTextStyle,
      ...otherProps
    } = this.props;

    return(
      <View>
        <TouchableHighlight underlayColor="#D9D9D9" key={value} onPress={this._onPress} {...otherProps}>
          <View style={[defaultCellStyle, cellStyle]}>
            <Text style={[defaultCellTextStyle, cellTextStyle]}>{text}</Text>
            { arrow ? this.renderArrow() : false }
          </View>
        </TouchableHighlight>
        { this.renderDescription() }
      </View>
    );
  }
});
