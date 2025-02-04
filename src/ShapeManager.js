import Square from './shapes/Square.js';

class ShapeManager {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.startSquare(); // Call the startSquare function with canvas and ctx
  }

  startSquare() {
    Square.startSquare(this.canvas, this.ctx); // Pass canvas and ctx
  }
}

export default ShapeManager;
