// Square.js
import { Shape } from './Shape.js';

// Utility functions
function adjustColor(hex, amount) {
  let usePound = false;
  if (hex[0] === "#") {
    hex = hex.slice(1);
    usePound = true;
  }
  let num = parseInt(hex, 16);
  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0x00FF) + amount;
  let b = (num & 0x0000FF) + amount;
  r = Math.max(Math.min(255, r), 0);
  g = Math.max(Math.min(255, g), 0);
  b = Math.max(Math.min(255, b), 0);
  return (usePound ? "#" : "") + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  let bigint = parseInt(hex, 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b)).toString(16).slice(1);
}

function mixColors(hex1, hex2, t) {
  const c1 = hexToRgb(hex1);
  const c2 = hexToRgb(hex2);
  return rgbToHex(
    c1.r * (1 - t) + c2.r * t,
    c1.g * (1 - t) + c2.g * t,
    c1.b * (1 - t) + c2.b * t
  );
}

export class Square extends Shape {
  constructor(x, y, size, color, name = 'Square') {
    super(x, y, size, color);
    this.name = name;

    this.baseSize = size;
    this.initialX = x;
    this.initialY = y;

    this.expansionRates = { 1: 0.01, 2: 0.02, 3: 0.02 };
    this.currentLevel = 1;
    this.expansionRate = this.expansionRates[this.currentLevel];
    this.movementRadius = 30;

    this.shakeDuration = 200;
    this.shakeTime = 0;
    this.shakeMagnitude = 5;

    this.mode = "display";
    this.displayTimer = 0;
    this.displayIndex = 0;

    this.pulseSequence = [];
    this.playerInput = [];

    this.angle = 0;
    this.transitionProgress = 0;

    this.reducing = false;
    this.targetSize = this.size;

    this.playIntro = true;
    this.introTimer = 0;
    this.introDuration = 2500;
    this.fadeInTime = 1200;
    this.glintTime = 1800;

    this.resetSequence(this.currentLevel, true);
  }

  update(deltaTime, level) {
    if (level !== this.currentLevel) {
      this.resetSequence(level, true);
    }

    if (this.playIntro) {
      this.introTimer += deltaTime;
      if (this.introTimer >= this.introDuration) {
        this.playIntro = false;
      }
      return;
    }

    if (this.reducing) {
      const lerpFactor = 0.2;
      this.size += (this.targetSize - this.size) * lerpFactor;
      if (Math.abs(this.size - this.targetSize) < 1) {
        this.size = this.targetSize;
        this.reducing = false;
        this.resetSequence(this.currentLevel, false);
      }
    } else {
      this.size += this.expansionRate * deltaTime;
    }

    if (this.currentLevel === 3) {
      this.angle = (this.angle || 0) + 0.002 * deltaTime;
      this.x = this.initialX + this.movementRadius * Math.cos(this.angle);
      this.y = this.initialY + this.movementRadius * Math.sin(this.angle);
    } else {
      this.x = this.initialX;
      this.y = this.initialY;
    }

    if (this.shakeTime > 0) {
      this.shakeTime -= deltaTime;
      if (this.shakeTime < 0) this.shakeTime = 0;
    }

    if (this.mode === "display") {
      this.displayTimer += deltaTime;
      if (this.displayTimer > 700) {
        this.displayTimer = 0;
        this.displayIndex++;
        if (this.displayIndex >= this.pulseSequence.length) {
          this.mode = "input";
          this.playerInput = [];
          this.transitionProgress = 0;
        }
      }
    }

    if (this.mode === "input" && this.transitionProgress < 1) {
      this.transitionProgress = Math.min(1, this.transitionProgress + deltaTime / 300);
    }
  }

  draw(ctx) {
    if (this.playIntro) {
      ctx.globalAlpha = Math.min(1, this.introTimer / this.fadeInTime);
    }

    ctx.save();
    let offsetX = 0, offsetY = 0;
    if (this.shakeTime > 0) {
      offsetX = (Math.random() - 0.5) * this.shakeMagnitude;
      offsetY = (Math.random() - 0.5) * this.shakeMagnitude;
    }
    let centerX = this.x + offsetX;
    let centerY = this.y + offsetY;

    const paX = window.playAreaX ?? 100;
    const paY = window.playAreaY ?? 0;
    const paSize = window.playAreaSize ?? 600;

    ctx.save();
    ctx.resetTransform();
    ctx.beginPath();
    ctx.rect(paX, paY, paSize, paSize);
    ctx.clip();

    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 2;
    const L = paSize * 2;
    [45, 135, 225, 315].forEach(deg => {
      const rad = deg * Math.PI / 180;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + L * Math.cos(rad), centerY + L * Math.sin(rad));
      ctx.stroke();
    });
    ctx.restore();

