$(document).ready(function() {
  var path = chrome.extension.getURL('/icons/static.gif');
  if ($('img')) {
    $('img').each(function() {
      imgsrc = this.src;
      console.log(imgsrc);
      $(this).attr('src', path);
      $(this).attr('srcset', path);
      //if the src ends in:
    });
  } else {
    console.log('no img tags on this page');
  }
});
