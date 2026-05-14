const LINES = [
  { text: 'WHEN YOU',   color: [255, 255, 255] },
  { text: 'JUST WANNA', color: [255, 45, 154] },
  { text: 'BE',         color: [255, 255, 255] },
  { text: 'SOMEWHERE',  color: [255, 45, 154] },
];

const FONT_SIZE = 88;
const LINE_H    = 110;
const LEFT_PAD  = 40;

let revealed       = false;
let revealProgress = 0;
let glitchFrames   = 0;
let nextHover      = false;
let transitioning  = false;
let fadeAlpha      = 0;

// hearts
let hearts = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('Arial Black');
  textStyle(BOLD);

  document.addEventListener('click', function(e) {
    if (isOverNext(e.clientX, e.clientY)) {
      transitioning = true;
    } else {
      revealed = !revealed;
      glitchFrames = 12;
      if (revealed) spawnHearts(e.clientX, e.clientY);
    }
  });

  document.addEventListener('touchend', function(e) {
    var t = e.changedTouches[0];
    if (isOverNext(t.clientX, t.clientY)) {
      transitioning = true;
    } else {
      revealed = !revealed;
      glitchFrames = 12;
      if (revealed) spawnHearts(t.clientX, t.clientY);
    }
  });

  document.addEventListener('mousemove', function(e) {
    nextHover = isOverNext(e.clientX, e.clientY);
  });
}

function spawnHearts(x, y) {
  for (var i = 0; i < 12; i++) {
    hearts.push({
      x:     x,
      y:     y,
      vx:    random(-3, 3),
      vy:    random(-6, -2),
      alpha: 255,
      size:  random(16, 36),
      rot:   random(-0.4, 0.4),
    });
  }
}

function isOverNext(x, y) {
  return x > width - 130 && x < width - 20 && y > height - 65 && y < height - 18;
}

function getLineY(i) {
  var totalH = LINES.length * LINE_H;
  var startY = (height - totalH) / 2 + 70;
  return startY + i * LINE_H;
}

function drawHeart(x, y, s) {
  // simple heart using bezier
  push();
  translate(x, y);
  scale(s / 20);
  beginShape();
  vertex(0, -5);
  bezierVertex(5, -12, 14, -6, 14, 0);
  bezierVertex(14, 6, 7, 12, 0, 18);
  bezierVertex(-7, 12, -14, 6, -14, 0);
  bezierVertex(-14, -6, -5, -12, 0, -5);
  endShape(CLOSE);
  pop();
}

function draw() {
  background(10, 10, 10);

  if (revealed) {
    revealProgress = min(1, revealProgress + 0.02);
  } else {
    revealProgress = max(0, revealProgress - 0.04);
  }

  if (glitchFrames > 0) glitchFrames--;

  // lines
  LINES.forEach(function(ln, i) {
    var delay = i * 0.18;
    var lp    = constrain((revealProgress - delay) / (1 - delay + 0.01), 0, 1);
    var eased = 1 - pow(2, -10 * lp);
    var alpha = eased * 255;
    var y     = getLineY(i) + (1 - eased) * 50;

    if (alpha <= 1) return;

    push();
    fill(255, 45, 154, lp * 50);
    textFont('Arial Black');
    textSize(FONT_SIZE);
    translate(LEFT_PAD, y);
    scale(1, 1 + lp * 0.06);
    text(ln.text, 0, 0);
    pop();

    push();
    fill(ln.color[0], ln.color[1], ln.color[2], alpha);
    textFont('Arial Black');
    textSize(FONT_SIZE);
    text(ln.text, LEFT_PAD, y);
    pop();
  });

  // update + draw hearts
  for (var i = hearts.length - 1; i >= 0; i--) {
    var h = hearts[i];
    h.x     += h.vx;
    h.y     += h.vy;
    h.vy    += 0.12;
    h.alpha -= 4;
    if (h.alpha <= 0) { hearts.splice(i, 1); continue; }

    push();
    noStroke();
    fill(255, 45, 154, h.alpha);
    rotate(h.rot);
    drawHeart(h.x, h.y, h.size);
    pop();
  }

  // scan line
  var t = (frameCount * 0.8) % height;
  push();
  noFill();
  stroke(255, 45, 154, 14);
  strokeWeight(1);
  line(0, t, width, t);
  pop();

  // glitch flash
  if (glitchFrames > 0) {
    var fa = map(glitchFrames, 12, 0, 90, 0);
    push();
    noStroke();
    fill(255, 45, 154, fa);
    rect(0, 0, width, height);
    pop();
  }

  // hint
  if (revealProgress < 0.3) {
    var pulse = map(sin(frameCount * 0.04), -1, 1, 60, 140);
    push();
    fill(255, 255, 255, pulse);
    textFont('Arial');
    textSize(11);
    text('TAP TO REVEAL', LEFT_PAD, height - 32);
    pop();
  }

  // next button
  var bx = width - 130;
  var by = height - 65;
  var bw = 110;
  var bh = 44;
  push();
  noFill();
  stroke(nextHover ? 255 : 80, nextHover ? 45 : 80, nextHover ? 154 : 80);
  strokeWeight(1);
  rect(bx, by, bw, bh);
  fill(nextHover ? 255 : 160, nextHover ? 45 : 160, nextHover ? 154 : 160);
  noStroke();
  textFont('Arial Black');
  textSize(13);
  textAlign(CENTER, CENTER);
  text('NEXT', bx + bw / 2, by + bh / 2);
  textAlign(LEFT, BASELINE);
  pop();

  // fade to page 3
  if (transitioning) {
    fadeAlpha += 5;
    push();
    fill(0, 0, 0, min(fadeAlpha, 255));
    noStroke();
    rect(0, 0, width, height);
    pop();
    if (fadeAlpha >= 255) window.location.href = '../page3/index.html';
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
