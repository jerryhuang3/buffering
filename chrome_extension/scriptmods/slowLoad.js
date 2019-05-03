// this doesn't work atm

$('head').append($("<script>$('html').css('visibility', 'hidden');</script>"));

$(document).ready(function() {
  $('html').css('visibility', 'hidden');
  setTimeout(function() {
    $('html').css('visibility', 'visible');
  }, 5000);
});
