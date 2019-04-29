$(document).ready(function() {
  var linkElement = document.createElement("link");

  var path = chrome.extension.getURL("../vendor/geoBootstrap.css");

  $("h1").css("fontSize", "10rem");
  $("head").append(
    $("<link>").attr({
      rel: "stylesheet",
      type: "text/css",
      href: path
    })
  );
  var styleTag = document.createElement("style");
  styleTag.innerHTML = "body {background-color :red}";
  var head = document.querySelector("head");
});
