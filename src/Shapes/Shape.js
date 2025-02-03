// src/shapes/Shape.js
export default class Shape {
    constructor(x, y, size) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.velocity = 0;
    }
  
    update() {
      // Common update logic (e.g., position updates)
    }
  
    draw(context) {
      // Common drawing logic (e.g., draw basic shape)
    }
  }
  