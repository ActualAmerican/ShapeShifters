// src/shapes/Triangle.js
export default class Triangle {
    constructor(x, y, size) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.color = '#00F7C1';  // Default color
    }
  
    draw(ctx) {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y - this.size);
      ctx.lineTo(this.x - this.size, this.y + this.size);
      ctx.lineTo(this.x + this.size, this.y + this.size);
      ctx.closePath();
      ctx.fill();
    }
  }
  