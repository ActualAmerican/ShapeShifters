// src/shapes/Square.js
export default class Square {
    constructor(x, y, size) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.color = '#228B22';  // Default color
    }
  
    draw(ctx) {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
    }
  }
  