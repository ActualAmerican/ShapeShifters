// src/shapes/Arrow.js
export default class Arrow {
    constructor(x, y, size) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.color = '#FF91A4';  // Default color
    }
  
    draw(ctx) {
      const headWidth = this.size * 0.6;
      const headHeight = this.size * 0.8;
      const bodyWidth = this.size * 0.35;
      const bodyHeight = this.size * 1.5;
  
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y - bodyHeight);
      ctx.lineTo(this.x - headWidth / 2, this.y - bodyHeight + headHeight);
      ctx.lineTo(this.x + headWidth / 2, this.y - bodyHeight + headHeight);
      ctx.closePath();
      ctx.fill();
  
      ctx.fillRect(this.x - bodyWidth / 2, this.y - bodyHeight + headHeight, bodyWidth, bodyHeight - headHeight);
    }
  }
  