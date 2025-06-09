// shapes.js
import { Square }    from './Square.js';
import { Kite }      from './Kite.js';
import { Arrow }     from './Arrow.js';
import { Circle }    from './Circle.js';
import { Heart }     from './Heart.js';
import { Pentagon }  from './Pentagon.js';  

export const shapeRegistry = [
  {
    name: 'Square',
    active: false,
    classRef: Square
  },
  {
    name: 'Heart',
    active: false,
    classRef: Heart
  },
  {
    name: 'Kite',
    active: false,
    classRef: Kite
  },
  {
    name: 'Circle',
    active: false,
    classRef: Circle
  },
  {
    name: 'Pentagon',
    active: true,
    classRef: Pentagon
  },
  {
    name: 'Arrow',
    active: false,
    classRef: Arrow
  }
];
