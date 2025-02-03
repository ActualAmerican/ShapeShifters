// src/shapes/Heart.js
export default class Heart {
    constructor(x, y, size) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.color = '#FF0000';  // Default color
    }
  
    draw(ctx) {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y + this.size / 4);
      ctx.bezierCurveTo(this.x - this.size / 2, this.y - this.size / 2, this.x - this.size, this.y + this.size / 2, this.x, this.y + this.size);
      ctx.bezierCurveTo(this.x + this.size, this.y + this.size / 2, this.x + this.size / 2, this.y - this.size / 2, this.x, this.y + this.size / 4);
      ctx.closePath();
      ctx.fill();
    }
  }
  