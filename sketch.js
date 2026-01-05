
var inc, scl, magv;
var cols, rows;
var fr;
var zoff = 0;
var particles = [];
var particles2 = [];
var flowfield;
var indexk = 0;

// Colors (Global to persist across restarts)
var cr = fxrandRange(100, 200, 1);
var cg = fxrandRange(100, 110, 1);
var cb = fxrandRange(20, 25, 1);
var dr = fxrandRange(10, 255, 1);
var dg = fxrandRange(150, 200, 1);
var db = fxrandRange(100, 150, 1);

function setup() {
  createCanvas(windowWidth, windowHeight);
  // fr = createP("");
  initSketch();
  background(0);
}

function initSketch() {
  // Randomize parameters for more variation
  inc = fxrandRange(0.1, 5, 0.1); 
  scl = fxrandRange(20, 150, 1);
  magv = fxrandRange(0.1, 4, 0.1);
  
  cols = floor(windowWidth / scl);
  rows = floor(windowHeight / scl);
  flowfield = new Array(cols * rows);
  
  particles = [];
  particles2 = [];
  indexk = 0;
  zoff = 0;

  // Variation in particle count
  let numParticles = floor(fxrandRange(150, 300, 1));
  
  // Variation in distribution type
  let distribution = fxrand();

  for (var i = 0; i < numParticles; i++) {
    let x, y;
    if (distribution < 0.4) {
       // Original-like linear distribution
       x = (fxrand() * i) / 10 + windowWidth / 3;
       y = (fxrand() * i) / 5 + windowHeight / 3;
    } else if (distribution < 0.7) {
       // Random distribution
       x = fxrand() * windowWidth;
       y = fxrand() * windowHeight;
    } else {
       // Circular distribution
       let angle = fxrand() * TWO_PI;
       let r = fxrand() * (windowHeight/3);
       x = windowWidth/2 + r * cos(angle);
       y = windowHeight/2 + r * sin(angle);
    }
    
    particles[i] = new Particle(cr, cg, cb, x, y, 0.1);
  }

  for (var i = 0; i < numParticles; i++) {
    let x, y;
    if (distribution < 0.4) {
       x = (fxrand() * i) / 10 + windowWidth / 5;
       y = (fxrand() * i) / 5 + windowHeight / 5;
    } else if (distribution < 0.7) {
       x = fxrand() * windowWidth;
       y = fxrand() * windowHeight;
    } else {
       let angle = fxrand() * TWO_PI;
       let r = fxrand() * (windowHeight/3);
       x = windowWidth/2 + r * cos(angle);
       y = windowHeight/2 + r * sin(angle);
    }
    particles2[i] = new Particle(dr, dg, db, x, y, 0.1);
  }
}

function mousePressed() {
  initSketch();
  background(0);
  loop();
}

function draw() {
  if (indexk > 400) {
    noLoop();
  }
  var yoff = 0;
  for (var y = 0; y < rows; y++) {
    var xoff = 0;
    for (var x = 0; x < cols; x++) {
      var index = x + y * cols;
      var angle = fxrand() * xoff;
      var v = p5.Vector.fromAngle(angle);
      v.setMag(magv);
      flowfield[index] = v; // Fixed assignment order
      xoff += inc;
    }
    yoff += inc;
    zoff += 0.0008;
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
  push();
  rectMode(RADIUS);
  //fill(255, 1 * sin(millis() * 3000));
  noStroke();
  rect(
    windowWidth / 2,
    windowHeight / 2,
    windowWidth / 2 - 30,
    windowHeight / 2 - 30
  );
  pop();
  indexk = indexk + 1;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initSketch();
  background(0);
  loop();
  push();
  rectMode(RADIUS);
  fill(0, 1 * sin(millis() * 1000));
  noStroke();
  rect(
    windowWidth / 2,
    windowHeight / 2,
    windowWidth / 2 - 30,
    windowHeight / 2 - 30
  );
  pop();
}

function fxrandRange(min, max, step) {
  value = Math.round((fxrand() * (max - min)) / step);
  return value * step + min;
}

window.$fxhashFeatures = {
  Earth: cr,
  Moon: dr,
  Sun: magv,
  Life: inc,
  Death: scl,
};
