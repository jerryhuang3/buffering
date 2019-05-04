function draw() {
  let x = 0;
  let y = 0;
  const canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d');
  initialize();

  function initialize() {
    window.addEventListener('resize', resizeCanvas, false);
    resizeCanvas();
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  canvas.addEventListener('mousemove', event => {
    x = event.offsetX;
    y = event.offsetY;
    circles(x, y);
  });

  function circles(x, y) {
    context.beginPath();
    context.fillStyle = '#000';
    context.arc(x, y, 10, 0, Math.PI * 2);
    context.fill();
    context.closePath();
  }
}

function addStyle() {
  $('head').append('<style>#canvas {position: fixed; top: 0; }</style>');
}

function addCanvas() {
  $('body').append("<canvas id='canvas'></canvas>");
}

$(document).ready(function() {
  addStyle();
  addCanvas();
  draw();
});
