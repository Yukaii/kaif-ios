import React, { Navigator, Text } from 'react-native';
import Home from '../containers/Home';
import Zone from '../components/Zone';
import Setting from '../components/Setting';
import Profile from '../components/Profile';
import DebateContainer from '../components/DebateContainer';
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
    let defaultRoute = {
      renderScene(navigator) {
        return <ArticleContainer navigator={navigator} {...props}/>;
      },
      renderTitle(){
        return <KaifIcon width={18} height={17} style={{ marginTop: 14}}/>;
      },
      getTitle() {
        return props.zoneTitle
      },
      configureScene() {
        return Navigator.SceneConfigs.FloatFromRight;
      }
    };

    if (props.zoneTitle) {
      delete defaultRoute.renderTitle
    } else {
      delete defaultRoute.getTitle
    }

    return defaultRoute;
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
        return <DebateContainer navigator={navigator} {...props} />;
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

  getZoneRoute(props) {
    return {
      renderScene(navigator) {
        return <Zone navigator={navigator} {...props} />;
      },
      getTitle() {
        return('討論區');
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
        return '個人資料';
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
