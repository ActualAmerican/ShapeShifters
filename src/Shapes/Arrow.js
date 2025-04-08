// src/shapes/Arrow.js
import { Lotus } from '../props/Lotus.js';

export class Arrow {
  /**
   * Arrow constructor.
   * Parameters:
   *   x, y   - initial position (should be within the play area)
   *   size   - base size (e.g., 50)
   *   Extra parameters (color, name) are ignored.
   */
  constructor(x, y, size, color, name) {
    // Save initial position for resetting.
    this.initialX = x;
    this.initialY = y;
    this.x = x;
    this.y = y;
    this.size = size;
    // Force salmon color.
    this.color = '#FF91A4';
    // Force name to "Arrow".
    this.name = 'Arrow';

    // The arrow starts pointing to the right (0 radians).
    this.angle = 0;
    this.targetAngle = 0;
    // Angular speed in radians per ms; increased for a brisk smooth turn.
    this.angularSpeed = 0.02;

    // Base speed (pixels per ms) for level 1.
    this.baseSpeed = 0.2;
    this.speed = this.baseSpeed;

    // Lotus obstacle management (only used in Arrow gameplay).
    this.lotusObstacles = [];
    this.lotusSpawnTimer = 0;
    // Spawn a new lotus every 2000 ms.
    this.lotusSpawnInterval = 2000;
  }

  /**
   * update(deltaTime, level)
   * Moves the arrow and smoothly rotates it toward its target angle.
   * Also updates and spawns lotus obstacles.
   */
  update(deltaTime, level) {
    // Adjust arrow speed based on level.
    if (level === 1) {
      this.speed = this.baseSpeed;
    } else if (level === 2) {
      this.speed = this.baseSpeed * 1.5;
    } else if (level === 3) {
      this.speed = this.baseSpeed * 2;
    }

    // Smoothly rotate arrow toward targetAngle.
    let angleDiff = this.targetAngle - this.angle;
    // Normalize to range -π...π.
    angleDiff = ((angleDiff + Math.PI) % (2 * Math.PI)) - Math.PI;
    const maxRotation = this.angularSpeed * deltaTime;
    if (Math.abs(angleDiff) <= maxRotation) {
      this.angle = this.targetAngle;
    } else {
      // Always rotate clockwise (i.e. subtract π/2 on tap).
      this.angle += Math.sign(angleDiff) * maxRotation;
    }

    // Move arrow in its current direction.
    const distance = this.speed * deltaTime;
    this.x += Math.cos(this.angle) * distance;
    this.y += Math.sin(this.angle) * distance;

    // Update lotus obstacles.
    this.lotusSpawnTimer += deltaTime;
    if (this.lotusSpawnTimer >= this.lotusSpawnInterval) {
      this.lotusSpawnTimer = 0;
      // Spawn a new lotus at the right edge.
      const paX = window.playAreaX || 100;
      const paY = window.playAreaY || 0;
      const paSize = window.playAreaSize || 600;
      // Spawn slightly off-screen to the right.
      const lotusX = paX + paSize + 30;
      const lotusY = paY + Math.random() * paSize;
      // You can randomize the size if desired.
      const lotusSize = 50;
      const newLotus = new Lotus(lotusX, lotusY, lotusSize);
      this.lotusObstacles.push(newLotus);
    }
    // Update each lotus.
    for (let i = this.lotusObstacles.length - 1; i >= 0; i--) {
      this.lotusObstacles[i].update(deltaTime, level);
      // Remove lotus if fully off the play area.
      if (this.lotusObstacles[i].checkBoundary(window.playAreaX, window.playAreaY, window.playAreaSize)) {
        this.lotusObstacles.splice(i, 1);
      }
    }
  }

