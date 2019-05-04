console.log('%cHello from content script', 'background: red; color: yellow; font-size: large');

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    const response = xhttp.responseText;
    const status = xhttp.status;
    const statusText = xhttp.statusText;
    const responseURL = xhttp.responseURL;
    // const parsed = JSON.parse(response);
    console.log('content script xml details', response, status, statusText, responseURL);
    chrome.runtime.sendMessage({ response }, function(response) {
      console.log(response);
    });

    // console.log(response, status, statusText, responseURL);
  }
};
xhttp.open('POST', 'http://localhost:3000/extension', true);
xhttp.send();
