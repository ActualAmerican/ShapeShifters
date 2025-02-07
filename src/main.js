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
const scoreIncreaseRate = 1; // Points per second

// Create an instance of Square
const square = new Square(playAreaX + playAreaSize / 2, playAreaY + playAreaSize / 2, 50, '#228B22');

// Drawing functions

function drawPlayArea() {
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 4;
  ctx.strokeRect(playAreaX, playAreaY, playAreaSize, playAreaSize);
}

function drawScore() {
  if (gameActive) {
    console.log('Drawing Score:', score); // Debug log to check if this function is being called
    console.log('Context:', ctx); // Check if ctx is defined
    if (ctx) {
      ctx.fillStyle = 'white';
      ctx.font = '20px Arial';
      ctx.textAlign = 'right';
      const rightEdge = playAreaX + playAreaSize;
      ctx.fillText(`Score: ${Math.floor(score)}`, rightEdge - 10, playAreaY - 30);
      ctx.fillText(`Best: ${personalBest}`, rightEdge - 10, playAreaY - 10);

      // Debug: Draw a test line to show where the score is supposed to be
      ctx.strokeStyle = 'red';
      ctx.beginPath();
      ctx.moveTo(rightEdge - 10, playAreaY - 30);
      ctx.lineTo(rightEdge - 10, playAreaY - 10);
      ctx.stroke();
    } else {
      console.error('Context is not available in drawScore');
    }
  }
}

// Function to start game
function startGame() {
  console.log('Game starting. Game Active:', gameActive);
  gameActive = true;
  console.log('Game Active set to:', gameActive);
  score = 0;
  currentLevel = 1;
  gameTime = 0;
  square.reset(); // Assuming reset method exists in Square.js
  createEndButton(); // Create the end game button

  // Debug: Draw a test rectangle
  ctx.fillStyle = 'red';
  ctx.fillRect(10, 10, 50, 50);

  requestAnimationFrame(gameLoop);
}

// Function to handle game over
function endGame() {
  console.log('Game ending. Game Active:', gameActive);
  gameActive = false;
  console.log('Game Active set to:', gameActive);
  console.log('Game Over! Final Score:', score);
  // Update personal best if necessary
  if (score > personalBest) {
    personalBest = score;
    localStorage.setItem('personalBest', personalBest);
  }
  // Remove the end game button
  const endButton = document.getElementById('endGameButton');
  if (endButton) document.body.removeChild(endButton);
  // Here you might want to show a game over screen, etc.
  createStartButton(); // Recreate the start button
}

// Game loop
let lastTime = 0;
function gameLoop(timestamp) {
  console.log('Game Loop running. Game Active:', gameActive);
  if (!gameActive) return; // Exit if game isn't active
  
  // Calculate elapsed time
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  if (gameTime === 0) gameTime = timestamp / 1000;

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the play area and score
  drawPlayArea();
  drawScore(); // This should now be called when gameActive is true

  // Increase score over time
  score += (scoreIncreaseRate * deltaTime / 1000); // Score increase per second
  console.log('Current Score:', score);

  // Update the current shape (square for now)
  square.update(deltaTime, currentLevel);
  
  // Draw the current shape
  square.draw(ctx);

  // Check if shape has reached boundary
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

  // Handle scoring based on shape mechanics in Square.js
  if (square.isSequenceCompleted()) {
    score += 50; // Bonus for completing sequence
    square.resetSequence(currentLevel); // Reset sequence for next round
    console.log('Sequence completed. Score updated:', score);
  }

  requestAnimationFrame(gameLoop);
}

// Event listener for player interaction
canvas.addEventListener('click', handleClick);

function handleClick(event) {
  console.log('Click event. Game Active:', gameActive);
  if (!gameActive) return; // Don't handle clicks if the game isn't active
  
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  if (square.handleClick(x, y)) {
    score += 10; // Increase score on correct tap
    console.log('Correct click. Score updated:', score);
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

// Function to create and handle the end game button
function createEndButton() {
  const endButton = document.createElement('button');
  endButton.id = 'endGameButton';
  endButton.textContent = 'End Game';
  endButton.style.position = 'absolute';
  endButton.style.top = '20px';
  endButton.style.right = '20px';
  endButton.style.fontSize = '16px';
  endButton.style.padding = '5px 10px';
  endButton.style.zIndex = '11'; // Above everything else

  // Add click event listener to end the game
  endButton.addEventListener('click', () => {
    endGame();
  });

  // Add the button to the document body
  document.body.appendChild(endButton);
}

// Example of how to start the game, now with a start button
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Loaded. Creating Start Button');
  createStartButton();
});