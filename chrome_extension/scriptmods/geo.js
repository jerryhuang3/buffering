$(document).ready(function() {
  var path = chrome.extension.getURL("../vendor/geoBootstrap.css");

  $("h1").css("fontSize", "10rem");
  $("head").append(
    $("<link>").attr({
      rel: "stylesheet",
      type: "text/css",
      href: path
    })
  );
});
