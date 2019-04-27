console.log("hi from the background!");

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    // Typical action to be performed when the document is ready:

    console.log(xhttp.responseText, xhttp.status, xhttp.statusText);
  }
};
xhttp.open("GET", "http://localhost:8080/test", true);
xhttp.send();
