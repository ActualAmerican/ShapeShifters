// src/shapes/Circle.js
import { Shape } from './Shape.js';

export class Circle extends Shape {
  constructor(x, y, size, _ignoredColor, name = 'Circle') {
    super(x, y, size, '#3399FF');
    this.name = name;

    this.platformWidth = 120;
    this.platformHeight = 12;
    this.playArea = {
      x: window.playAreaX ?? 100,
      y: window.playAreaY ?? 0,
      size: window.playAreaSize ?? 600
    };

    this.platformY = this.playArea.y + this.playArea.size - this.platformHeight;
    this.platformX = this.playArea.x + this.playArea.size / 2 - this.platformWidth / 2;
    this.platformTargetX = this.platformX;

    this.maxSpeed = 3.5;
    this.ballSize = size + 10;
    this.balls = [];

    this.crossingLog = [];
    this.crossingThreshold = 10;
    this.crossingWindow = 2000;
    this.lastSideTouched = null;
    this.paddleStunned = false;
    this.paddleStunTimer = 0;

    this.introActive = true;
    this.introTimer = 0;
    this.introDuration = 2500;
    this.fadeInTime = 1200;
    this.glintTime = 1800;
    this.paddleMorphProgress = 0;

    this.currentLevel = 1;

    this.bindMouse();
    this.resetSequence(1, true);
  }

  trackPaddleCrossing() {
    const now = performance.now();
    const left = this.playArea.x;
    const right = left + this.playArea.size;
    const paddleLeft = this.platformX;
    const paddleRight = this.platformX + this.platformWidth;

    let currentSide = null;
    if (paddleLeft <= left) currentSide = 'left';
    else if (paddleRight >= right) currentSide = 'right';

    if (currentSide && currentSide !== this.lastSideTouched) {
      this.crossingLog.push(now);
      this.lastSideTouched = currentSide;
    }

    const cutoff = now - this.crossingWindow;
    this.crossingLog = this.crossingLog.filter(t => t >= cutoff);

    if (this.crossingLog.length >= this.crossingThreshold) {
      this.paddleStunned = true;
      this.paddleStunTimer = 1500;
      this.crossingLog = [];
    }
  }

  update(deltaTime, level) {
    if (level !== this.currentLevel) {
      this.resetSequence(level);
    }

    this.trackPaddleCrossing();

    if (this.paddleStunned) {
      this.paddleStunTimer -= deltaTime;
      if (this.paddleStunTimer <= 0) {
        this.paddleStunned = false;
      }
    } else {
      const dx = this.platformTargetX - this.platformX;
      this.platformX += dx * 0.2;
    }

    if (this.introActive) {
      this.introTimer += deltaTime;
      this.paddleMorphProgress = Math.min(1, this.introTimer / this.introDuration);
      const centerX = this.playArea.x + this.playArea.size / 2 - this.platformWidth / 2;
      this.platformX = centerX;

      if (this.introTimer >= this.introDuration) {
        this.introActive = false;
        this.paddleMorphProgress = 1;
        this.platformX = this.platformTargetX;
      }
      return;
    }

    for (let ball of this.balls) {
      if (!ball.launched) {
        ball.launchDelay -= deltaTime;
        if (ball.launchDelay <= 0) {
          ball.vx = ball.baseVX;
          ball.vy = ball.baseVY;
          ball.launched = true;
        }
        continue;
      }

      ball.x += ball.vx;
      ball.y += ball.vy;

      ball.vx = Math.max(-this.maxSpeed, Math.min(this.maxSpeed, ball.vx));
      ball.vy = Math.max(-this.maxSpeed, Math.min(this.maxSpeed, ball.vy));

      const left = this.playArea.x;
      const right = left + this.playArea.size;
      const top = this.playArea.y;

      if (ball.x - ball.radius <= left) {
        ball.x = left + ball.radius;
        ball.vx *= -1;
        this.triggerSquish(ball, 'vertical');
      }

      if (ball.x + ball.radius >= right) {
        ball.x = right - ball.radius;
        ball.vx *= -1;
        this.triggerSquish(ball, 'vertical');
      }

      if (ball.y - ball.radius <= top) {
        ball.y = top + ball.radius;
        ball.vy *= -1;
        this.triggerSquish(ball, 'horizontal');
      }

      const paddleTop = this.platformY;
      const paddleBottom = this.platformY + this.platformHeight;
      const paddleLeft = this.platformX;
      const paddleRight = this.platformX + this.platformWidth;

      const ballBottom = ball.y + ball.radius;
      const ballTop = ball.y - ball.radius;
      const ballLeft = ball.x - ball.radius;
      const ballRight = ball.x + ball.radius;

      const isColliding =
        ballBottom >= paddleTop &&
        ballTop <= paddleBottom &&
        ballRight >= paddleLeft &&
        ballLeft <= paddleRight &&
        ball.vy > 0;

      if (isColliding) {
        ball.vy *= -1;
        const offset = (ball.x - this.platformX) / this.platformWidth - 0.5;
        ball.vx += offset * 1.2;
        ball.y = this.platformY - ball.radius;
        this.triggerSquish(ball, 'horizontal');
      }

      if (ball.squishTimer > 0) {
        ball.squishTimer -= deltaTime;
        const progress = 1 - ball.squishTimer / ball.squishDuration;
        const wobble = Math.sin(progress * Math.PI * 2);
        const amount = 0.25 * (1 - progress) * wobble; // exaggerated squish

        if (ball.lastBounce === 'horizontal') {
          ball.scaleX = 1 + amount;
          ball.scaleY = 1 - amount;
        } else {
          ball.scaleX = 1 - amount;
          ball.scaleY = 1 + amount;
        }
      } else {
        ball.scaleX = 1;
        ball.scaleY = 1;
      }
    }
  }

