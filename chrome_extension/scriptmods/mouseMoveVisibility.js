$(document).ready(function() {
  $('body').mousemove(function(event) {
    $('*').css('visibility', 'hidden');
    $('head').append($('<style>* {cursor : help }</style>'));
    setTimeout(function() {
      $('*').css('visibility', 'visible');
      $('head').append($('<style>* {cursor : auto }</style>'));
    }, 2000);
  });
});
