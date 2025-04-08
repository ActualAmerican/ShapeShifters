// src/props/Lotus.js
export class Lotus {
  /**
   * Constructor for Lotus prop.
   * Parameters:
   *   x, y  - initial position (for a flowing effect, spawn off‐screen on the right)
   *   size  - base size (e.g., 50)
   */
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    // For collision/visibility removal, approximate the lotus as a circle.
    this.collisionRadius = size * 0.5;
    
    // Colors – adjust these as needed.
    this.centerColor = "#FFD1DC"; // Light pink for the center.
    this.petalColor = "#FFB6C1";  // A salmon/pink for the petals.
    
    // Drift speed (in pixels per ms). The lotus moves leftward.
    this.baseSpeed = 0.05;
    this.speed = this.baseSpeed;
    // Slight vertical drift for variation.
    this.verticalDrift = (Math.random() - 0.5) * 0.03;
    
    // Rotation for visual interest.
    this.angle = 0;
    this.angularSpeed = 0.001 + Math.random() * 0.001;
  }

  /**
   * update(deltaTime, level)
   * Moves the lotus leftward (with slight vertical drift) and rotates it slowly.
   * Speed increases with level if desired.
   */
  update(deltaTime, level) {
    // Optionally adjust speed by level.
    if (level === 1) {
      this.speed = this.baseSpeed;
    } else if (level === 2) {
      this.speed = this.baseSpeed * 1.5;
    } else if (level === 3) {
      this.speed = this.baseSpeed * 2;
    }
    // Drift leftwards.
    this.x -= this.speed * deltaTime;
    // Apply vertical drift.
    this.y += this.verticalDrift * deltaTime;
    // Slowly rotate.
    this.angle += this.angularSpeed * deltaTime;
  }

  /**
   * draw(ctx)
   * Draws the lotus within the play area. The lotus is composed of a central circle and six petals.
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
    
    // Translate and rotate the lotus.
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // Draw the center.
    const centerRadius = this.size * 0.2;
    ctx.fillStyle = this.centerColor;
    ctx.beginPath();
    ctx.arc(0, 0, centerRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw 6 petals arranged around the center.
    const numPetals = 6;
    for (let i = 0; i < numPetals; i++) {
      const petalAngle = (i / numPetals) * Math.PI * 2;
      ctx.save();
      ctx.rotate(petalAngle);
      ctx.fillStyle = this.petalColor;
      ctx.beginPath();
      // Draw each petal as an ellipse.
      ctx.ellipse(this.size * 0.3, 0, this.size * 0.2, this.size * 0.1, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
    ctx.restore();
  }

  /**
   * checkBoundary(playAreaX, playAreaY, playAreaSize)
   * Returns true if the lotus is completely outside the play area.
   */
  checkBoundary(playAreaX, playAreaY, playAreaSize) {
    return (
      this.x + this.collisionRadius < playAreaX ||
      this.x - this.collisionRadius > playAreaX + playAreaSize ||
      this.y + this.collisionRadius < playAreaY ||
      this.y - this.collisionRadius > playAreaY + playAreaSize
    );
  }

  /**
   * reset()
   * Optionally reset the lotus (for object pooling).
   */
  reset() {
    // Implement if you wish to reuse lotus objects.
  }
}
