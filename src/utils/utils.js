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
