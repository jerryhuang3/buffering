const hellInjects = [
  './scriptmods/mouseMoveVisibility.js',
  './css/zoom-hell.css',
  './css/pulsate.css',
  './css/spin.css'
];
const awfulInjects = [
  './scriptmods/geo.js',
  './scriptmods/image.js',
  './scriptmods/image.js',
  './css/zoom-awful.css'
];
const badInjects = ['./css/zoom-bad.css'];

function injectJs(fileToInject) {
  chrome.tabs.executeScript(null, { file: fileToInject });
}
function injectCSS(fileToInject) {
  chrome.tabs.insertCSS(null, { file: fileToInject });
}

function randomifyScript(status) {
  let inject;

  if (status === 'hell') {
    inject = hellInjects[Math.floor(Math.random() * hellInjects.length)];
    console.log(inject, 'is being injected');
    inject.endsWith('js') ? injectJs(inject) : injectCSS(inject);
  }
  if (status === 'awful') {
    inject = awfulInjects[Math.floor(Math.random() * awfulInjects.length)];
    console.log(inject, 'is being injected');
    inject.endsWith('js') ? injectJs(inject) : injectCSS(inject);
  }
  if (status === 'bad') {
    inject = badInjects[Math.floor(Math.random() * badInjects.length)];
    console.log(inject, 'is being injected');
    inject.endsWith('js') ? injectJs(inject) : injectCSS(inject);
  }
}

//listener for messages from content script/ executes scripts based on message
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(
    sender.tab
      ? request.greeting + ' from a content script: ' + sender.tab.url
      : "this shouldn't happen"
  );
  if (request.greeting == 'hello') {
    //insert scripts to execute here
    randomifyScript(request.greeting);
    randomifyScript('hell');

    // chrome.tabs.insertCSS(null, { file: './css/zoom-bad.css' });

    sendResponse({ farewell: 'goodbye' });
  }
});

//some scripts/css to inject
// chrome.tabs.insertCSS(null, { file: './css/spin.css' });
// chrome.tabs.executeScript(null, { file: './scriptmods/mouseMoveVisibility.js' });
// chrome.tabs.executeScript(null, { file: './scriptmods/geo.js' });
// chrome.tabs.executeScript(null, { file: './scriptmods/image.js' });
// chrome.tabs.executeScript(null, { file: './scriptmods/scrollToBottom.js' });
// chrome.tabs.insertCSS(null, { file: './css/pulsate.css' });
