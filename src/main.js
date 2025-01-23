 // main.js

// Retrieve the canvas element and set up the context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = 800;
canvas.height = 600;

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

  // Clear the canvas
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

// Function to draw a regular polygon
function drawPolygon(x, y, sides, radius) {
  const angle = (2 * Math.PI) / sides;
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const dx = x + radius * Math.cos(i * angle - Math.PI / 2);
    const dy = y + radius * Math.sin(i * angle - Math.PI / 2);
    if (i === 0) {
      ctx.moveTo(dx, dy);
    } else {
      ctx.lineTo(dx, dy);
    }
  }
  ctx.closePath();
  ctx.fill();
}

// Function to draw a heart shape
function drawHeart(x, y) {
  ctx.beginPath();
  ctx.moveTo(x, y + 40);
  ctx.bezierCurveTo(x + 120, y, x + 55, y - 110, x, y - 50);
  ctx.bezierCurveTo(x - 55, y - 110, x - 120, y, x, y + 40);
  ctx.closePath();
  ctx.fill();
}

// Function to draw a crescent moon shape (adjusted for more open crescent)
function drawCrescentMoon(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, 60, 0, Math.PI * 2, false); // Outer arc
  ctx.fillStyle = '#FFFF00';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 20, y, 45, 0, Math.PI * 2, true); // Inner arc moved outward to keep crescent open
  ctx.fillStyle = '#ffffff'; // Match background for crescent effect
  ctx.fill();
}

// Function to draw a kite shape (adjusted middle points)
function drawKite(x, y) {
  ctx.beginPath();
  ctx.moveTo(x, y - 90); // Top point
  ctx.lineTo(x - 50, y - 20); // Adjusted left middle point closer to top
  ctx.lineTo(x, y + 110); // Bottom point
  ctx.lineTo(x + 50, y - 20); // Adjusted right middle point closer to top
  ctx.closePath();
  ctx.fill();
}

// Function to draw a trapezoid shape
function drawTrapezoid(x, y) {
  ctx.beginPath();
  ctx.moveTo(x - 80, y + 50);
  ctx.lineTo(x - 60, y - 50);
  ctx.lineTo(x + 60, y - 50);
  ctx.lineTo(x + 80, y + 50);
  ctx.closePath();
  ctx.fill();
}

// Function to draw an arrow shape
function drawArrow(x, y) {
  ctx.beginPath();
  ctx.moveTo(x, y - 100);
  ctx.lineTo(x - 40, y - 40);
  ctx.lineTo(x - 20, y - 40);
  ctx.lineTo(x - 20, y + 40);
  ctx.lineTo(x + 20, y + 40);
  ctx.lineTo(x + 20, y - 40);
  ctx.lineTo(x + 40, y - 40);
  ctx.closePath();
  ctx.fill();
}

// Function to cycle to the next shape
function cycleShapes() {
  currentShapeIndex = (currentShapeIndex + 1) % shapes.length;
  drawShape(shapes[currentShapeIndex]);
}

// Set an interval to cycle shapes every 2 seconds
setInterval(cycleShapes, 2000);

// Draw the initial shape
drawShape(shapes[currentShapeIndex]);