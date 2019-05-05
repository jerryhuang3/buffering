console.log('hello innocuous popup logger');
console.log($('#main').text());
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(request);
});
