import React from 'react-native';
import Setting from '../components/Setting';
import Profile from '../components/Profile';
import ArticleContainer from '../components/ArticleContainer';

let Router = {
  getArticleRoute() {
    return {
      renderScene(navigator) {
        return <ArticleContainer navigator={navigator}/>;
      },
      getTitle() {
        return '文章';
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
      }
    };
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
      }
    }
  }
}

export default Router;
