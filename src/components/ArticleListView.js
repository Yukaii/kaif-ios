import React, {
  ListView,
  PropTypes
} from 'react-native';

import Article from './Article';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux/native';
import * as ArticleActions from '../actions/article';

let ArticleListView = React.createClass({
  propTypes: {
    showHeader: PropTypes.bool,
    showFooter: PropTypes.bool,
  },

  getDefaultProps: function() {
    return({
      showFooter: true,
    });
  },

  _handleVotePress: function(article) {
    const { zone, voteForArticle, navigator } = this.props;

    return (event) => {
      let voteState = (article.vote.voteState == 'EMPTY' || typeof article.vote.voteState === 'undefined') ? 'UP' : 'EMPTY';
      voteForArticle(
        null, // callback
        article.articleId,
        voteState,
        (zone || article.zone)
      );
    }
  },

  _renderFooter: function() {
    if (!this.props.showFooter) { return false; }
    return(this.props._renderFooter && this.props._renderFooter());
  },

  render: function() {
    const {
      articleProps,
      style,
      contentContainerStyle,
      dataSource,
      ...listViewProps
    } = this.props;

    return(
      <ListView
        showsVerticalScrollIndicator={true}
        style={[{flex: 1}, style]}
        contentContainerStyle={[{justifyContent: 'flex-start'}, contentContainerStyle]}
        automaticallyAdjustContentInsets={false}
        removeClippedSubviews={true}
        initialListSize={10}
        dataSource={dataSource}
        {...listViewProps}
        renderRow={
          (article, sectionID, rowID) => {
            return(
              <Article
                article={ article }
                key={ article.articleId }
                handleVotePress={this._handleVotePress(article)}
                {...articleProps}
              />
            );
          }
        }
      />
    );
  }
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ArticleActions, dispatch);
}

export default connect(state => state, mapDispatchToProps)(ArticleListView);
