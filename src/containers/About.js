import React, {
  View,
  Text,
  LinkingIOS,
  ScrollView
} from 'react-native'
import HTMLWebView from 'react-native-html-webview';

export default React.createClass({
  render: function() {
    let html = `
      <html>
        <head>
          <style>
            html {
              font-size: 14px;
              font-family: Helvetica;
              word-break: break-words;
              background-color: #eeeeee;
              padding-left: 7px;
              padding-right: 7px;
              padding-bottom: 20px;
            }
          </style>
        </head>
        <body>

          <h3>關於 App</h3>
          <p><del>總之懶的煩惱排版的問題，所以就直接寫成 WebView 了</del></p>
          <p>這個 App 是用 <a href="https://facebook.github.io/react-native/">React Native</a> 以及 <a href="https://github.com/rackt/redux">Redux</a>，這套目前很紅的 Flux 實作，在我工作之餘做出來的，打開 wakatime 就可以看到平日假日的專案完美的在週末黃金交叉，寫來最愉快的地方就是 hot reload，不用等著慢吞吞的 build 真是愉快。</p>
          <p><a href="https://github.com/Yukaii/kaif-ios">Github</a></p>
          <p><a href="https://www.facebook.com/pages/十塊錢工作室-aka-Ten-Dollars-Studio/889348287790119">Ten Dollars Studio</a></p>
          <h3>關於 kaif.io</h3>
          以下引用自<a href="https://kaif.io/z/kaif-faq/debates/bLg6Pu0cLd"> IngramChen 大大的這篇回覆</a>
            <hr />

            <p>一句話：kaif 是讓大家可以討論各式各樣話題的網站。</p>
            <p>學術點講，kaif 有兩個功能，一是論壇，二是草根熱門新聞。 第一項功能不難理解：用戶可以在論壇內就各種議題發言討論，kaif 也提供多種類的討論區。</p>
            <p>而另一項，草根新聞，是指熱門文章的挑選由用戶投票決定，票得的多的就能上榜，受大家矚目。這有別於一般媒體新聞由編輯室決定。kaif 的新聞重要性由草根群眾選擇。</p>
            <p>最後，有一些明星的人名也叫 kaif，不過這個服務與他/她們毫無關聯。</p>
          </p>
        </body>
      </html>
    `;

    return(
      <ScrollView style={{flex: 1}} bounces={false}>
        <HTMLWebView
          html={html}
          makeSafe={false}
          autoHeight={true}
          style={{marginBottom: -10, backgroundColor: 'white'}}
          onLink={(href) => {LinkingIOS.openURL(href)}}
        />
      </ScrollView>
    );
  }
});
