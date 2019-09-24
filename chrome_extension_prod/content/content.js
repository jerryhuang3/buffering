console.log('%cBuffering is running. Please login to degrade your internet experience', 'background: red; color: yellow; font-size: large');

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    const response = xhttp.responseText;
    chrome.runtime.sendMessage({ response }, function(response) {
      console.log(response.status, response.script);
      const status = response.status;
      const script = response.script;

      //listens for when popup opens, sends response with status and script
      chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        console.log(sender, request.message);
        sendResponse({ status, script });
      });
    });
  }
};
xhttp.open('POST', 'https://buffrng.herokuapp.com/extension', true);
xhttp.send();
