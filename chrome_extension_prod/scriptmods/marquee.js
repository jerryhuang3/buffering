$(document).ready(function() {
  var possibleDirection = ['left', 'up', 'down', 'right'];
  $('p, h1, h2, h3, h4, h5, h6, li, a, ul, img, video, button, span').wrap(function(index) {
    var tag = possibleDirection[index % 4];
    return '<marquee direction=' + tag + '></marquee>';
  });
});
