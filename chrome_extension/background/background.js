const hellInjects = [
  './scriptmods/mouseMoveVisibility.js',
  './cssmods/zoom-hell.css',
  './cssmods/pulsate.css',
  './cssmods/spin.css',
  './scriptmods/mouseDraw.js'
];
const awfulInjects = [
  './scriptmods/geo.js',
  './scriptmods/image.js',
  './cssmods/zoom-awful.css',
  './cssmods/mirror-horiz.css',
  './cssmods/mirror-vert.css'
];
const badInjects = ['./cssmods/zoom-bad.css', './cssmods/comic-sans.css', './cssmods/papyrus.css', './scriptmods/textColor.js'];

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

  if (status === 'good') {
    console.log('you may browse normally!');
  }
}

//listener for messages from content script/ executes scripts based on message
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request) {
    let data = JSON.parse(request.response);
    randomifyScript(data.userStatus);
    // chrome.tabs.onUpdated.executeScript(null, { file: '' });
    sendResponse(`a ${data.userStatus} script was injected`);
  } else {
    console.log('No Data');
  }
});
