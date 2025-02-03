// src/shapes/Butterfly.js
export default class Butterfly {
    constructor(x, y, size) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.color = '#8A2BE2';  // Default color
    }
  
    draw(ctx) {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      // Custom butterfly drawing logic here
      ctx.fill();
    }
  }
  