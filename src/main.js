// main.js
import { Square } from './shapes/Shape.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

// Define the play area dimensions
const playAreaSize = 600;
const playAreaX = (canvas.width - playAreaSize) / 2;
const playAreaY = (canvas.height - playAreaSize) / 2;

// Define game variables
let score = 0;
let personalBest = localStorage.getItem('personalBest') || 0;
let currentLevel = 1; // Start with level 1
let gameTime = 0; // Time in seconds
const levelDurations = [60, 120, 180]; // Durations in seconds for each level

// Create an instance of Square
const square = new Square(playAreaX + playAreaSize / 2, playAreaY + playAreaSize / 2, 50, '#228B22');
square.generateSequence();

// Drawing functions

// Function to draw play area (only the square, removing the dot pattern)
function drawPlayArea() {
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 4;
  ctx.strokeRect(playAreaX, playAreaY, playAreaSize, playAreaSize);
  // Removed the dot pattern code
}

// Function to draw score and personal best
function drawScore() {
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.textAlign = 'right';
  const rightEdge = playAreaX + playAreaSize;
  ctx.fillText(`Score: ${score}`, rightEdge - 10, playAreaY - 30);
  ctx.fillText(`Best: ${personalBest}`, rightEdge - 10, playAreaY - 10);
}

// Game loop
let lastTime = 0;
function gameLoop(timestamp) {
  // Calculate elapsed time
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  if (gameTime === 0) gameTime = timestamp / 1000;

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the play area and score
  drawPlayArea();
  drawScore();

  // Update square
  square.update(deltaTime, currentLevel);

  // Draw the square
  square.draw(ctx);

  // Check if square has reached boundary
  if (square.checkBoundary(playAreaX, playAreaY, playAreaSize)) {
    endGame();
    return;
  }

  // Check if it's time to move to the next level or end the game
  if ((timestamp / 1000 - gameTime) >= levelDurations[currentLevel - 1]) {
    if (currentLevel < 3) {
      currentLevel++;
      gameTime = timestamp / 1000; // Reset game time for the next level
    } else {
      endGame();
      return;
    }
  }

  // Check if sequence is completed
  if (square.isSequenceCompleted()) {
    square.resetSequence(currentLevel);
    score += 50; // Bonus for completing sequence
  }

  requestAnimationFrame(gameLoop);
}

// Start the game loop
requestAnimationFrame(gameLoop);

// Function to handle game over
function endGame() {
  console.log('Game Over! Final Score:', score);
  // Here you might want to update personal best, show a game over screen, etc.
}

// Event listener for player interaction
canvas.addEventListener('click', handleClick);

function handleClick(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top; // Corrected 'top' to 'rect.top'

  if (square.handleClick(x, y)) {
    score += 10; // Increase score on correct tap
  }
}