//listener for messages from content script/ executes scripts based on message
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
