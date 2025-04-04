// ShapeManager.js
import { shapeRegistry } from './shapes/shapes.js';

class ShapeManager {
  constructor(x, y, size, color, name) {
    // Create an array of shape instances from enabled shapes.
    this.shapesInRotation = shapeRegistry
      .filter(shape => shape.active)
      .map(shape => new shape.classRef(x, y, size, color, name));
      
    // Store the current level internally.
    this.currentLevel = 1;
    // Generate a random rotation (a shuffled copy) for the current level.
    this.remainingShapes = this.generateRotation();
    // Pick the first shape from the rotation.
    this.currentShape = this.remainingShapes.pop();
  }

  // Fisher–Yates shuffle to generate a random order.
  generateRotation() {
    const array = [...this.shapesInRotation];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  update(deltaTime, currentLevel) {
    if (this.currentShape && typeof this.currentShape.update === 'function') {
      this.currentShape.update(deltaTime, currentLevel);
    }
  }

  draw(ctx) {
    if (this.currentShape && typeof this.currentShape.draw === 'function') {
      this.currentShape.draw(ctx);
    }
  }

  handleClick(x, y) {
    if (this.currentShape && typeof this.currentShape.handleClick === 'function') {
      return this.currentShape.handleClick(x, y);
    }
    return false;
  }

  checkBoundary(playAreaX, playAreaY, playAreaSize) {
    if (this.currentShape && typeof this.currentShape.checkBoundary === 'function') {
      return this.currentShape.checkBoundary(playAreaX, playAreaY, playAreaSize);
    }
    return false;
  }

  reset() {
    if (this.currentShape && typeof this.currentShape.reset === 'function') {
      this.currentShape.reset();
    }
  }

  isSequenceCompleted() {
    if (this.currentShape && typeof this.currentShape.isSequenceCompleted === 'function') {
      return this.currentShape.isSequenceCompleted();
    }
    return false;
  }

  /**
   * resetSequence(currentLevel)
   * - If the external currentLevel is higher than the stored level,
   *   regenerate the rotation for the new level.
   * - Otherwise, if there are shapes remaining in the current rotation,
   *   switch to the next shape.
   * - Then, call the new shape's resetSequence method.
   */
  resetSequence(currentLevel) {
    // If the level has advanced, update internal level and regenerate the rotation.
    if (currentLevel > this.currentLevel) {
      this.currentLevel = currentLevel;
      this.remainingShapes = this.generateRotation();
    }
    // If there are shapes left in the current rotation, use the next one.
    if (this.remainingShapes.length > 0) {
      this.currentShape = this.remainingShapes.pop();
      if (typeof this.currentShape.resetSequence === 'function') {
        this.currentShape.resetSequence(currentLevel);
      }
    }
    // Otherwise, if no shapes remain in the current level,
    // do nothing here—the main game logic should have already advanced the level,
    // causing this method to regenerate the rotation on the next call.
  }
}

export default ShapeManager;
