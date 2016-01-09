import React, {
  Component,
  Image,
  View
} from 'react-native';

export default class KaifIcon extends Component {
  render() {
    let newProps = this.props;
    delete newProps.iconName;

    return(
      <View>
        <Image
          source={require("../assets/images/kaif-icon.png")}
          {...newProps}
        />
      </View>
    );
  }
}
