function makeMessage(status, script) {
  $('#status')
    .addClass(status)
    .text(status);
  $('#script').text(`${script} was injected into your page!`);
}

chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
  var activeTab = tabs[0];
  chrome.tabs.sendMessage(activeTab.id, { message: 'popup calling' }, function(response) {
    const status = response.status;
    const script = response.script;
    makeMessage(status, script);
  });
});
