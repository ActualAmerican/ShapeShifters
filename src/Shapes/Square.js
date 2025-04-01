import { Shape } from './Shape.js';

// Helper functions for color adjustment.
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
  return (usePound ? "#" : "") + ((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1);
}

function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  let bigint = parseInt(hex, 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b))
    .toString(16)
    .slice(1);
}

function mixColors(hex1, hex2, t) {
  let c1 = hexToRgb(hex1);
  let c2 = hexToRgb(hex2);
  let r = c1.r * (1 - t) + c2.r * t;
  let g = c1.g * (1 - t) + c2.g * t;
  let b = c1.b * (1 - t) + c2.b * t;
  return rgbToHex(r, g, b);
}

export class Square extends Shape {
  constructor(x, y, size, color, name = 'Square') {
    super(x, y, size, color);
    this.name = name;
    
    // Save original values.
    this.baseSize = size;
    this.initialX = x;
    this.initialY = y;
    
    // Level-dependent parameters.
    this.expansionRates = { 1: 0.01, 2: 0.02, 3: 0.02 }; // pixels/ms
    this.movementRadius = 30; // for level 3 circular motion
    
    // Initial settings.
    this.currentLevel = 1;
    this.expansionRate = this.expansionRates[this.currentLevel];
    
    // Shake effect.
    this.shakeDuration = 200; // ms
    this.shakeTime = 0;
    this.shakeMagnitude = 5;
    
    // Mode: "display" or "input".
    this.mode = "display";
    this.displayTimer = 0;
    this.displayIndex = 0;
    
    // Pulse sequence (4 unique sides) and player's input.
    this.pulseSequence = [];
    this.playerInput = [];
    
    // For level 3 circular motion.
    this.angle = 0;
    
    // For smooth color transition (0: dark, 1: light).
    this.transitionProgress = 0;
    
    // For smooth reduction.
    this.reducing = false;
    this.targetSize = this.size;
    
    this.resetSequence(this.currentLevel, true);
  }
  
  update(deltaTime, level) {
    // If level changes, reset size and sequence.
    if (level !== this.currentLevel) {
      this.resetSequence(level, true);
    }
    
    // If currently reducing, animate size toward targetSize.
    if (this.reducing) {
      // Lerp factor; adjust for a fast smooth transition.
      const lerpFactor = 0.2;
      this.size = this.size + (this.targetSize - this.size) * lerpFactor;
      if (Math.abs(this.size - this.targetSize) < 1) {
        this.size = this.targetSize;
        this.reducing = false;
        this.resetSequence(this.currentLevel);
      }
      // Skip normal expansion while reducing.
    } else {
      // Normal expansion.
      this.size += this.expansionRate * deltaTime;
    }
    
    // Level 3: smooth circular motion.
    if (this.currentLevel === 3) {
      this.angle = (this.angle || 0) + 0.002 * deltaTime;
      this.x = this.initialX + this.movementRadius * Math.cos(this.angle);
      this.y = this.initialY + this.movementRadius * Math.sin(this.angle);
    } else {
      this.x = this.initialX;
      this.y = this.initialY;
    }
    
    // Update shake timer.
    if (this.shakeTime > 0) {
      this.shakeTime -= deltaTime;
      if (this.shakeTime < 0) this.shakeTime = 0;
    }
    
    // Handle display mode: cycle through sequence.
    if (this.mode === "display") {
      this.displayTimer += deltaTime;
      const pulseInterval = 700;
      if (this.displayTimer > pulseInterval) {
        this.displayTimer = 0;
        this.displayIndex++;
        if (this.displayIndex >= this.pulseSequence.length) {
          this.mode = "input";
          this.playerInput = [];
          this.transitionProgress = 0;
        }
      }
    }
    
    // In input mode, animate color transition.
    if (this.mode === "input" && this.transitionProgress < 1) {
      this.transitionProgress = Math.min(1, this.transitionProgress + deltaTime / 300);
    } else if (this.mode === "display") {
      this.transitionProgress = 0;
    }
  }
  
