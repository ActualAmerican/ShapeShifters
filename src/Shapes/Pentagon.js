// src/shapes/Pentagon.js
export default class Pentagon {
    constructor(x, y, size) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.color = '#FFD700';  // Default color
    }
  
    draw(ctx) {
      const sides = 5;
      const angle = (2 * Math.PI) / sides;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const xOffset = this.x + this.size * Math.cos(i * angle);
        const yOffset = this.y + this.size * Math.sin(i * angle);
        i === 0 ? ctx.moveTo(xOffset, yOffset) : ctx.lineTo(xOffset, yOffset);
      }
      ctx.closePath();
      ctx.fill();
    }
  }
  