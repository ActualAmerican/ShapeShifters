const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

// List of shapes with a size factor for better scalability
const shapes = [
  { name: 'circle', color: '#0000FF', size: 60 },
  { name: 'triangle', color: '#00F7C1', size: 70 },
  { name: 'square', color: '#228B22', size: 60 },
  { name: 'pentagon', color: '#2E8B57', size: 70 },
  { name: 'octagon', color: '#800000', size: 60 },
  { name: 'heart', color: '#FF0000', size: 100 },
  { name: 'kite', color: '#191970', size: 70 },
  { name: 'trapezoid', color: '#FF4500', size: 100 },
  { name: 'arrow', color: '#FF91A4', size: 100 },
  { name: 'crescentMoon', color: '#FFD700', size: 70 },
];

let currentShapeIndex = 0;

// Drawing functions with size adjustments
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
  const headWidth = size * 0.6;
  const headHeight = size * 0.8;
  const bodyWidth = size * 0.35;
  const bodyHeight = size * 1.5;

  ctx.beginPath();
  ctx.moveTo(x, y - bodyHeight);
  ctx.lineTo(x - headWidth / 2, y - bodyHeight + headHeight);
  ctx.lineTo(x + headWidth / 2, y - bodyHeight + headHeight);
  ctx.closePath();
  ctx.fill();

  ctx.fillRect(x - bodyWidth / 2, y - bodyHeight + headHeight, bodyWidth, bodyHeight - headHeight);
}

function drawCrescentMoon(x, y, size) {
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fillStyle = '#FFD700';
  ctx.fill();
  
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(x + size * 0.4, y, size * 0.7, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalCompositeOperation = 'source-over';
}

// Function to draw the current shape, considering its size
function drawShape(shapeData) {
  const { name, color, size } = shapeData;

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
      ctx.arc(centerX, centerY, size, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'triangle':
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - size);
      ctx.lineTo(centerX - size, centerY + size);
      ctx.lineTo(centerX + size, centerY + size);
      ctx.closePath();
      ctx.fill();
      break;
    case 'square':
      ctx.fillRect(centerX - size, centerY - size, size * 2, size * 2);
      break;
    case 'pentagon':
      drawPolygon(centerX, centerY, 5, size);
      break;
    case 'octagon':
      drawPolygon(centerX, centerY, 8, size);
      break;
    case 'heart':
      drawHeart(centerX, centerY, size);
      break;
    case 'kite':
      drawKite(centerX, centerY, size);
      break;
    case 'trapezoid':
      drawTrapezoid(centerX, centerY, size);
      break;
    case 'arrow':
      drawArrow(centerX, centerY, size);
      break;
    case 'crescentMoon':
      drawCrescentMoon(centerX, centerY, size);
      break;
    default:
      console.error('Unknown shape:', name);
  }
}

// Cycle through shapes and render them
function cycleShapes() {
  currentShapeIndex = (currentShapeIndex + 1) % shapes.length;
  drawShape(shapes[currentShapeIndex]);
}

setInterval(cycleShapes, 2000);
drawShape(shapes[currentShapeIndex]);
