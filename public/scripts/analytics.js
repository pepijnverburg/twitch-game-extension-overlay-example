(function(i, s, o, g, r, a, m) {
  i['GoogleAnalyticsObject'] = r;
  i[r] = i[r] || function() {
      (i[r].q = i[r].q || []).push(arguments)
  }, i[r].l = 1 * new Date();
  a = s.createElement(o), m = s.getElementsByTagName(o)[0];
  a.async = 1;
  a.src = g;
  m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

if (typeof ga === 'function') {
  ga('create', '<YOUR ID HERE!>', {

    // Fix to allow on Twitch domain, source: https://www.simoahava.com/analytics/cookieflags-field-google-analytics/
    cookieFlags: 'max-age=7200;secure;samesite=none'
  });

  // No IP tracking, source: https://dev.twitch.tv/docs/extensions/using-google-analytics-in-extensions
  ga('set', 'anonymizeIp', true);
}
