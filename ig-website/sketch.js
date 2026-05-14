const LINES = [
  { text: 'CONTROL',    color: [255, 45, 154] },
  { text: 'YOUR LUST',  color: [255, 255, 255] },
  { text: 'OR ELSE IT', color: [255, 255, 255, 80] },
  { text: 'WILL',       color: [255, 45, 154] },
  { text: 'CONTROL',    color: [255, 255, 255, 80] },
  { text: 'YOU',        color: [255, 45, 154] },
];

const LINE_H     = 90;
const FONT_SIZE  = 88;
const TOP_PAD    = 160;
const LEFT_PAD   = 40;
const SCROLL_START = 400;
const SCROLL_TOTAL = 3000;

let currentScroll = 0;
let targetScroll  = 0;
let scrollEl;
let transitioning = false;
let fadeAlpha     = 0;
let nextHover     = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('Arial Black');

  scrollEl = document.getElementById('scroll-container');
  if (scrollEl) {
    scrollEl.addEventListener('scroll', function() {
      targetScroll = scrollEl.scrollTop;
    }, { passive: true });
  }

  document.addEventListener('click', function(e) {
    if (isOverNext(e.clientX, e.clientY)) transitioning = true;
  });

  document.addEventListener('mousemove', function(e) {
    nextHover = isOverNext(e.clientX, e.clientY);
  });
}

function isOverNext(x, y) {
  return x > width - 130 && x < width - 20 && y > height - 65 && y < height - 18;
}

function draw() {
  currentScroll += (targetScroll - currentScroll) * 0.12;
  background(10, 10, 10);

  LINES.forEach(function(ln, i) {
    var pinnedY         = TOP_PAD + i * LINE_H;
    var lineScrollStart = SCROLL_START + i * 180;
    var lineProgress    = max(0, min(1, (currentScroll - lineScrollStart) / (SCROLL_TOTAL * 0.7)));
    var stretchAmt      = 1 + lineProgress * (20 + i * 5);
    var drift           = sin(lineProgress * PI * 3 + i * 0.9) * lineProgress * (8 + i * 2.5);
    var alpha           = ln.color[3] !== undefined ? ln.color[3] : 255;
    var fade            = max(0, alpha - lineProgress * alpha * 0.82);

    push();
    textSize(FONT_SIZE);
    textStyle(BOLD);
    noStroke();

    if (lineProgress > 0.02) {
      var ghostAlpha   = min(120, lineProgress * 180);
      var ghostStretch = 1 + lineProgress * 55;
      push();
      fill(255, 45, 154, ghostAlpha * 0.5);
      translate(LEFT_PAD + drift * 0.5, pinnedY);
      scale(1, ghostStretch);
      text(ln.text, 0, 0);
      pop();
    }

    if (lineProgress > 0.1) {
      var glitchAmt = lineProgress * 3;
      push();
      fill(255, 45, 154, fade * 0.4);
      translate(LEFT_PAD + drift + glitchAmt * sin(frameCount * 0.3 + i), pinnedY);
      scale(1, stretchAmt);
      text(ln.text, 0, 0);
      pop();
      push();
      fill(0, 220, 255, fade * 0.25);
      translate(LEFT_PAD + drift - glitchAmt * cos(frameCount * 0.2 + i), pinnedY);
      scale(1, stretchAmt);
      text(ln.text, 0, 0);
      pop();
    }

    fill(ln.color[0], ln.color[1], ln.color[2], fade);
    translate(LEFT_PAD + drift, pinnedY);
    scale(1, stretchAmt);
    text(ln.text, 0, 0);
    pop();
  });

  // scan line
  var t = (frameCount * 0.8) % height;
  push();
  noFill();
  stroke(255, 45, 154, 18);
  strokeWeight(1);
  line(0, t, width, t);
  pop();

  // next button
  drawNextBtn();

  // auto-transition at scroll bottom
  if (scrollEl) {
    var atBottom = scrollEl.scrollTop + scrollEl.clientHeight >= scrollEl.scrollHeight - 20;
    if (atBottom && !transitioning) transitioning = true;
  }

  if (transitioning) {
    fadeAlpha += 5;
    push();
    fill(0, 0, 0, min(fadeAlpha, 255));
    noStroke();
    rect(0, 0, width, height);
    pop();
    if (fadeAlpha >= 255) window.location.href = 'page2/index.html';
  }
}

function drawNextBtn() {
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
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
