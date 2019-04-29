// //test http request to server
// var xhttp = new XMLHttpRequest();

// xhttp.onreadystatechange = function() {
//   if (this.readyState == 4 && this.status == 200) {

//     const response = xhttp.responseText
//     const status = xhttp.status
//     const statusText = xhttp.statusText
//     const responseURL = xhttp.responseURL

//     console.log(JSON.parse(response))
//     console.log(response, status, statusText, responseURL);
//   }
// };
// xhttp.open("GET", "http://localhost:8080/test", true);
// xhttp.send();

// console.log("before async request")

// // receive message from content script.
// chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {
//   console.log(response);
//   chrome.tabs.insertCSS(null, { file: "../css/test.css" }, function(results) {
//     console.log(results);
//   });
// });

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(
    sender.tab
      ? request.greeting + " from a content script: " + sender.tab.url
      : "this shouldn't happen"
  );
  if (request.greeting == "hello") {
    chrome.tabs.insertCSS(null, { file: "./css/test.css" });
    chrome.tabs.executeScript(null, { file: "./scriptmods/geo.js" });

    sendResponse({ farewell: "goodbye" });
  }
});
