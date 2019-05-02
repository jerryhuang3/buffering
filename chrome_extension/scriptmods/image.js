$(document).ready(function() {
  if ($('img')) {
    $('img').each(function() {
      imgsrc = this.src;
      console.log(imgsrc);
    });
  } else {
    console.log('no img tags on this page');
  }
});
