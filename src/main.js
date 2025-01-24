// main.js

// Retrieve the canvas element and set up the context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = 800;
canvas.height = 600;

// Initialize the starfield animation
if (typeof initStarfield === 'function') {
  initStarfield(canvas); // Assuming `initStarfield` is the function from starfield.js
}

// Define the list of shapes and their properties
const shapes = [
  { name: 'circle', color: '#0000FF' }, // Blue
  { name: 'triangle', color: '#00F7C1' }, // Electric teal
  { name: 'square', color: '#228B22' }, // Light forest green
  { name: 'pentagon', color: '#2E8B57' }, // Sea foam green
  { name: 'octagon', color: '#800000' }, // Maroon
  { name: 'heart', color: '#FF0000' }, // Red
  { name: 'kite', color: '#191970' }, // Midnight blue/purple
  { name: 'trapezoid', color: '#FFA500' }, // Orange
  { name: 'crescentMoon', color: '#FFFF00' }, // Yellow
  { name: 'arrow', color: '#FF91A4' }, // Salmon pink
];

// Initialize the current shape index
let currentShapeIndex = 0;

// Function to draw the current shape centered on the canvas
function drawShape(shapeData) {
  const { name, color } = shapeData;

  // Clear the canvas (preserve starfield background)
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Set the fill color
  ctx.fillStyle = color;

  // Calculate the center of the canvas
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  // Draw the specified shape
  switch (name) {
    case 'circle':
      ctx.beginPath();
      ctx.arc(centerX, centerY, 60, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'triangle':
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - 80);
      ctx.lineTo(centerX - 70, centerY + 50);
      ctx.lineTo(centerX + 70, centerY + 50);
      ctx.closePath();
      ctx.fill();
      break;
    case 'square':
      ctx.fillRect(centerX - 60, centerY - 60, 120, 120);
      break;
    case 'pentagon':
      drawPolygon(centerX, centerY, 5, 70);
      break;
    case 'octagon':
      drawPolygon(centerX, centerY, 8, 60);
      break;
    case 'heart':
      drawHeart(centerX, centerY);
      break;
    case 'kite':
      drawKite(centerX, centerY);
      break;
    case 'trapezoid':
      drawTrapezoid(centerX, centerY);
      break;
    case 'crescentMoon':
      drawCrescentMoon(centerX, centerY);
      break;
    case 'arrow':
      drawArrow(centerX, centerY);
      break;
    default:
      console.error('Unknown shape:', name);
  }
}

// (Other drawing functions remain unchanged)

// Function to cycle to the next shape
function cycleShapes() {
  currentShapeIndex = (currentShapeIndex + 1) % shapes.length;
  drawShape(shapes[currentShapeIndex]);
}

// Set an interval to cycle shapes every 2 seconds
setInterval(cycleShapes, 2000);

// Draw the initial shape
drawShape(shapes[currentShapeIndex]);
