$(document).ready(function() {
  function redactText(textString) {
    var words = textString.split(' ');
    var redacted = words.map(function(word) {
      if (Math.random() < 0.25) {
        return '█'.repeat(word.length);
      } else {
        return word;
      }
    });
    return redacted.join(' ');
  }

  $('body')
    .find('*')
    .contents()
    .filter(function() {
      return this.nodeType === 3;
    })
    .each(function(index, element) {
      console.log(element.data);
      element.data = redactText(element.data);
    });
});
