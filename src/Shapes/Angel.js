// src/shapes/Angel.js
export default class Angel {
    constructor(x, y, size) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.color = '#FFFFFF';  // Default color
    }
  
    draw(ctx) {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      // Custom angel drawing logic here
      ctx.fill();
    }
  }
  