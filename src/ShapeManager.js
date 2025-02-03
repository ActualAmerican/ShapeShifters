import Circle from './shapes/Circle';
import Heart from './shapes/Heart';
import Triangle from './shapes/Triangle';
import Square from './shapes/Square';
import Kite from './shapes/Kite';
import Trapezoid from './shapes/Trapezoid';
import CrescentMoon from './shapes/CrescentMoon';
import Pentagon from './shapes/Pentagon';
import Octagon from './shapes/Octagon';
import Arrow from './shapes/Arrow';

class ShapeManager {
  constructor() {
    this.shapes = [
      new Circle(400, 300, 50), 
      new Heart(400, 300, 50), 
      new Triangle(400, 300, 50),
      new Square(400, 300, 50), 
      new Kite(400, 300, 50), 
      new Trapezoid(400, 300, 50),
      new CrescentMoon(400, 300, 50), 
      new Pentagon(400, 300, 50),
      new Octagon(400, 300, 50),
      new Arrow(400, 300, 50)
    ];
    this.currentShapeIndex = 0;
  }

  getCurrentShape() {
    return this.shapes[this.currentShapeIndex];
  }

  nextShape() {
    this.currentShapeIndex = (this.currentShapeIndex + 1) % this.shapes.length;
  }
}

export default ShapeManager;