  draw(ctx) {
    ctx.save();
    
    // Compute shake offset.
    let offsetX = 0, offsetY = 0;
    if (this.shakeTime > 0) {
      offsetX = (Math.random() - 0.5) * this.shakeMagnitude;
      offsetY = (Math.random() - 0.5) * this.shakeMagnitude;
    }
    let centerX = this.x + offsetX;
    let centerY = this.y + offsetY;
    
    // Draw quadrant dividing lines ("runways") behind the square,
    // clipped to the play area.
    ctx.save();
    const paX = (typeof window.playAreaX !== "undefined") ? window.playAreaX : 100;
    const paY = (typeof window.playAreaY !== "undefined") ? window.playAreaY : 0;
    const paSize = (typeof window.playAreaSize !== "undefined") ? window.playAreaSize : 600;
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
    
    // Translate for square drawing.
    ctx.translate(centerX, centerY);
    
    // Compute fill color based on mode.
    const darkColor = adjustColor(this.color, -20);
    const lightColor = adjustColor(this.color, 20);
    const fillColor = mixColors(darkColor, lightColor, this.transitionProgress);
    
    // Draw the square.
    ctx.fillStyle = fillColor;
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    
    // In display mode, draw the pulsing indicator.
    if (this.mode === "display") {
      const pulseAlpha = 0.5 + 0.5 * Math.sin(performance.now() / 200);
      ctx.strokeStyle = `rgba(255,255,255,${pulseAlpha.toFixed(2)})`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      const elem = this.pulseSequence[this.displayIndex] || "";
      if (elem === "top") {
        ctx.moveTo(-this.size / 2, -this.size / 2);
        ctx.lineTo(this.size / 2, -this.size / 2);
      } else if (elem === "right") {
        ctx.moveTo(this.size / 2, -this.size / 2);
        ctx.lineTo(this.size / 2, this.size / 2);
      } else if (elem === "bottom") {
        ctx.moveTo(-this.size / 2, this.size / 2);
        ctx.lineTo(this.size / 2, this.size / 2);
      } else if (elem === "left") {
        ctx.moveTo(-this.size / 2, -this.size / 2);
        ctx.lineTo(-this.size / 2, this.size / 2);
      }
      ctx.stroke();
    }
    
    ctx.restore();
  }
  
  checkBoundary(playAreaX, playAreaY, playAreaSize) {
    // For level 3, always return false (infinite game mode).
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
    this.resetSequence(1, true);
  }
  
  /**
   * resetSequence(level, newLevel = false)
   * - Updates expansion rate.
   * - If newLevel is true, resets the square's size to its default.
   * - Generates a new 4-element pulse sequence (random permutation of 4 sides).
   * - Resets mode and related variables.
   */
  resetSequence(level, newLevel = false) {
    this.currentLevel = level;
    this.expansionRate = this.expansionRates[level];
    if (newLevel) {
      this.size = this.baseSize;
      this.targetSize = this.size;
      this.reducing = false;
    }
    const sides = ["top", "right", "bottom", "left"];
    this.pulseSequence = this.shuffleArray(sides);
    this.mode = "display";
    this.displayIndex = 0;
    this.displayTimer = 0;
    this.playerInput = [];
  }
  
  handleClick(x, y) {
    if (this.mode !== "input") return false;
    
    const dx = x - this.x;
    const dy = this.y - y; // invert y so upward is positive
    let angleDeg = Math.atan2(dy, dx) * (180 / Math.PI);
    if (angleDeg < 0) angleDeg += 360;
    
    let quadrant = "";
    if (angleDeg >= 45 && angleDeg < 135) {
      quadrant = "top";
    } else if (angleDeg >= 135 && angleDeg < 225) {
      quadrant = "left";
    } else if (angleDeg >= 225 && angleDeg < 315) {
      quadrant = "bottom";
    } else {
      quadrant = "right";
    }
    
    this.playerInput.push(quadrant);
    
    if (this.isSequenceCompleted()) {
      let correct = true;
      for (let i = 0; i < 4; i++) {
        if (this.playerInput[i] !== this.pulseSequence[i]) {
          correct = false;
          break;
        }
      }
      if (correct) {
        // Instead of an instant reduction, initiate smooth reduction.
        this.reducing = true;
        this.targetSize = this.size * 0.5;
      } else {
        this.shakeTime = this.shakeDuration;
        this.resetSequence(this.currentLevel);
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
