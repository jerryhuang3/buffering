function makeMessage(status, script) {
  $('#status-message')
    .addClass(status)
    .text(status);
  $('#script-message').text(`${script} was injected into your page!`);
}

function clear() {
  $('#status-message')
    .removeClass()
    .text('');
}

chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
  var activeTab = tabs[0];
  chrome.tabs.sendMessage(activeTab.id, { message: 'popup calling' }, function(response) {
    clear();
    const status = response.status;
    const script = response.script;
    makeMessage(status, script);
  });
});
