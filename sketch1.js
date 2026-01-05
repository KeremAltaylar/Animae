var cols, rows;
var fr;
var zoff = 0;
var yoff = 0;
var xoff = 0;
var particles = [];
var particles2 = [];
var flowfield;
//let maineye;

function setup() {
  createCanvas(windowWidth, windowHeight);
  cols = floor(width / scl);
  rows = floor(height / scl);
  var inc = random(0.1, 10);
  var scl = random(10, 150);
  console.log(scl);
  flowfield = new Array(cols * rows);
  for (i = 0; i < 500; i++) {
    particles[i] = new Particle();
  }
  for (i = 0; i < 500; i++) {
    particles2[i] = new Particle2();
  }
  background(0);
  noiseSeed(99);
}

function draw() {
  for (var y = 0; y < rows; y++) {
    var xoff = 0;
    for (var x = 0; x < cols; x++) {
      var index = x + y * cols;
      flowfield[index] = v;
      //var angle = noise(xoff * 1000, yoff * 400, zoff * 4000);
      var angle = noise(xoff, yoff, zoff) * random(100);
      var v = p5.Vector.fromAngle(angle);
      v.setMag(random(25));
      xoff += inc;
      stroke(0, 130);
    }
    yoff += inc;
    zoff += 0.1;
  }
  for (var i = 0; i < particles.length; i++) {
    particles[i].follow(flowfield);
    particles[i].update();
    particles[i].edges();
    particles[i].show();
  }
  for (var i = 0; i < particles2.length; i++) {
    particles2[i].follow(flowfield);
    particles2[i].update();
    particles2[i].edges();
    particles2[i].show();
  }

  //maineye.draw();
}
