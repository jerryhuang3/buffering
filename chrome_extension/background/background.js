const hellInjects = [
  './scriptmods/mouseMoveVisibility.js',
  './scriptmods/mouseDraw.js',
  './scriptmods/redactHell.js',
  './scriptmods/marquee.js',
  './cssmods/zoom-hell.css',
  './cssmods/mirror-horiz.css',
  './cssmods/spin.css',
  './cssmods/blur-hell.css'
];
const awfulInjects = [
  './scriptmods/clown.js',
  './scriptmods/geo.js',
  './scriptmods/image.js',
  './cssmods/zoom-awful.css',
  './cssmods/pulsate.css',
  './cssmods/upside-down.css',
  './cssmods/hover-disappear.css',
  './scriptmods/redactAwful.js'
];
const badInjects = [
  './scriptmods/textColor.js',
  './cssmods/zoom-bad.css',
  './cssmods/comic-sans.css',
  './cssmods/papyrus.css',
  './cssmods/contrast.css',
  './cssmods/invert.css',
  './cssmods/image-opacity.css'
];

function injectJs(fileToInject) {
  chrome.tabs.executeScript(null, { file: fileToInject });
}

function injectCSS(fileToInject) {
  chrome.tabs.insertCSS(null, { file: fileToInject });
}

function notify(name, status) {
  let fileName = name.substring(name.lastIndexOf('/') + 1);
  console.log('this is the fucking file...', fileName, status);
  chrome.runtime.sendMessage({ name: fileName, status: status }, function(response) {
    console.log(response);
  });
}

function randomifyScript(status) {
  let inject;

  if (status === 'hell') {
    inject = hellInjects[Math.floor(Math.random() * hellInjects.length)];
    console.log(inject, 'is being injected');
    notify(inject, status);
    inject.endsWith('js') ? injectJs(inject) : injectCSS(inject);
  }

  if (status === 'awful') {
    inject = awfulInjects[Math.floor(Math.random() * awfulInjects.length)];
    console.log(inject, 'is being injected');
    notify(inject, status);
    inject.endsWith('js') ? injectJs(inject) : injectCSS(inject);
  }

  if (status === 'bad') {
    inject = badInjects[Math.floor(Math.random() * badInjects.length)];
    notify(inject, status);
    console.log(inject, 'is being injected');
    inject.endsWith('js') ? injectJs(inject) : injectCSS(inject);
    return inject.substring(inject.lastIndexOf('/') + 1);
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

    //use the below two lines for testing scrips
    // chrome.tabs.insertCSS(null, { file: './cssmods/mirror-vert.css' });
    // chrome.tabs.executeScript(null, { file: './scriptmods/redactHell.js' });

    //the script to execut is run with this response to the content script.
    sendResponse({ status: data.userStatus, script: randomifyScript(data.userStatus) });
  } else {
    console.log('No Data');
  }
});
