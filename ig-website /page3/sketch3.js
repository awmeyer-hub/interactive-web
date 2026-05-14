const WORDS  = ['JUST', 'TRY', 'TO', 'BE', 'HAPPY'];
const PINK   = [255, 45, 154];
const WHITE  = [255, 255, 255];
const COLORS = [WHITE, PINK, WHITE, PINK, WHITE];

const FONT_SIZE = 100;
const LINE_H    = 108;
const LEFT_PAD  = 40;

let cursorImg;
let cursorX = -999, cursorY = -999;
let words   = [];
let glitchFrames = 0;
let tapX = 0, tapY = 0;
let revealCount  = 0;
let restartHover = false;

function preload() {
  cursorImg = loadImage('cursor.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('Arial Black');
  textStyle(BOLD);
  initWords();

  document.addEventListener('mousemove', function(e) {
    cursorX = e.clientX;
    cursorY = e.clientY;
    restartHover = isOverRestart(e.clientX, e.clientY);
  });

  document.addEventListener('click', function(e) {
    if (isOverRestart(e.clientX, e.clientY)) {
      restart();
    } else {
      handleTap(e.clientX, e.clientY);
    }
  });

  document.addEventListener('touchmove', function(e) {
    cursorX = e.touches[0].clientX;
    cursorY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', function(e) {
    var t = e.changedTouches[0];
    cursorX = t.clientX;
    cursorY = t.clientY;
    if (isOverRestart(t.clientX, t.clientY)) {
      restart();
    } else {
      handleTap(t.clientX, t.clientY);
    }
  });
}

function initWords() {
  var totalH = WORDS.length * LINE_H;
  var startY = (windowHeight - totalH) / 2 + 80;
  words = WORDS.map(function(w, i) {
    return { text: w, color: COLORS[i], x: LEFT_PAD, y: startY + i * LINE_H, alpha: 0, revealed: false, glitch: 0 };
  });
  revealCount = 0;
}

function restart() {
  glitchFrames = 12;
  setTimeout(function() {
    window.location.href = '../index.html';
  }, 300);
}

function isOverRestart(x, y) {
  return x > width - 140 && x < width - 20 && y > height - 65 && y < height - 18;
}

function handleTap(tx, ty) {
  var closest = null;
  var minDist = Infinity;
  words.forEach(function(w) {
    if (w.revealed) return;
    var cx = w.x + 60;
    var d  = Math.sqrt(Math.pow(tx - cx, 2) + Math.pow(ty - (w.y - LINE_H * 0.4), 2));
    if (d < minDist) { minDist = d; closest = w; }
  });
  if (closest) {
    closest.revealed = true;
    closest.glitch   = 14;
    tapX = tx; tapY = ty;
    glitchFrames = 8;
    revealCount++;
  }
}

function draw() {
  background(10, 10, 10);

  words.forEach(function(w) {
    if (w.revealed && w.alpha < 255) w.alpha = min(255, w.alpha + 14);
    if (w.glitch > 0) w.glitch--;
  });
  if (glitchFrames > 0) glitchFrames--;

  // hint
  if (revealCount < WORDS.length) {
    var pulse = map(sin(frameCount * 0.04), -1, 1, 60, 140);
    push();
    fill(255, 255, 255, pulse);
    textFont('Arial');
    textStyle(NORMAL);
    textSize(11);
    text('TAP TO REVEAL', LEFT_PAD, height - 32);
    pop();
  }

  // words
  words.forEach(function(w, i) {
    if (w.alpha <= 0) return;

    // ghost
    push();
    fill(PINK[0], PINK[1], PINK[2], w.alpha * 0.15);
    textFont('Arial Black'); textStyle(BOLD); textSize(FONT_SIZE);
    translate(w.x - 2, w.y);
    scale(1, 1.04);
    text(w.text, 0, 0);
    pop();

    // rgb split
    if (w.glitch > 0) {
      var g = (w.glitch / 14) * 5;
      push();
      textFont('Arial Black'); textStyle(BOLD); textSize(FONT_SIZE);
      fill(PINK[0], PINK[1], PINK[2], w.alpha * 0.4);
      text(w.text, w.x + g * sin(frameCount * 0.5 + i), w.y);
      fill(0, 220, 255, w.alpha * 0.25);
      text(w.text, w.x - g * cos(frameCount * 0.4 + i), w.y);
      pop();
    }

    // main
    push();
    fill(w.color[0], w.color[1], w.color[2], w.alpha);
    textFont('Arial Black'); textStyle(BOLD); textSize(FONT_SIZE);
    text(w.text, w.x, w.y);
    pop();
  });

  // tap flash
  if (glitchFrames > 0) {
    var fa = map(glitchFrames, 8, 0, 80, 0);
    push();
    noStroke();
    fill(PINK[0], PINK[1], PINK[2], fa);
    ellipse(tapX, tapY, 120, 120);
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

  // restart button
  var bx = width - 140;
  var by = height - 65;
  var bw = 120;
  var bh = 44;
  push();
  noFill();
  stroke(restartHover ? 255 : 80, restartHover ? 45 : 80, restartHover ? 154 : 80);
  strokeWeight(1);
  rect(bx, by, bw, bh);
  fill(restartHover ? 255 : 160, restartHover ? 45 : 160, restartHover ? 154 : 160);
  noStroke();
  textFont('Arial Black');
  textSize(13);
  textAlign(CENTER, CENTER);
  text('START OVER', bx + bw / 2, by + bh / 2);
  textAlign(LEFT, BASELINE);
  pop();

  // cursor — bigger, no ring
  if (cursorImg && cursorX > -100) {
    var cw = 130;
    var ch = cw * (cursorImg.height / cursorImg.width);
    push();
    imageMode(CENTER);
    var wobble = sin(frameCount * 0.06) * 2;
    image(cursorImg, cursorX + wobble, cursorY + wobble, cw, ch);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initWords();
}
