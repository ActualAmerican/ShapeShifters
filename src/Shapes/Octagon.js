// src/shapes/Octagon.js
export default class Octagon {
    constructor(x, y, size) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.color = '#FF6347';  // Default color
    }
  
    draw(ctx) {
      const sides = 8;
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
  