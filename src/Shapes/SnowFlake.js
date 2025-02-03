// src/shapes/Snowflake.js
export default class Snowflake {
    constructor(x, y, size) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.color = '#00F7F7';  // Default color
    }
  
    draw(ctx) {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      // Custom snowflake drawing logic here
      ctx.fill();
    }
  }
  