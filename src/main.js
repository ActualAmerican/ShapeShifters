const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

// List of shapes
const shapes = [
  { name: 'circle', color: '#0000FF' },
  { name: 'triangle', color: '#00F7C1' },
  { name: 'square', color: '#228B22' },
  { name: 'pentagon', color: '#2E8B57' },
  { name: 'octagon', color: '#800000' },
  { name: 'heart', color: '#FF0000' },
  { name: 'kite', color: '#191970' },
  { name: 'trapezoid', color: '#FF4500' },
  { name: 'arrow', color: '#FF91A4' },
  { name: 'crescentMoon', color: '#FFD700' },
];

let currentShapeIndex = 0;

// Drawing functions

function drawPolygon(x, y, sides, radius) {
  const angle = Math.PI * 2 / sides;
  const offsetAngle = Math.PI / 2;

  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const currentX = x + radius * Math.cos(angle * i + offsetAngle);
    const currentY = y + radius * Math.sin(angle * i + offsetAngle);
    ctx.lineTo(currentX, currentY);
  }
  ctx.closePath();
  ctx.fill();
}

function drawHeart(x, y, size) {
  ctx.beginPath();
  ctx.moveTo(x, y + size / 4);
  ctx.bezierCurveTo(x - size / 2, y - size / 2, x - size, y + size / 2, x, y + size);
  ctx.bezierCurveTo(x + size, y + size / 2, x + size / 2, y - size / 2, x, y + size / 4);
  ctx.closePath();
  ctx.fill();
}

function drawKite(x, y, size) {
  ctx.beginPath();
  ctx.moveTo(x, y + size * 1.25);
  ctx.lineTo(x + size * 0.85, y);
  ctx.lineTo(x, y - size * 0.85);
  ctx.lineTo(x - size * 0.85, y);
  ctx.closePath();
  ctx.fill();
}

function drawTrapezoid(x, y, size) {
  const width = size * 1.5;
  const height = size;
  const topWidth = width * 0.6;

  ctx.beginPath();
  ctx.moveTo(x - width / 2, y + height / 2);
  ctx.lineTo(x + width / 2, y + height / 2);
  ctx.lineTo(x + topWidth / 2, y - height / 2);
  ctx.lineTo(x - topWidth / 2, y - height / 2);
  ctx.closePath();
  ctx.fill();
}

function drawArrow(x, y, size) {
  const headWidth = size * 0.6;  // Width of the arrowhead
  const headHeight = size * 0.8; // Height of the arrowhead
  const bodyWidth = size * 0.35; // Width of the arrow body
  const bodyHeight = size * 1.5; // Extended arrow body length

  ctx.beginPath();

  // Draw the arrowhead
  ctx.moveTo(x, y - bodyHeight); // Top point of the arrowhead
  ctx.lineTo(x - headWidth / 2, y - bodyHeight + headHeight); // Left point of the arrowhead
  ctx.lineTo(x + headWidth / 2, y - bodyHeight + headHeight); // Right point of the arrowhead
  ctx.closePath();
  ctx.fill();

  // Draw the arrow body
  ctx.fillRect(x - bodyWidth / 2, y - bodyHeight + headHeight, bodyWidth, bodyHeight - headHeight);
}

// Function to draw crescent moon
function drawCrescentMoon(x, y, size) {
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2); // Outer arc
  ctx.fillStyle = '#FFD700'; // Crescent's color
  ctx.fill();
  
  ctx.globalCompositeOperation = 'destination-out'; // Subtract the inner part
  ctx.beginPath();
  ctx.arc(x + size * 0.4, y, size * 0.7, 0, Math.PI * 2); // Adjusted Inner cutout arc
  ctx.fill();

  ctx.globalCompositeOperation = 'source-over'; // Reset compositing mode
}


// Function to draw the current shape
function drawShape(shapeData) {
  const { name, color } = shapeData;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = color;

  const centerX = canvas.width / 2;
  let centerY = canvas.height / 2;

  if (name === 'heart') {
    centerY -= 40;
  }

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
      drawHeart(centerX, centerY, 100);
      break;
    case 'kite':
      drawKite(centerX, centerY, 70);
      break;
    case 'trapezoid':
      drawTrapezoid(centerX, centerY, 100);
      break;
    case 'arrow':
      drawArrow(centerX, centerY, 100);
      break;
    case 'crescentMoon':
      drawCrescentMoon(centerX, centerY, 70);
      break;
    default:
      console.error('Unknown shape:', name);
  }
}

function cycleShapes() {
  currentShapeIndex = (currentShapeIndex + 1) % shapes.length;
  drawShape(shapes[currentShapeIndex]);
}

setInterval(cycleShapes, 2000);
drawShape(shapes[currentShapeIndex]);