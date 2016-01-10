import React, { Navigator } from 'react-native';
import Home from '../containers/Home';
import Setting from '../components/Setting';
import Profile from '../components/Profile';
import DebateNode from '../components/DebateNode';
import ArticleContainer from '../components/ArticleContainer';
import ExternalWebView from '../components/ExternalWebView';
import KaifIcon from '../components/KaifIcon';

let Router = {
  getHomeRoute(props) {
    return {
      renderScene(navigator) {
        return <Home rootNavigator={navigator} {...props}/>;
      }
    }
  },

  getArticleRoute(props) {
    return {
      renderScene(navigator) {
        return <ArticleContainer navigator={navigator} {...props}/>;
      },
      renderTitle(){
        return <KaifIcon style={{width: 18, height: 18, tintColor: "#ff5619", marginTop: 14}}/>;
      },
      configureScene() {
        return Navigator.SceneConfigs.FloatFromRight;
      }
    };
  },

  getSettingRoute() {
    return {
      renderScene(navigator) {
        return <Setting navigator={navigator}/>;
      },
      getTitle() {
        return '設定';
      },
      configureScene() {
        return Navigator.SceneConfigs.FloatFromRight;
      }
    };
  },

  getDebateRoute(props) {
    return {
      renderScene(navigator) {
        return <DebateNode navigator={navigator} {...props} />;
      },
      onDidFocus(event) {
      },
      getTitle() {
        return('');
      },
      configureScene() {
        return Navigator.SceneConfigs.FloatFromRight;
      }
    }
  },

  getProfileRoute() {
    return {
      renderScene(navigator) {
        return <Profile navigator={navigator}/>;
      },
      onDidFocus(event) {
        console.log('Home Scene received focus.');
      },
      getTitle() {
        return '哈哈';
      },
      configureScene() {
        return Navigator.SceneConfigs.FloatFromRight;
      }
    }
  },

  getWebViewRoute(props) {
    const { url } = props;

    return {
      renderScene(navigator) {
        return <ExternalWebView navigator={navigator} {...props}/>;
      },
      onDidFocus(event) {
        console.log('Home Scene received focus.');
      },
      getTitle() {
        return url
      },
      configureScene() {
        return Navigator.SceneConfigs.FloatFromBottom;
      },
      renderRightButton() {
        return (null);
      }
    }
  }
}

export default Router;
