// src/shapes/Heart.js
import { Shape } from './Shape.js';

export class Heart extends Shape {
  constructor(x, y, size, _ignoredColor, name = 'Heart') {
    super(x, y, size, '#FF0000');
    this.name = name;

    // Make the heart noticeably bigger
    this.baseSize = size * 1.4;
    this.pulseAmplitude = 0.2; // ±20% scale

    // Intro parameters
    this.playIntro = true;
    this.introTimer = 0;
    this.introDuration = 2500;
    this.fadeInTime = 1200;
    this.glintTime = 1800;

    // Rhythm mechanics
    this.currentLevel = 1;
    this.rhythms = {
      1: [
        [1000],      // BPM 60
        [750],       // BPM 80
        [600],       // BPM 100
      ],
      2: [
        [800, 600, 800, 600],
        [700, 700, 500, 1100],
        [600, 900, 600, 900],
        [500, 500, 1000, 500],
        [900, 600, 900, 600],
      ],
      3: [
        [600, 400, 600, 400, 600, 400],
        [500, 1000, 500, 1000, 500, 1000],
        [700, 700, 700, 700, 700, 700],
        [500, 800, 300, 800, 500, 800],
        [400, 400, 800, 400, 400, 800],
        [600, 600, 600, 600, 600, 600],
        [550, 450, 550, 450, 550, 450],
        [500, 700, 500, 900, 500, 700],
        [450, 450, 450, 450, 450, 450],
        [400, 600, 800, 600, 400, 600],
      ]
    };

    this.rhythmPattern = [];
    this.intervalIndex = 0;
    this.timeSinceLastBeat = 0;
    this.prevTimeSinceLastBeat = 0;
    this.tappedThisBeat = false;
    this.sequencesCompleted = 0;
    this.changeEvery = 1;

    this.tapTolerance = 150;
    this.failed = false;

    // Metronome visual cue
    this.metronomeTimer = 0;

    this.resetSequence(1, true);
  }

  resetSequence(level, isNewLevel = false) {
    this.currentLevel = level;
    this.playIntro = true;
    this.introTimer = 0;

    // Select a random rhythm pattern for this level
    const options = this.rhythms[level];
    this.rhythmPattern = options[Math.floor(Math.random() * options.length)];
    this.intervalIndex = 0;
    this.timeSinceLastBeat = 0;
    this.prevTimeSinceLastBeat = 0;
    this.tappedThisBeat = false;
    this.sequencesCompleted = 0;

    if (level === 1) this.changeEvery = 1;
    else if (level === 2) this.changeEvery = 2;
    else this.changeEvery = 2;

    this.failed = false;
    this.metronomeTimer = 0;
  }

  update(deltaTime, level) {
    // If level changed, reset
    if (level !== this.currentLevel) {
      this.resetSequence(level, true);
    }

    // During intro, only advance introTimer
    if (this.playIntro) {
      this.introTimer += deltaTime;
      if (this.introTimer >= this.introDuration) {
        this.playIntro = false;
      }
      return;
    }

    if (this.failed) return;

    // Metronome flash timer
    this.metronomeTimer = Math.max(0, this.metronomeTimer - deltaTime);

    // Advance beat timers
    this.prevTimeSinceLastBeat = this.timeSinceLastBeat;
    this.timeSinceLastBeat += deltaTime;

    const currentInterval = this.rhythmPattern[this.intervalIndex];

    // On crossing beat, trigger metronome flash
    if (
      this.prevTimeSinceLastBeat < currentInterval &&
      this.timeSinceLastBeat >= currentInterval
    ) {
      this.metronomeTimer = 200; // flash 200ms
    }

    // Missed beat?
    if (!this.tappedThisBeat && this.timeSinceLastBeat > currentInterval + this.tapTolerance) {
      this.failed = true;
      return;
    }

    // Advance to next beat if time
    if (this.timeSinceLastBeat >= currentInterval) {
      if (this.tappedThisBeat) {
        this.tappedThisBeat = false;
        this.timeSinceLastBeat -= currentInterval;
        this.intervalIndex++;
        if (this.intervalIndex >= this.rhythmPattern.length) {
          this.intervalIndex = 0;
          this.sequencesCompleted++;
          if (this.sequencesCompleted >= this.changeEvery) {
            this.sequencesCompleted = 0;
            const opts = this.rhythms[this.currentLevel];
            this.rhythmPattern = opts[Math.floor(Math.random() * opts.length)];
          }
        }
      }
    }
  }

