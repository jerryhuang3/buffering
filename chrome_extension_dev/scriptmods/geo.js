$(document).ready(function() {
  var path = chrome.extension.getURL('../vendor/geoBootstrap.css');
  $('head').append(
    $('<link>').attr({
      rel: 'stylesheet',
      type: 'text/css',
      href: path
    })
  );
});
