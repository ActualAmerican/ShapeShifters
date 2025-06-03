// src/Shapes/Arrow.js

/**
 * Lotus obstacle class, inlined for Arrow gameplay.
 */
class Lotus {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.collisionRadius = size * 0.5;

    this.centerColor = "#FFD1DC";
    this.petalColor  = "#FFB6C1";

    this.baseSpeed     = 0.05;
    this.speed         = this.baseSpeed;
    this.verticalDrift = (Math.random() - 0.5) * 0.03;

    this.angle        = 0;
    this.angularSpeed = 0.001 + Math.random() * 0.001;
  }

  update(deltaTime, level) {
    if (level === 2)      this.speed = this.baseSpeed * 1.5;
    else if (level === 3) this.speed = this.baseSpeed * 2;
    else                  this.speed = this.baseSpeed;

    this.x -= this.speed * deltaTime;
    this.y += this.verticalDrift * deltaTime;
    this.angle += this.angularSpeed * deltaTime;
  }

  draw(ctx) {
    const paX    = window.playAreaX ?? 100;
    const paY    = window.playAreaY ?? 0;
    const paSize = window.playAreaSize ?? 600;

    ctx.save();
    ctx.beginPath();
    ctx.rect(paX, paY, paSize, paSize);
    ctx.clip();

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // center
    const centerR = this.size * 0.2;
    ctx.fillStyle = this.centerColor;
    ctx.beginPath();
    ctx.arc(0, 0, centerR, 0, Math.PI * 2);
    ctx.fill();

    // petals
    const petals = 6;
    for (let i = 0; i < petals; i++) {
      ctx.save();
      ctx.rotate((i / petals) * Math.PI * 2);
      ctx.fillStyle = this.petalColor;
      ctx.beginPath();
      ctx.ellipse(
        this.size * 0.3, 0,
        this.size * 0.2, this.size * 0.1,
        0, 0, Math.PI * 2
      );
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
    ctx.restore();
  }

  checkBoundary(playAreaX, playAreaY, playAreaSize) {
    return (
      this.x + this.collisionRadius < playAreaX ||
      this.x - this.collisionRadius > playAreaX + playAreaSize ||
      this.y + this.collisionRadius < playAreaY ||
      this.y - this.collisionRadius > playAreaY + playAreaSize
    );
  }
}

/**
 * Arrow shape – moves forward, tap to rotate, avoid Lotus obstacles.
 */
export class Arrow {
  constructor(_x, _y, size, _ignoredColor, name = 'Arrow') {
    const paX = window.playAreaX ?? 100;
    const paY = window.playAreaY ?? 0;
    const paSize = window.playAreaSize ?? 600;
    const centerX = paX + paSize / 2;
    const centerY = paY + paSize / 2;

    // Shift left by size so arrow’s origin (tail) is centered
    this.initialX = centerX - size;
    this.initialY = centerY;
    this.x = this.initialX;
    this.y = this.initialY;
    this.size = size;

    this.color = '#FF91A4';
    this.name  = name;

    this.angle       = 0;
    this.targetAngle = 0;
    this.angularSpeed = 0.02;

    this.baseSpeed = 0.2;
    this.speed     = this.baseSpeed;

    this.lotusObstacles     = [];
    this.lotusSpawnTimer    = 0;
    this.lotusSpawnInterval = 2000;

    // Intro + perimeter glint logic
    this.currentLevel = 1;
    this.playIntro    = true;
    this.introTimer   = 0;
    this.introDuration = 2500;  // total intro length
    this.fadeInTime    = 1200;  // fade-in period
    this.glintTime     = 1800;  // start of glint
  }

