import KeyboardEvents from 'react-native-keyboardevents';
import {
  Emitter as KeyboardEventEmitter
} from 'react-native-keyboardevents';

export default {

  getInitialState() {
    return {
      keyboardSpace: 0,
      isKeyboardOpened: false
    };
  },

  updateKeyboardSpace(frames) {
    if (frames.end) {
      this.setState({
        keyboardSpace: frames.end.height,
        isKeyboardOpened: true
      });
    }
  },

  resetKeyboardSpace() {
    this.setState({
      keyboardSpace: 0,
      isKeyboardOpened: false
    });
  },

  componentDidMount() {
    KeyboardEventEmitter.on(KeyboardEvents.KeyboardDidShowEvent, this.updateKeyboardSpace);
    KeyboardEventEmitter.on(KeyboardEvents.KeyboardWillHideEvent, this.resetKeyboardSpace);
  },

  componentWillUnmount() {
    KeyboardEventEmitter.off(KeyboardEvents.KeyboardDidShowEvent, this.updateKeyboardSpace);
    KeyboardEventEmitter.off(KeyboardEvents.KeyboardWillHideEvent, this.resetKeyboardSpace);
  }

};