    ctx.translate(centerX, centerY);
    const darkColor = adjustColor(this.color, -20);
    const lightColor = adjustColor(this.color, 20);
    const progress = this.mode === "input" ? this.transitionProgress : 0;
    const fillColor = mixColors(darkColor, lightColor, progress);
    ctx.fillStyle = fillColor;
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);

    if (this.playIntro && this.introTimer >= this.glintTime && this.introTimer < this.glintTime + 400) {
      const t = (this.introTimer - this.glintTime) / 400;
      const glintX = -this.size / 2 + this.size * t;
      const glint = ctx.createLinearGradient(glintX - 12, 0, glintX + 12, 0);
      glint.addColorStop(0, 'rgba(255,255,255,0)');
      glint.addColorStop(0.5, 'rgba(255,255,255,0.65)');
      glint.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = glint;
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    }

    if (this.mode === "display" && !this.playIntro) {
      const pulseAlpha = 0.5 + 0.5 * Math.sin(performance.now() / 200);
      ctx.strokeStyle = `rgba(255,255,255,${pulseAlpha.toFixed(2)})`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      const elem = this.pulseSequence[this.displayIndex] || "";
      const h = this.size / 2;
      if (elem === "top") {
        ctx.moveTo(-h, -h);
        ctx.lineTo(h, -h);
      } else if (elem === "right") {
        ctx.moveTo(h, -h);
        ctx.lineTo(h, h);
      } else if (elem === "bottom") {
        ctx.moveTo(-h, h);
        ctx.lineTo(h, h);
      } else if (elem === "left") {
        ctx.moveTo(-h, -h);
        ctx.lineTo(-h, h);
      }
      ctx.stroke();
    }

    ctx.restore();
    ctx.globalAlpha = 1;
  }

  checkBoundary(playAreaX, playAreaY, playAreaSize) {
    if (this.currentLevel === 3) return false;
    const half = this.size / 2;
    return (
      this.x - half < playAreaX ||
      this.x + half > playAreaX + playAreaSize ||
      this.y - half < playAreaY ||
      this.y + half > playAreaY + playAreaSize
    );
  }

  isSequenceCompleted() {
    return this.playerInput.length === 4;
  }

  reset() {
    this.x = this.initialX;
    this.y = this.initialY;
    this.size = this.baseSize;
    this.angle = 0;
    this.resetSequence(this.currentLevel, false);
  }

  resetSequence(level, isNewLevel = false) {
    this.currentLevel = level;
    this.expansionRate = this.expansionRates[level];
    this.pulseSequence = this.shuffleArray(["top", "right", "bottom", "left"]);
    this.mode = "display";
    this.displayIndex = 0;
    this.displayTimer = 0;
    this.playerInput = [];

    if (isNewLevel) {
      this.size = this.baseSize;
      this.targetSize = this.size;
      this.reducing = false;
      this.playIntro = true;
      this.introTimer = 0;
    }
  }

  handleClick(x, y) {
    if (this.mode !== "input" || this.playIntro) return false;

    const dx = x - this.x;
    const dy = this.y - y;
    let angleDeg = Math.atan2(dy, dx) * (180 / Math.PI);
    if (angleDeg < 0) angleDeg += 360;

    let quadrant = "";
    if (angleDeg >= 45 && angleDeg < 135) quadrant = "top";
    else if (angleDeg >= 135 && angleDeg < 225) quadrant = "left";
    else if (angleDeg >= 225 && angleDeg < 315) quadrant = "bottom";
    else quadrant = "right";

    this.playerInput.push(quadrant);

    if (this.isSequenceCompleted()) {
      let correct = this.playerInput.every((v, i) => v === this.pulseSequence[i]);
      if (correct) {
        this.reducing = true;
        this.targetSize = this.size * 0.5;
      } else {
        this.shakeTime = this.shakeDuration;
        this.resetSequence(this.currentLevel, false);
      }
    }
    return true;
  }

  shuffleArray(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}
