const hellInjects = [
  './scriptmods/mouseMoveVisibility.js',
  './scriptmods/mouseDraw.js',
  './scriptmods/marquee.js',
  './cssmods/zoom-hell.css',
  './cssmods/mirror-horiz.css',
  './cssmods/spin.css'
];
const awfulInjects = [
  './scriptmods/clown.js',
  './scriptmods/geo.js',
  './scriptmods/image.js',
  './scriptmods/redact.js',
  './cssmods/zoom-awful.css',
  './cssmods/pulsate.css',
  './cssmods/mirror-vert.css',
  './cssmods/hover-disappear.css'
];
const badInjects = [
  './scriptmods/textColor.js',
  './cssmods/zoom-bad.css',
  './cssmods/comic-sans.css',
  './cssmods/papyrus.css',
  './cssmods/contrast.css'
];

function injectJs(fileToInject) {
  chrome.tabs.executeScript(null, { file: fileToInject });
}

function injectCSS(fileToInject) {
  chrome.tabs.insertCSS(null, { file: fileToInject });
}

function notify(name) {
  let fileName = name.substring(name.lastIndexOf('/') + 1);

  chrome.runtime.sendMessage({ name: fileName });
}

function randomifyScript(status) {
  let inject;

  if (status === 'hell') {
    inject = hellInjects[Math.floor(Math.random() * hellInjects.length)];
    console.log(inject, 'is being injected');
    notify(inject);
    inject.endsWith('js') ? injectJs(inject) : injectCSS(inject);
  }

  if (status === 'awful') {
    inject = awfulInjects[Math.floor(Math.random() * awfulInjects.length)];
    console.log(inject, 'is being injected');
    notify(inject);
    inject.endsWith('js') ? injectJs(inject) : injectCSS(inject);
  }

  if (status === 'bad') {
    inject = badInjects[Math.floor(Math.random() * badInjects.length)];
    console.log(inject, 'is being injected');
    notify(inject);
    inject.endsWith('js') ? injectJs(inject) : injectCSS(inject);
  }

  if (status === 'good') {
    console.log('you may browse normally!');
  }
}

// listener for messages from content script/ executes scripts based on message
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request) {
    let data = JSON.parse(request.response);
    console.log('the current logged in user status is: ', data.userStatus);

    //next line take user status and execute a bad, awful or hell punishment
    // randomifyScript(data.userStatus);

    //use the below two lines for testing scrips
    // chrome.tabs.insertCSS(null, { file: /*your file here*/ });
    // chrome.tabs.executeScript(null, { file: './scriptmods/clown.js' });

    sendResponse(`a ${data.userStatus} script was injected`);
  } else {
    console.log('No Data');
  }
});
