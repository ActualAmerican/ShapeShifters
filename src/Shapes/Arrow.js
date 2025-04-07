// src/shapes/Arrow.js
export class Arrow {
  /**
   * Arrow constructor.
   * Parameters:
   *   x, y   - initial position (should be within the play area)
   *   size   - base size (e.g., 50)
   *   Extra parameters (color, name) are ignored.
   */
  constructor(x, y, size, color, name) {
    // Save the initial position for resetting.
    this.initialX = x;
    this.initialY = y;
    this.x = x;
    this.y = y;
    this.size = size;
    // Force salmon color.
    this.color = '#FF91A4';
    // Always name it "Arrow" for consistency.
    this.name = 'Arrow';

    // The arrow starts pointing to the right (0 radians).
    this.angle = 0;
    // Use targetAngle for smooth turning.
    this.targetAngle = 0;
    // Angular speed in radians per millisecond (increased for brisk turning).
    this.angularSpeed = 0.02;

    // Base speed (pixels per millisecond) for level 1.
    this.baseSpeed = 0.2;
    this.speed = this.baseSpeed;
  }

  /**
   * update(deltaTime, level)
   * Moves the arrow in its current direction and smoothly rotates it toward its target angle.
   * Speed scales with level:
   *   Level 1: base speed
   *   Level 2: 1.5× base speed
   *   Level 3: 2× base speed
   */
  update(deltaTime, level) {
    if (level === 1) {
      this.speed = this.baseSpeed;
    } else if (level === 2) {
      this.speed = this.baseSpeed * 1.5;
    } else if (level === 3) {
      this.speed = this.baseSpeed * 2;
    }
    // Compute difference between target and current angle.
    let angleDiff = this.targetAngle - this.angle;
    // Normalize angleDiff to the range -π ... π.
    angleDiff = ((angleDiff + Math.PI) % (2 * Math.PI)) - Math.PI;
    const maxRotation = this.angularSpeed * deltaTime;
    if (Math.abs(angleDiff) <= maxRotation) {
      this.angle = this.targetAngle;
    } else {
      // Always rotate clockwise, so use the sign of angleDiff;
      this.angle += Math.sign(angleDiff) * maxRotation;
    }
    // Update position.
    const distance = this.speed * deltaTime;
    this.x += Math.cos(this.angle) * distance;
    this.y += Math.sin(this.angle) * distance;
  }

  /**
   * draw(ctx)
   * Draws the arrow (clipped to the play area) using canvas transformations.
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
    
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = this.color;
    
    // Increase effective size so the arrow appears larger.
    const effectiveSize = this.size * 2.0;
    // Define arrow geometry:
    // Let the arrow be drawn from tail at (0,0) to tip at (effectiveSize, 0).
    // We'll define a body that is 60% of the length, and a head that is 40%.
    const bodyLength = effectiveSize * 0.6;
    // Arrow's overall height.
    const arrowHeight = effectiveSize * 0.3;
    // Head width (the vertical span of the head) is more pronounced.
    const headWidth = effectiveSize * 0.7;
    
    // Define vertices for a unified arrow shape:
    // 1. Tail top: (0, -arrowHeight/2)
    // 2. Body top: (bodyLength, -arrowHeight/2)
    // 3. Head top: (bodyLength, -headWidth/2)
    // 4. Tip: (effectiveSize, 0)
    // 5. Head bottom: (bodyLength, headWidth/2)
    // 6. Body bottom: (bodyLength, arrowHeight/2)
    // 7. Tail bottom: (0, arrowHeight/2)
    const localPoints = [
      { x: 0, y: -arrowHeight / 2 },
      { x: bodyLength, y: -arrowHeight / 2 },
      { x: bodyLength, y: -headWidth / 2 },
      { x: effectiveSize, y: 0 },
      { x: bodyLength, y: headWidth / 2 },
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
    ctx.restore();
  }

  /**
   * handleClick(x, y)
   * Rotates the arrow 90° clockwise smoothly.
   */
  handleClick(x, y) {
    // Always rotate clockwise by subtracting 90° (π/2 radians).
    this.targetAngle = (this.targetAngle - Math.PI / 2 + 2 * Math.PI) % (2 * Math.PI);
    return true;
  }

  /**
   * getArrowPolygonPoints()
   * Computes and returns the vertices of the arrow in world coordinates.
   */
  getArrowPolygonPoints() {
    const effectiveSize = this.size * 2.0;
    const bodyLength = effectiveSize * 0.6;
    const arrowHeight = effectiveSize * 0.3;
    const headWidth = effectiveSize * 0.7;
    const localPoints = [
      { x: 0, y: -arrowHeight / 2 },
      { x: bodyLength, y: -arrowHeight / 2 },
      { x: bodyLength, y: -headWidth / 2 },
      { x: effectiveSize, y: 0 },
      { x: bodyLength, y: headWidth / 2 },
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
   * Resets the arrow to its initial state.
   */
  reset() {
    this.x = this.initialX;
    this.y = this.initialY;
    this.angle = 0;
    this.targetAngle = 0;
    this.speed = this.baseSpeed;
  }
}
