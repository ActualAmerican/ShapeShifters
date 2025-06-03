// shapes.js
import { Square } from './Square.js';
import { Kite } from './Kite.js';
import { Arrow } from './Arrow.js';
import { Circle } from './Circle.js';
import { Heart } from './Heart.js';

// Import other shapes when ready:
// import { Pentagon } from './Pentagon.js';
// etc.

export const shapeRegistry = [
  {
    name: 'Square',
    active: false, // Development Status: Complete
    classRef: Square
  },
  {
    name: 'Heart',
    active: true, // Development Status: In Progress 
    classRef: Heart
  },
  {
    name: 'Kite',
    active: false, // Development Status: Complete
    classRef: Kite
  },
  {
    name: 'Circle',
    active: false, // Development Status: Complete
    classRef: Circle
  },
  {
    name: 'Arrow',
    active: false, // Development Status: In Progress
    classRef: Arrow
  }
];
