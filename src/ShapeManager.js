import shapeList from './shapes.js';

class ShapeManager {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.shapeClasses = shapeList;  // Use the exported list.
    this.currentIndex = 0;
    this.shape = this.instantiateShape(this.shapeClasses[this.currentIndex]);
  }

  instantiateShape(ShapeClass) {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const defaultSize = 50;
    // Assume each shape’s constructor accepts (x, y, size, color, name).
    // For shapes with different constructors (like Kite), adjust accordingly.
    if (ShapeClass.name === 'Kite') {
      // Use the original Kite design.
      return new ShapeClass(centerX, centerY, defaultSize);
    } else {
      return new ShapeClass(centerX, centerY, defaultSize, '#228B22', ShapeClass.name);
    }
  }

  // Call this method to cycle to the next shape.
  nextShape() {
    this.currentIndex = (this.currentIndex + 1) % this.shapeClasses.length;
    this.shape = this.instantiateShape(this.shapeClasses[this.currentIndex]);
  }

  update(deltaTime, level) {
    if (this.shape && this.shape.update) {
      this.shape.update(deltaTime, level);
    }
  }

  draw() {
    if (this.shape && this.shape.draw) {
      this.shape.draw(this.ctx);
    }
  }

  handleClick(x, y) {
    if (this.shape && this.shape.handleClick) {
      return this.shape.handleClick(x, y);
    }
    return false;
  }

  checkBoundary(playAreaX, playAreaY, playAreaSize) {
    if (this.shape && this.shape.checkBoundary) {
      return this.shape.checkBoundary(playAreaX, playAreaY, playAreaSize);
    }
    return false;
  }

  reset() {
    if (this.shape && this.shape.reset) {
      this.shape.reset();
    }
  }
}

export default ShapeManager;
