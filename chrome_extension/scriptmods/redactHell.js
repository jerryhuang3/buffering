$(document).ready(function() {
  function redactText(textString) {
    var words = textString.split(' ');
    var redacted = words.map(function(word) {
      console.log('doing stuff');
      if (Math.random() < 0.25) {
        return '█'.repeat(word.length);
      } else {
        return word;
      }
    });
    return redacted.join(' ');
  }

  $('body').text(function(index) {
    return redactText($(this).text());
  });
});
