
var inc, scl, magv;
var cols, rows;
var fr;
var zoff = 0;
var particles = [];
var particles2 = [];
var flowfield;
var indexk = 0;
var baseParams = null;

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
  restartWithNewBase();
  background(0);
}

function initSketchFromBase() {
  inc = baseParams.inc;
  scl = baseParams.scl;
  magv = baseParams.magv;

  cols = floor(windowWidth / scl);
  rows = floor(windowHeight / scl);
  flowfield = new Array(cols * rows);
  
  particles = [];
  particles2 = [];
  indexk = 0;
  zoff = 0;

  let numParticles = baseParams.numParticles;

  for (var i = 0; i < numParticles; i++) {
    let x = baseParams.positions1[i][0] * windowWidth;
    let y = baseParams.positions1[i][1] * windowHeight;
    particles[i] = new Particle(cr, cg, cb, x, y, 0.1);
  }

  for (var i = 0; i < numParticles; i++) {
    let x = baseParams.positions2[i][0] * windowWidth;
    let y = baseParams.positions2[i][1] * windowHeight;
    particles2[i] = new Particle(dr, dg, db, x, y, 0.1);
  }
}

function generateBaseParams() {
  let params = {};
  params.inc = fxrandRange(0.1, 5, 0.1);
  params.scl = fxrandRange(20, 150, 1);
  params.magv = fxrandRange(0.1, 4, 0.1);
  params.numParticles = floor(fxrandRange(150, 300, 1));
  params.distribution = fxrand();
  params.positions1 = [];
  params.positions2 = [];

  for (var i = 0; i < params.numParticles; i++) {
    let x1, y1, x2, y2;
    if (params.distribution < 0.4) {
      x1 = (fxrand() * i) / 10 + windowWidth / 3;
      y1 = (fxrand() * i) / 5 + windowHeight / 3;
      x2 = (fxrand() * i) / 10 + windowWidth / 5;
      y2 = (fxrand() * i) / 5 + windowHeight / 5;
    } else if (params.distribution < 0.7) {
      x1 = fxrand() * windowWidth;
      y1 = fxrand() * windowHeight;
      x2 = fxrand() * windowWidth;
      y2 = fxrand() * windowHeight;
    } else {
      let angle1 = fxrand() * TWO_PI;
      let r1 = fxrand() * (min(windowWidth, windowHeight) / 3);
      x1 = windowWidth / 2 + r1 * cos(angle1);
      y1 = windowHeight / 2 + r1 * sin(angle1);
      let angle2 = fxrand() * TWO_PI;
      let r2 = fxrand() * (min(windowWidth, windowHeight) / 3);
      x2 = windowWidth / 2 + r2 * cos(angle2);
      y2 = windowHeight / 2 + r2 * sin(angle2);
    }
    params.positions1[i] = [x1 / windowWidth, y1 / windowHeight];
    params.positions2[i] = [x2 / windowWidth, y2 / windowHeight];
  }
  return params;
}

function restartWithNewBase() {
  baseParams = generateBaseParams();
  initSketchFromBase();
}

function mousePressed() {
  restartWithNewBase();
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
  if (!baseParams) {
    baseParams = generateBaseParams();
  }
  initSketchFromBase();
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
