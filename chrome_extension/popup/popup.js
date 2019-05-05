console.log('hello innocuous popup logger');

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(request);
});
