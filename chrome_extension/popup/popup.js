console.log('hello innocuous popup logger');

chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
  var activeTab = tabs[0];
  chrome.tabs.sendMessage(activeTab.id, { message: 'popup calling' }, function(response) {
    $('#main').text(response.status + response.script);
  });
});