  draw(ctx) {
    // Compute scale for pulsation
    let scale = 1;
    if (!this.playIntro && !this.failed) {
      const interval = this.rhythmPattern[this.intervalIndex];
      const phase = (this.timeSinceLastBeat % interval) / interval; // 0..1
      const sine = Math.sin(phase * 2 * Math.PI);
      scale = 1 + this.pulseAmplitude * sine;
    }

    // Intro fade
    if (this.playIntro) {
      ctx.globalAlpha = Math.min(1, this.introTimer / this.fadeInTime);
    }

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(scale, scale);

    // Draw heart outline path
    ctx.beginPath();
    ctx.moveTo(0, this.baseSize / 4);
    ctx.bezierCurveTo(-this.baseSize / 2, -this.baseSize / 2,
                      -this.baseSize, this.baseSize / 2,
                       0, this.baseSize);
    ctx.bezierCurveTo(this.baseSize, this.baseSize / 2,
                      this.baseSize / 2, -this.baseSize / 2,
                      0, this.baseSize / 4);
    ctx.closePath();

    // Fill heart
    ctx.fillStyle = this.color;
    ctx.fill();

    // Perimeter glint starting exactly at top center, splitting into two clear, large streams
    if (
      this.playIntro &&
      this.introTimer >= this.glintTime &&
      this.introTimer < this.glintTime + 400
    ) {
      const t = (this.introTimer - this.glintTime) / 400; // 0..1

      // Approximate heart perimeter
      const perim = 4 * this.baseSize;
      const highlightLen = perim * 0.2;

      // Starting offset at top center (1/4 of full perimeter)
      const startOffset = perim * 0.25;

      // Clockwise offset from top center
      const cwOffset = startOffset + perim * t;
      // Counter-clockwise offset from top center
      const ccwOffset = startOffset - perim * t;

      // First glint (clockwise)
      ctx.save();
      ctx.globalAlpha = 0.9 - 0.9 * t;
      ctx.strokeStyle = 'rgba(255,255,255,0.8)';
      ctx.lineWidth = 4;
      ctx.setLineDash([highlightLen, perim - highlightLen]);
      ctx.lineDashOffset = -cwOffset;
      ctx.beginPath();
      ctx.moveTo(0, this.baseSize / 4);
      ctx.bezierCurveTo(-this.baseSize / 2, -this.baseSize / 2,
                        -this.baseSize, this.baseSize / 2,
                         0, this.baseSize);
      ctx.bezierCurveTo(this.baseSize, this.baseSize / 2,
                        this.baseSize / 2, -this.baseSize / 2,
                        0, this.baseSize / 4);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();

      // Second glint (counter-clockwise)
      ctx.save();
      ctx.globalAlpha = 0.9 - 0.9 * t;
      ctx.strokeStyle = 'rgba(255,255,255,0.8)';
      ctx.lineWidth = 4;
      ctx.setLineDash([highlightLen, perim - highlightLen]);
      ctx.lineDashOffset = ccwOffset;
      ctx.beginPath();
      ctx.moveTo(0, this.baseSize / 4);
      ctx.bezierCurveTo(-this.baseSize / 2, -this.baseSize / 2,
                        -this.baseSize, this.baseSize / 2,
                         0, this.baseSize);
      ctx.bezierCurveTo(this.baseSize, this.baseSize / 2,
                        this.baseSize / 2, -this.baseSize / 2,
                        0, this.baseSize / 4);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();

      ctx.setLineDash([]); // reset dashes
    }

    ctx.restore();
    ctx.globalAlpha = 1;

    // Metronome flash: circular pulse at heart center on beat
    if (this.metronomeTimer > 0) {
      const paX = this.x;
      const paY = this.y;
      const radius = this.baseSize * 1.2;
      const p = this.metronomeTimer / 200; // 1..0
      ctx.save();
      ctx.globalAlpha = p;
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 3 * p;
      ctx.beginPath();
      ctx.arc(paX, paY, radius * p, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.restore();
    }
  }

  handleClick(x, y) {
    if (this.playIntro || this.failed) return false;

    const dx = x - this.x;
    const dy = y - this.y;
    const dist = Math.hypot(dx, dy);
    if (dist > this.baseSize) return false;

    const currentInterval = this.rhythmPattern[this.intervalIndex];
    const offset = Math.abs(this.timeSinceLastBeat - currentInterval);
    if (offset <= this.tapTolerance) {
      this.tappedThisBeat = true;
      return true;
    } else {
      this.failed = true;
      return false;
    }
  }

  checkBoundary() {
    const interval = this.rhythmPattern[this.intervalIndex];
    const phase = (this.timeSinceLastBeat % interval) / interval;
    const sine = Math.sin(phase * 2 * Math.PI);
    const scale = 1 + this.pulseAmplitude * sine;
    return scale < 0.6 || scale > 1.4;
  }

  isSequenceCompleted() {
    return false;
  }

  reset() {
    this.resetSequence(this.currentLevel, true);
  }
}
