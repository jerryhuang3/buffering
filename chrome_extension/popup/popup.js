function makeMessage(status, script) {
  $('#status-message')
    .removeClass('loading')
    .addClass(status)
    .text(status);
  if (status !== 'good') {
    $('#script-message').text(`${script} was injected into your page!`);
  } else {
    $('#script-message').text(`Congratulations on meeting your goals! You are free to browse the internet!`);
  }
}

function clear() {
  $('#status-message')
    .removeClass()
    .text('');
}

chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
  var activeTab = tabs[0];
  chrome.tabs.sendMessage(activeTab.id, { message: 'popup calling' }, function(response) {
    if (response) {
      clear();
      const status = response.status;
      const script = response.script;
      makeMessage(status, script);
    }
  });
});
