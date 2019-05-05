// chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
//   $('body').attr('id', 'shadow-body');

//   var path = chrome.extension.getURL('../vendor/overhang.css');
//   $('head').append(
//     $('<link>').attr({
//       rel: 'stylesheet',
//       type: 'text/css',
//       href: path
//     })
//   );

//   $('body').overhang({
//     type: 'error',
//     message: `${message.name} is now being activated!`,
//     duration: 5,
//     upper: true
//   });
// });
