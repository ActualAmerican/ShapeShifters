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
let gameActive = false; // Flag to control game state
const levelDurations = [60, 120, 180]; // Durations in seconds for each level

// Create an instance of Square
const square = new Square(playAreaX + playAreaSize / 2, playAreaY + playAreaSize / 2, 50, '#228B22');

// Drawing functions

// Function to draw play area (only the square, removing the dot pattern)
function drawPlayArea() {
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 4;
  ctx.strokeRect(playAreaX, playAreaY, playAreaSize, playAreaSize);
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

// Function to draw the glow effect for the sequence with a smoother fade-in
function drawSequenceGlow(currentTime) {
  ctx.lineWidth = 2;
  for (let i = 0; i < square.sequence.length; i++) {
    let side = square.sequence[i];
    let x1, y1, x2, y2;
    
    switch(side) {
      case 0: // Top
        x1 = square.x - square.size / 2;
        y1 = square.y - square.size / 2;
        x2 = square.x + square.size / 2;
        y2 = square.y - square.size / 2;
        break;
      case 1: // Right
        x1 = square.x + square.size / 2;
        y1 = square.y - square.size / 2;
        x2 = square.x + square.size / 2;
        y2 = square.y + square.size / 2;
        break;
      case 2: // Bottom
        x1 = square.x - square.size / 2;
        y1 = square.y + square.size / 2;
        x2 = square.x + square.size / 2;
        y2 = square.y + square.size / 2;
        break;
      case 3: // Left
        x1 = square.x - square.size / 2;
        y1 = square.y - square.size / 2;
        x2 = square.x - square.size / 2;
        y2 = square.y + square.size / 2;
        break;
    }
    
    // Calculate fade-in effect
    let fadeProgress = (currentTime % square.pulseSpeed) / square.pulseSpeed;
    let alpha = Math.min(1, fadeProgress * 2); // Quick fade in, half the pulseSpeed to full opacity
    
    // Flash the correct side for a short duration
    if (Math.floor(currentTime / square.pulseSpeed) % square.sequence.length === i) {
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`; // Subtle white flash with fade
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }
}

// Function to start the game
function startGame() {
  gameActive = true;
  score = 0;
  currentLevel = 1;
  gameTime = 0;
  square.size = 50;
  square.x = playAreaX + playAreaSize / 2;
  square.y = playAreaY + playAreaSize / 2;
  square.isMoving = false;
  square.generateSequence();
  requestAnimationFrame(gameLoop);
}

// Function to handle game over
function endGame() {
  gameActive = false;
  console.log('Game Over! Final Score:', score);
  // Update personal best if necessary
  if (score > personalBest) {
    personalBest = score;
    localStorage.setItem('personalBest', personalBest);
  }
  // Here you might want to show a game over screen, etc.
}

// Game loop
let lastTime = 0;
function gameLoop(timestamp) {
  if (!gameActive) return; // Exit if game isn't active
  
  // Calculate elapsed time
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  if (gameTime === 0) gameTime = timestamp / 1000;

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the play area and score
  drawPlayArea();
  drawScore(); // Ensure this is called to update the scoreboard

  // Update square - increased growth rate for testing
  square.update(deltaTime, currentLevel);
  console.log('Square size:', square.size); // Log size to verify expansion

  // Draw the square
  square.draw(ctx);

  // Draw the sequence glow with current time
  drawSequenceGlow(timestamp);

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
  square.size -= 10; // Shrink on sequence completion
  square.resetSequence(currentLevel);
  score += 50; // Bonus for completing sequence
}

requestAnimationFrame(gameLoop);
}

// Event listener for player interaction
canvas.addEventListener('click', handleClick);

function handleClick(event) {
  if (!gameActive) return; // Don't handle clicks if the game isn't active
  
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  if (square.handleClick(x, y)) {
    score += 10; // Increase score on correct tap
  }
}

// Function to create and handle the start game button
function createStartButton() {
  const startButton = document.createElement('button');
  startButton.textContent = 'Start Game';
  startButton.style.position = 'absolute';
  startButton.style.top = '50%';
  startButton.style.left = '50%';
  startButton.style.transform = 'translate(-50%, -50%)';
  startButton.style.fontSize = '24px';
  startButton.style.padding = '10px 20px';
  startButton.style.zIndex = '11'; // Above everything else

  // Add click event listener to start the game
  startButton.addEventListener('click', () => {
    document.body.removeChild(startButton); // Remove the button once clicked
    startGame();
  });

  // Add the button to the document body
  document.body.appendChild(startButton);
}

// Example of how to start the game, now with a start button
document.addEventListener('DOMContentLoaded', () => {
  createStartButton();
});