  update(deltaTime, level) {
    // If level changed, reset and play intro again
    if (level !== this.currentLevel) {
      this.resetSequence(level);
    }

    // During intro, advance timer and skip normal update
    if (this.playIntro) {
      this.introTimer += deltaTime;
      if (this.introTimer >= this.introDuration) {
        this.playIntro = false;
      }
      return;
    }

    // Speed scaling by level
    if (level === 2)      this.speed = this.baseSpeed * 1.5;
    else if (level === 3) this.speed = this.baseSpeed * 2;
    else                  this.speed = this.baseSpeed;

    // Smooth rotation toward targetAngle
    let angleDiff = this.targetAngle - this.angle;
    angleDiff = ((angleDiff + Math.PI) % (2 * Math.PI)) - Math.PI;
    const maxRotation = this.angularSpeed * deltaTime;
    if (Math.abs(angleDiff) <= maxRotation) {
      this.angle = this.targetAngle;
    } else {
      this.angle += Math.sign(angleDiff) * maxRotation;
    }

    // Move forward
    const distance = this.speed * deltaTime;
    this.x += Math.cos(this.angle) * distance;
    this.y += Math.sin(this.angle) * distance;

    // Spawn Lotus obstacles
    this.lotusSpawnTimer += deltaTime;
    if (this.lotusSpawnTimer >= this.lotusSpawnInterval) {
      this.lotusSpawnTimer = 0;
      const paX    = window.playAreaX ?? 100;
      const paY    = window.playAreaY ?? 0;
      const paSize = window.playAreaSize ?? 600;
      const spawnX = paX + paSize + 30;
      const spawnY = paY + Math.random() * paSize;
      this.lotusObstacles.push(new Lotus(spawnX, spawnY, 50));
    }

    // Update and cull Lotus obstacles
    for (let i = this.lotusObstacles.length - 1; i >= 0; i--) {
      const lot = this.lotusObstacles[i];
      lot.update(deltaTime, level);
      if (lot.checkBoundary(window.playAreaX, window.playAreaY, window.playAreaSize)) {
        this.lotusObstacles.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    const paX    = window.playAreaX ?? 100;
    const paY    = window.playAreaY ?? 0;
    const paSize = window.playAreaSize ?? 600;

    ctx.save();
    ctx.beginPath();
    ctx.rect(paX, paY, paSize, paSize);
    ctx.clip();

    // Draw arrow with fade-in and perimeter glint during intro
    ctx.save();
    if (this.playIntro) {
      ctx.globalAlpha = Math.min(1, this.introTimer / this.fadeInTime);
    }
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = this.color;

    const effectiveSize = this.size * 2.0;
    const bodyLength    = effectiveSize * 0.6;
    const arrowHeight   = effectiveSize * 0.3;
    const headWidth     = effectiveSize * 0.7;

    // Local points defining the arrow polygon
    const localPoints = [
      { x: 0,            y: -arrowHeight / 2 },
      { x: bodyLength,   y: -arrowHeight / 2 },
      { x: bodyLength,   y: -headWidth / 2 },
      { x: effectiveSize, y: 0 },
      { x: bodyLength,   y: headWidth / 2 },
      { x: bodyLength,   y: arrowHeight / 2 },
      { x: 0,            y: arrowHeight / 2 }
    ];

    // Draw the filled arrow
    ctx.beginPath();
    ctx.moveTo(localPoints[0].x, localPoints[0].y);
    for (let i = 1; i < localPoints.length; i++) {
      ctx.lineTo(localPoints[i].x, localPoints[i].y);
    }
    ctx.closePath();
    ctx.fill();

    // Perimeter glint: moving highlight along arrow edges
    if (
      this.playIntro &&
      this.introTimer >= this.glintTime &&
      this.introTimer < this.glintTime + 400
    ) {
      // Calculate total perimeter
      let perim = 0;
      for (let i = 0; i < localPoints.length; i++) {
        const p1 = localPoints[i];
        const p2 = localPoints[(i + 1) % localPoints.length];
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        perim += Math.hypot(dx, dy);
      }
      // Highlight length = 15% of perimeter
      const highlightLen = perim * 0.15;
      const offset = perim * ((this.introTimer - this.glintTime) / 400);

      ctx.lineWidth = 4;
      ctx.strokeStyle = "rgba(255,255,255,0.65)";
      ctx.setLineDash([highlightLen, perim]);
      ctx.lineDashOffset = -offset;

      // Stroke the outline
      ctx.beginPath();
      ctx.moveTo(localPoints[0].x, localPoints[0].y);
      for (let i = 1; i < localPoints.length; i++) {
        ctx.lineTo(localPoints[i].x, localPoints[i].y);
      }
      ctx.closePath();
      ctx.stroke();

      // Reset dash
      ctx.setLineDash([]);
    }

    ctx.restore();

    // Draw Lotus obstacles
    for (let lot of this.lotusObstacles) {
      lot.draw(ctx);
    }

    ctx.restore();
  }

  handleClick() {
    this.targetAngle = (this.targetAngle - Math.PI / 2 + 2 * Math.PI) % (2 * Math.PI);
    return true;
  }

  getArrowPolygonPoints() {
    const effectiveSize = this.size * 2.0;
    const bodyLength    = effectiveSize * 0.6;
    const arrowHeight   = effectiveSize * 0.3;
    const headWidth     = effectiveSize * 0.7;

    const localPoints = [
      { x: 0,            y: -arrowHeight / 2 },
      { x: bodyLength,   y: -arrowHeight / 2 },
      { x: bodyLength,   y: -headWidth / 2 },
      { x: effectiveSize, y: 0 },
      { x: bodyLength,   y: headWidth / 2 },
      { x: bodyLength,   y: arrowHeight / 2 },
      { x: 0,            y: arrowHeight / 2 }
    ];

    const cosA = Math.cos(this.angle);
    const sinA = Math.sin(this.angle);

    return localPoints.map(pt => ({
      x: this.x + pt.x * cosA - pt.y * sinA,
      y: this.y + pt.x * sinA + pt.y * cosA
    }));
  }

  checkBoundary(playAreaX, playAreaY, playAreaSize) {
    const poly = this.getArrowPolygonPoints();
    const allLeft  = poly.every(pt => pt.x < playAreaX);
    const allRight = poly.every(pt => pt.x > playAreaX + playAreaSize);
    const allAbove = poly.every(pt => pt.y < playAreaY);
    const allBelow = poly.every(pt => pt.y > playAreaY + playAreaSize);
    return allLeft || allRight || allAbove || allBelow;
  }

  reset() {
    // Center arrow each level, shifted left by size
    const paX = window.playAreaX ?? 100;
    const paY = window.playAreaY ?? 0;
    const paSize = window.playAreaSize ?? 600;
    const centerX = paX + paSize / 2;
    const centerY = paY + paSize / 2;
    this.initialX = centerX - this.size;
    this.initialY = centerY;
    this.x = this.initialX;
    this.y = this.initialY;

    this.angle = 0;
    this.targetAngle = 0;
    this.speed = this.baseSpeed;
    this.lotusObstacles = [];
    this.lotusSpawnTimer = 0;

    // Reset intro for new level
    this.playIntro = true;
    this.introTimer = 0;
  }

  // Called by ShapeManager when level changes
  resetSequence(level) {
    this.currentLevel = level;
    this.reset();
  }
}