  bindMouse() {
    window.addEventListener('mousemove', (e) => {
      if (this.introActive || this.paddleStunned) return;
      const rect = document.getElementById('gameCanvas').getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      this.platformTargetX = mouseX - this.platformWidth / 2;
    });
  }

  resetSequence(level) {
    this.currentLevel = level;
    this.introActive = true;
    this.introTimer = 0;
    this.paddleMorphProgress = 0;
    this.balls = [];

    const cx = this.playArea.x + this.playArea.size / 2;
    const cy = this.playArea.y + this.playArea.size / 2;
    const ballCount = level === 1 ? 1 : level === 2 ? 2 : 3;
    const speed = 2.0 * (1 + 0.05 * (level - 1));
    const baseDelay = 600;

    for (let i = 0; i < ballCount; i++) {
      this.balls.push({
        x: cx,
        y: cy,
        vx: 0,
        vy: 0,
        launchDelay: i * baseDelay,
        launched: false,
        radius: this.ballSize / 2,
        scaleX: 1,
        scaleY: 1,
        squishTimer: 0,
        squishDuration: 180,
        lastBounce: null,
        baseVX: (Math.random() > 0.5 ? 1 : -1) * speed * (0.9 + Math.random() * 0.2),
        baseVY: -speed
      });
    }
  }

  triggerSquish(ball, direction) {
    ball.lastBounce = direction;
    ball.squishTimer = ball.squishDuration;
  }

  draw(ctx) {
    const { x: px, y: py, size: pSize } = this.playArea;

    ctx.save();
    const coverH = 6;
    const grad = ctx.createLinearGradient(px, py + pSize - coverH, px, py + pSize);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.fillStyle = grad;
    ctx.fillRect(px, py + pSize - coverH, pSize, coverH);
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.rect(px, py, pSize, pSize);
    ctx.clip();

    const interp = this.paddleMorphProgress;
    const morphWidth = this.platformWidth + (1 - interp) * (pSize - this.platformWidth);
    const morphHeight = this.platformHeight * interp + 1 * (1 - interp);
    const interpX = this.platformX - (morphWidth - this.platformWidth) / 2;
    const interpY = py + pSize - morphHeight;

    let shakeOffset = 0;
    if (this.paddleStunned) {
      shakeOffset = Math.sin(performance.now() / 50) * 6;
    }

    ctx.fillStyle = this.paddleStunned ? 'rgba(255,255,255,0.3)' : 'white';
    ctx.fillRect(interpX + shakeOffset, interpY, morphWidth, morphHeight);
    ctx.restore();

    for (let ball of this.balls) {
      ctx.save();
      ctx.translate(ball.x, ball.y);

      if (this.introActive) {
        const alpha = Math.min(1, this.introTimer / this.fadeInTime);
        ctx.globalAlpha = alpha;

        if (this.introTimer >= this.glintTime && this.introTimer < this.glintTime + 400) {
          const t = (this.introTimer - this.glintTime) / 400;
          const glintX = -ball.radius + 2 * ball.radius * t;
          const glint = ctx.createLinearGradient(glintX - 12, 0, glintX + 12, 0);
          glint.addColorStop(0, 'rgba(255,255,255,0)');
          glint.addColorStop(0.5, 'rgba(255,255,255,0.65)');
          glint.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.fillStyle = glint;
          ctx.beginPath();
          ctx.arc(0, 0, ball.radius + 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.scale(ball.scaleX, ball.scaleY);
      ctx.beginPath();
      ctx.arc(0, 0, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#3399FF';
      ctx.fill();
      ctx.restore();
    }
  }

  handleClick() { return false; }
  checkBoundary() {
    const bottom = this.playArea.y + this.playArea.size;
    return this.balls.some(ball => ball.y - ball.radius > bottom);
  }
  isSequenceCompleted() { return false; }
  reset() { this.resetSequence(this.currentLevel); }
}
