// src/shapes/CrescentMoon.js
export default class CrescentMoon {
    constructor(x, y, size) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.color = '#FFD700';  // Default color
    }
  
    draw(ctx) {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
  
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(this.x + this.size * 0.4, this.y, this.size * 0.7, 0, Math.PI * 2);
      ctx.fill();
  
      ctx.globalCompositeOperation = 'source-over';
    }
  }
  