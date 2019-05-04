const hellScripts = ['./scriptmods/mouseMoveVisibility.js'];
const awfulScripts = ['./scriptmods/geo.js', './scriptmods/image.js'];
const badScripts = [];

function randomifyScript(status) {
  if (status === 'hell') {
    return hellScripts[Math.floor(Math.random() * hellScripts.length)];
  }
  if (status === 'awful') {
    return awfulScripts[Math.floor(Math.random() * awfulScripts.length)];
  }
  if (status === 'bad') {
    return badScripts[Math.floor(Math.random() * badScripts.length)];
  }
  //the following if block cab be removed it is for testing only.
  if (status === 'hello') {
    const testArray = [1, 2, 3, 4, 5, 6, 7, 8];
    console.log('testing a random awful script based on hello msg');
    return console.log(testArray[Math.floor(Math.random() * testArray.length)]);
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
//chrome.tabs.executeScript(null, { file: './scriptmods/geo.js' });
//chrome.tabs.insertCSS(null, { file: './css/spin.css' });
