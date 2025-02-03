// src/shapes/Feather.js
export default class Feather {
    constructor(x, y, size) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.color = '#A9A9A9';  // Default color
    }
  
    draw(ctx) {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      // Custom feather drawing logic here
      ctx.fill();
    }
  }
  