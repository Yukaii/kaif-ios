import marked from 'marked';

exports.makeId = () => {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < 20; i++ ) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

exports.toQueryString = (obj) => {
  return obj ? Object.keys(obj).sort().map(function (key) {
    var val = obj[key];

    if (Array.isArray(val)) {
      return val.sort().map(function (val2) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(val2);
      }).join('&');
    }

    return encodeURIComponent(key) + '=' + encodeURIComponent(val);
  }).join('&') : '';
}


marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true
});
exports.renderMarkdown = (md, options={}) => {
  let parsedHTML = marked(md);
  let regex = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"/g
  var m, links = [];
  while (m = regex.exec(parsedHTML)) {
      m.shift();
      links = links.concat(m);
  }

  let defaultStyle = {
    backgroundColor: '#EEEEEE',
    hrefColor: '#2081e4',
    color: 'black',
    ...options
  };

  return `
  <html>
    <head>
      <style>
        html {
          background-color: ${defaultStyle.backgroundColor};
          font-size: 15px;
          font-family: Helvetica;
          word-break: break-words;
          overflow-wrap: break-word;
          color: ${defaultStyle.color};
        }
        a {
          color: ${defaultStyle.hrefColor};
        }

        blockquote {
          border-left: 2px solid #ccc;
          margin-left: 0.5em;
          background: #f9f9f9;
          padding: 1px 0.8em;
          color: #808083;
        }
      </style>
    </head>
    <body>
      ${parsedHTML}
      <p>
        ${links.map((href, i) => `[${i+1}]: <a href=${href}>${href}</a>`).join('<br/>')}
      </p>
    </body>
  </html>`;
}
