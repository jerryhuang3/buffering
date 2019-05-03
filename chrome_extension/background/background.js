const hellInjects = [
  './scriptmods/mouseMoveVisibility.js',
  './css/zoom-hell.css',
  './css/pulsate.css',
  './css/spin.css'
];
const awfulInjects = ['./scriptmods/geo.js', './scriptmods/image.js', './css/zoom-awful.css'];
const badInjects = ['./css/zoom-bad.css', './css/comic-sans.css', './css/papyrus.css'];

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
  console.log(
    sender.tab
      ? request.greeting + ' from a content script: ' + sender.tab.url
      : "this shouldn't happen"
  );
  //eventually this message should be "good, bad, awful, or hell" and it shouldbe passed as params to randomifyScript
  if (request.greeting == 'hello') {
    //insert scripts to execute here
    randomifyScript(request.greeting);
    // randomifyScript('bad');

    sendResponse({ farewell: 'goodbye' }); //response back to content script
  }
});
