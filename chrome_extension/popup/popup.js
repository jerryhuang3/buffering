xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    const response = xhttp.responseText;
    const status = xhttp.status;
    const statusText = xhttp.statusText;
    const responseURL = xhttp.responseURL;
    const parsed = JSON.parse(response);
    console.log("message from localhost:", parsed.message);
    if (parsed.message === "Hello From the Server!") {
      //send message to bg script
      chrome.runtime.sendMessage({ greeting: "hello" }, function(response) {
        console.log(response.farewell);
      });
    }
    console.log(response, status, statusText, responseURL);
  }
};
xhttp.open("GET", "http://localhost:3000/test", true);
xhttp.send();
