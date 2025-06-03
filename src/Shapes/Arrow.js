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
  constructor(x, y, size, color, name) {
    this.initialX = x;
    this.initialY = y;
    this.x = x;
    this.y = y;
    this.size = size;

    this.color = '#FF91A4';
    this.name  = 'Arrow';

    this.angle       = 0;
    this.targetAngle = 0;
    this.angularSpeed = 0.02;

    this.baseSpeed = 0.2;
    this.speed     = this.baseSpeed;

    this.lotusObstacles     = [];
    this.lotusSpawnTimer    = 0;
    this.lotusSpawnInterval = 2000;
  }

  update(deltaTime, level) {
    // speed scaling
    if (level === 2)      this.speed = this.baseSpeed * 1.5;
    else if (level === 3) this.speed = this.baseSpeed * 2;
    else                  this.speed = this.baseSpeed;

    // smooth rotation
    let angleDiff = this.targetAngle - this.angle;
    angleDiff = ((angleDiff + Math.PI) % (2 * Math.PI)) - Math.PI;
    const maxRotation = this.angularSpeed * deltaTime;
    if (Math.abs(angleDiff) <= maxRotation) {
      this.angle = this.targetAngle;
    } else {
      this.angle += Math.sign(angleDiff) * maxRotation;
    }

    // move forward
    const distance = this.speed * deltaTime;
    this.x += Math.cos(this.angle) * distance;
    this.y += Math.sin(this.angle) * distance;

    // spawn Lotus
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

    // update & cull Lotus
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

    // draw arrow
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = this.color;

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

    ctx.beginPath();
    ctx.moveTo(localPoints[0].x, localPoints[0].y);
    for (let i = 1; i < localPoints.length; i++) {
      ctx.lineTo(localPoints[i].x, localPoints[i].y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // draw Lotus obstacles
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
    this.x = this.initialX;
    this.y = this.initialY;
    this.angle = 0;
    this.targetAngle = 0;
    this.speed = this.baseSpeed;
    this.lotusObstacles = [];
    this.lotusSpawnTimer = 0;
  }
}
