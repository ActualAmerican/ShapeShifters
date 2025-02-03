// src/shapes/Hourglass.js
export default class Hourglass {
    constructor(x, y, size) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.color = '#FFD700';  // Default color
    }
  
    draw(ctx) {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      // Custom hourglass drawing logic here
      ctx.fill();
    }
  }
  