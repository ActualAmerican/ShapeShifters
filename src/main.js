// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Shape data structure
const shapes = [
  { name: "Circle", render: renderCircle, unlocked: true },
  { name: "Heart", render: renderHeart, unlocked: true },
  { name: "Triangle", render: renderTriangle, unlocked: true },
  { name: "Square", render: renderSquare, unlocked: true },
  { name: "Kite", render: renderKite, unlocked: true },
  { name: "Trapezoid", render: renderTrapezoid, unlocked: true },
  { name: "Crescent Moon", render: renderCrescentMoon, unlocked: true },
  { name: "Pentagon", render: renderPentagon, unlocked: true },
  { name: "Octagon", render: renderOctagon, unlocked: true },
  { name: "Arrow", render: renderArrow, unlocked: true },
  { name: "Snowflake", render: renderSnowflake, unlocked: false },
  { name: "Butterfly", render: renderButterfly, unlocked: false },
  { name: "Feather", render: renderFeather, unlocked: false },
  { name: "Hourglass", render: renderHourglass, unlocked: false },
  { name: "Angel", render: renderAngel, unlocked: false },
];

// Array to track shape indices
let defaultShapeIndices = shapes
  .map((shape, index) => (shape.unlocked ? index : null))
  .filter(index => index !== null);

let currentShapeIndex = 0; // Tracks the current shape

// Utility to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Shuffle the default shapes at the start
shuffleArray(defaultShapeIndices);

// Renders a Circle
function renderCircle(ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, 2 * Math.PI);
  ctx.fillStyle = "#00f7c1";
  ctx.fill();
}

// Renders a Triangle
function renderTriangle(ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, canvas.height / 2 - 50);
  ctx.lineTo(canvas.width / 2 - 50, canvas.height / 2 + 50);
  ctx.lineTo(canvas.width / 2 + 50, canvas.height / 2 + 50);
  ctx.closePath();
  ctx.fillStyle = "#00f7c1";
  ctx.fill();
}

// Placeholder render functions for other shapes
function renderHeart(ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Heart placeholder", canvas.width / 2 - 50, canvas.height / 2);
}

function renderSquare(ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Square placeholder", canvas.width / 2 - 50, canvas.height / 2);
}

function renderKite(ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Kite placeholder", canvas.width / 2 - 50, canvas.height / 2);
}

function renderTrapezoid(ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Trapezoid placeholder", canvas.width / 2 - 50, canvas.height / 2);
}

function renderCrescentMoon(ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Crescent Moon placeholder", canvas.width / 2 - 50, canvas.height / 2);
}

function renderPentagon(ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Pentagon placeholder", canvas.width / 2 - 50, canvas.height / 2);
}

function renderOctagon(ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Octagon placeholder", canvas.width / 2 - 50, canvas.height / 2);
}

function renderArrow(ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Arrow placeholder", canvas.width / 2 - 50, canvas.height / 2);
}

function renderSnowflake(ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Snowflake placeholder", canvas.width / 2 - 50, canvas.height / 2);
}

function renderButterfly(ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Butterfly placeholder", canvas.width / 2 - 50, canvas.height / 2);
}

function renderFeather(ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Feather placeholder", canvas.width / 2 - 50, canvas.height / 2);
}

function renderHourglass(ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Hourglass placeholder", canvas.width / 2 - 50, canvas.height / 2);
}

function renderAngel(ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Angel placeholder", canvas.width / 2 - 50, canvas.height / 2);
}

// Cycles through shapes
function cycleShapes() {
  if (currentShapeIndex >= defaultShapeIndices.length) {
    shuffleArray(defaultShapeIndices); // Reshuffle after all shapes are shown
    currentShapeIndex = 0;

    // Include unlocked shapes after the first full rotation
    defaultShapeIndices = shapes
      .map((shape, index) => (shape.unlocked ? index : null))
      .filter(index => index !== null);
  }

  const shapeIndex = defaultShapeIndices[currentShapeIndex];
  const shape = shapes[shapeIndex];
  shape.render(ctx); // Render the current shape
  currentShapeIndex++;
}

// Start cycling shapes
setInterval(cycleShapes, 2000); // Cycle every 2 seconds
