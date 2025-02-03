// src/shapes/Kite.js
export default class Kite {
    constructor(x, y, size) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.color = '#191970';  // Default color
    }
  
    draw(ctx) {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y + this.size * 1.25);
      ctx.lineTo(this.x + this.size * 0.85, this.y);
      ctx.lineTo(this.x, this.y - this.size * 0.85);
      ctx.lineTo(this.x - this.size * 0.85, this.y);
      ctx.closePath();
      ctx.fill();
    }
  }
  