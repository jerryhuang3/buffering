$("body").mousemove(function(event) {
  $("*").css("visibility", "hidden");
  setTimeout(function() {
    $("*").css("visibility", "visible");
  }, 2000);
});