  /**
   * draw(ctx)
   * Draws the arrow and its lotus obstacles, clipped to the play area.
   */
  draw(ctx) {
    // Retrieve play area globals.
    const paX = window.playAreaX !== undefined ? window.playAreaX : 100;
    const paY = window.playAreaY !== undefined ? window.playAreaY : 0;
    const paSize = window.playAreaSize !== undefined ? window.playAreaSize : 600;
    
    ctx.save();
    // Clip drawing to the play area.
    ctx.beginPath();
    ctx.rect(paX, paY, paSize, paSize);
    ctx.clip();

    // Draw arrow.
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = this.color;
    // Use an effective size multiplier (2.0) so the arrow appears larger.
    const effectiveSize = this.size * 2.0;
    // Define arrow geometry:
    // Tail at (0,0), tip at (effectiveSize, 0). Use a body length of 60% and head of 40%.
    const bodyLength = effectiveSize * 0.6;
    const headLength = effectiveSize - bodyLength;
    const arrowHeight = effectiveSize * 0.3; // Overall height.
    // Define vertices for a unified filled polygon.
    const localPoints = [
      { x: 0, y: -arrowHeight / 2 },
      { x: bodyLength, y: -arrowHeight / 2 },
      { x: bodyLength, y: -arrowHeight * 0.7 }, // Define a sharper head.
      { x: effectiveSize, y: 0 },
      { x: bodyLength, y: arrowHeight * 0.7 },
      { x: bodyLength, y: arrowHeight / 2 },
      { x: 0, y: arrowHeight / 2 }
    ];
    ctx.beginPath();
    ctx.moveTo(localPoints[0].x, localPoints[0].y);
    for (let i = 1; i < localPoints.length; i++) {
      ctx.lineTo(localPoints[i].x, localPoints[i].y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Draw lotus obstacles.
    for (let lotus of this.lotusObstacles) {
      lotus.draw(ctx);
    }
    
    ctx.restore();
  }

  /**
   * handleClick(x, y)
   * Rotates the arrow 90° clockwise smoothly.
   */
  handleClick(x, y) {
    // Clockwise rotation: subtract 90°.
    this.targetAngle = (this.targetAngle - Math.PI / 2 + 2 * Math.PI) % (2 * Math.PI);
    return true;
  }

  /**
   * getArrowPolygonPoints()
   * Computes the arrow's vertices (in world coordinates) for boundary checking.
   */
  getArrowPolygonPoints() {
    const effectiveSize = this.size * 2.0;
    const bodyLength = effectiveSize * 0.6;
    const headLength = effectiveSize - bodyLength;
    const arrowHeight = effectiveSize * 0.3;
    const localPoints = [
      { x: 0, y: -arrowHeight / 2 },
      { x: bodyLength, y: -arrowHeight / 2 },
      { x: bodyLength, y: -arrowHeight * 0.7 },
      { x: effectiveSize, y: 0 },
      { x: bodyLength, y: arrowHeight * 0.7 },
      { x: bodyLength, y: arrowHeight / 2 },
      { x: 0, y: arrowHeight / 2 }
    ];
    const cosA = Math.cos(this.angle);
    const sinA = Math.sin(this.angle);
    return localPoints.map(pt => ({
      x: this.x + pt.x * cosA - pt.y * sinA,
      y: this.y + pt.x * sinA + pt.y * cosA
    }));
  }

  /**
   * checkBoundary(playAreaX, playAreaY, playAreaSize)
   * Returns true if the entire arrow is outside the play area.
   */
  checkBoundary(playAreaX, playAreaY, playAreaSize) {
    const poly = this.getArrowPolygonPoints();
    const allLeft = poly.every(pt => pt.x < playAreaX);
    const allRight = poly.every(pt => pt.x > playAreaX + playAreaSize);
    const allAbove = poly.every(pt => pt.y < playAreaY);
    const allBelow = poly.every(pt => pt.y > playAreaY + playAreaSize);
    return allLeft || allRight || allAbove || allBelow;
  }

  /**
   * reset()
   * Resets the arrow and clears any lotus obstacles.
   */
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
