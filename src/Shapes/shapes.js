// shapes.js
import { Square } from './Square.js';
import { Kite } from './Kite.js';
import { Arrow } from './Arrow.js';
// Import other shapes when ready:
// import { Pentagon } from './Pentagon.js';
// etc.

export const shapeRegistry = [
  {
    name: 'Square',
    active: false,  // Toggle this on/off for development
    classRef: Square
  },
  {
    name: 'Kite',
    active: false,  // Toggle this on/off for development
    classRef: Kite
  },
  {
    name: 'Arrow',
    active: true,  // Toggle this on/off for development
    classRef: Arrow
  },
];
