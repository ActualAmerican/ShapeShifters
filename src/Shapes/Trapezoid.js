// src/shapes/Trapezoid.js
export default class Trapezoid {
    constructor(x, y, size) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.color = '#FF4500';  // Default color
    }
  
    draw(ctx) {
      const width = this.size * 1.5;
      const height = this.size;
      const topWidth = width * 0.6;
  
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.moveTo(this.x - width / 2, this.y + height / 2);
      ctx.lineTo(this.x + width / 2, this.y + height / 2);
      ctx.lineTo(this.x + topWidth / 2, this.y - height / 2);
      ctx.lineTo(this.x - topWidth / 2, this.y - height / 2);
      ctx.closePath();
      ctx.fill();
    }
  }
  