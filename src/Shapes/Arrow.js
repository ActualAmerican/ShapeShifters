// src/shapes/Arrow.js
export class Arrow {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = '#FF91A4';  // Default color for the Arrow
    this.angle = 0;         // Arrow initially points to the right (0 radians)
    
    // Base speed (in pixels per millisecond) for level 1.
    this.baseSpeed = 0.1;
    this.speed = this.baseSpeed;
  }

  /**
   * Update the arrow's position and speed based on deltaTime and current level.
   * Level 1: Base speed.
   * Level 2: 1.5× base speed.
   * Level 3: 2× base speed.
   */
  update(deltaTime, level) {
    // Adjust speed based on level.
    if (level === 1) {
      this.speed = this.baseSpeed;
    } else if (level === 2) {
      this.speed = this.baseSpeed * 1.5;
    } else if (level === 3) {
      this.speed = this.baseSpeed * 2.0;
    }

    // Calculate displacement.
    const distance = this.speed * deltaTime;
    this.x += Math.cos(this.angle) * distance;
    this.y += Math.sin(this.angle) * distance;
  }

  /**
   * Draw the arrow.
   * The arrow is drawn pointing to the right by default and then rotated according to its current angle.
   */
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = this.color;

    // Define dimensions for arrow head and body.
    const headWidth = this.size * 0.6;
    const headHeight = this.size * 0.8;
    const bodyWidth = this.size * 0.35;
    const bodyLength = this.size * 1.5;

    // Draw arrow head (triangle).
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-headWidth, headHeight / 2);
    ctx.lineTo(-headWidth, -headHeight / 2);
    ctx.closePath();
    ctx.fill();

    // Draw arrow body (rectangle).
    ctx.fillRect(-headWidth, -bodyWidth / 2, bodyLength, bodyWidth);

    ctx.restore();
  }

  /**
   * When the arrow is tapped, rotate it 90° (π/2 radians).
   * This function is triggered by the game’s input handler.
   */
  handleClick(x, y) {
    this.angle += Math.PI / 2;
    // Normalize the angle to keep it within 0 to 2π.
    this.angle %= 2 * Math.PI;
    return true;
  }

  /**
   * Reset the arrow to its initial state.
   */
  reset() {
    // Reset position and angle if needed.
    // (If your game resets Arrow differently, adjust as necessary.)
    this.x = this.initialX;
    this.y = this.initialY;
    this.angle = 0;
    this.speed = this.baseSpeed;
  }
}
