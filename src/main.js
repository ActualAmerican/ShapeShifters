import { Square } from './shapes/shapes.js';

// Game canvas setup
const gameCanvas = document.getElementById('gameCanvas');
const gameCtx = gameCanvas.getContext('2d');
gameCanvas.width = 800;
gameCanvas.height = 600;

// Scoreboard canvas setup
const scoreboardCanvas = document.createElement('canvas');
scoreboardCanvas.id = 'scoreboardCanvas';
scoreboardCanvas.width = 300; // Adjusted for better visibility
scoreboardCanvas.height = 50;
document.body.appendChild(scoreboardCanvas);
const scoreboardCtx = scoreboardCanvas.getContext('2d');

// Styling the scoreboard canvas (now in CSS)

// Define the play area dimensions
const playAreaSize = 600;
const playAreaX = (gameCanvas.width - playAreaSize) / 2;
const playAreaY = (gameCanvas.height - playAreaSize) / 2;

// Define game variables
let score = 0;
let personalBest = localStorage.getItem('personalBest') || 0;
let currentLevel = 1; // Start with level 1
let gameTime = 0; // Time in seconds
let gameActive = false; // Flag to control game state
const levelDurations = [60, 120, 180]; // Durations in seconds for each level
const scoreIncreaseRate = 1; // Points per second

// Create an instance of Square
const square = new Square(playAreaX + playAreaSize / 2, playAreaY + playAreaSize / 2, 50, '#228B22', 'Square');

// Drawing functions

function drawPlayArea() {
  gameCtx.strokeStyle = 'white';
  gameCtx.lineWidth = 4;
  gameCtx.strokeRect(playAreaX, playAreaY, playAreaSize, playAreaSize);
}

function drawScore() {
  if (gameActive) {
    scoreboardCtx.clearRect(0, 0, scoreboardCanvas.width, scoreboardCanvas.height);
    
    // Score text with 2 decimal points
    scoreboardCtx.font = '24px Arial'; 
    scoreboardCtx.fillStyle = 'white';
    scoreboardCtx.textAlign = 'right'; 
    scoreboardCtx.fillText(`Score: ${score.toFixed(2)}`, scoreboardCanvas.width - 10, 30);
    
    // Personal Best text with lower opacity and 2 decimal points
    scoreboardCtx.font = '16px Arial'; 
    scoreboardCtx.fillStyle = 'rgba(255, 255, 255, 0.7)'; 
    scoreboardCtx.fillText(`Best: ${parseFloat(personalBest).toFixed(2)}`, scoreboardCanvas.width - 10, 50);
  }
}

function drawDebugInfo() {
  gameCtx.fillStyle = 'white';
  gameCtx.font = '16px Arial';
  gameCtx.fillText(`Shape: ${square.name}, Level: ${currentLevel}`, gameCanvas.width - 150, 50); // Position below the End Game button
}

// Function to start game
function startGame() {
  gameActive = true;
  score = 0; // Reset score
  console.log('Score reset to:', score); // Debug log to confirm reset
  currentLevel = 1;
  gameTime = 0;
  square.reset(); // Assuming reset method exists in Square.js
  createEndButton(); // Create the end game button

  // Make sure the scoreboard is visible
  scoreboardCanvas.style.display = 'block';

  // Force an immediate update of the score display
  drawScore();

  // Debug: Draw a test rectangle
  gameCtx.fillStyle = 'red';
  gameCtx.fillRect(10, 10, 50, 50);

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
  // Remove the end game button
  const endButton = document.getElementById('endGameButton');
  if (endButton) document.body.removeChild(endButton);
  
  // Hide the scoreboard
  scoreboardCanvas.style.display = 'none';

  // Create and show the game over popup
  createGameOverPopup();
}

// New function to create the game over popup
function createGameOverPopup() {
  // Create the popup container
  const popup = document.createElement('div');
  popup.id = 'gameOverPopup';
  popup.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.8);
    border-radius: 10px;
    padding: 20px;
    text-align: center;
    z-index: 12;
  `;

  // Add the score display
  const scoreDisplay = document.createElement('p');
  scoreDisplay.textContent = `Your Score: ${score.toFixed(2)}`;
  scoreDisplay.style.color = 'white';
  scoreDisplay.style.fontSize = '24px';
  popup.appendChild(scoreDisplay);

  // Restart and Share buttons
  const buttonContainer = document.createElement('div');
  buttonContainer.style.cssText = 'display: flex; justify-content: center; gap: 10px;'; // Flex layout for side-by-side buttons

  const restartButton = document.createElement('button');
  restartButton.textContent = 'Restart Game';
  restartButton.style.cssText = 'font-size: 16px; padding: 10px;';
  restartButton.addEventListener('click', () => {
    document.body.removeChild(popup);
    startGame();
  });
  buttonContainer.appendChild(restartButton);

  const shareButton = document.createElement('button');
  shareButton.textContent = 'Share Score';
  shareButton.style.cssText = 'font-size: 16px; padding: 10px;';
  shareButton.addEventListener('click', () => {
    navigator.clipboard.writeText(`My score in ShapeShifters: ${score.toFixed(2)}`).then(() => {
      alert('Score copied to clipboard!');
    }, () => {
      alert('Failed to copy score to clipboard');
    });
  });
  buttonContainer.appendChild(shareButton);

  popup.appendChild(buttonContainer);

  // Ad button below
  const continueWithAdButton = document.createElement('button');
  continueWithAdButton.textContent = 'Watch Ad to Continue';
  continueWithAdButton.style.cssText = 'font-size: 16px; padding: 10px; margin-top: 10px; display: block; width: 100%;';
  continueWithAdButton.disabled = true;
  continueWithAdButton.addEventListener('click', () => {
    console.log('Watch ad functionality not yet implemented');
  });
  popup.appendChild(continueWithAdButton);

  // Add the popup to the document
  document.body.appendChild(popup);
}

// Game loop
let lastTime = 0;
function gameLoop(timestamp) {
  if (!gameActive) return; // Exit if game isn't active
  
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  if (gameTime === 0) gameTime = timestamp / 1000;

  // Clear the game canvas
  gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

  // Draw the play area, score, and debug info
  drawPlayArea();
  drawScore();
  drawDebugInfo(); 

  // Increase score over time
  score += (scoreIncreaseRate * deltaTime / 1000);

  // Update the current shape (square for now)
  square.update(deltaTime, currentLevel);
  
  // Draw the current shape
  square.draw(gameCtx);

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
  }

  requestAnimationFrame(gameLoop);
}

// Event listener for player interaction
gameCanvas.addEventListener('click', handleClick);

function handleClick(event) {
  if (!gameActive) return; // Don't handle clicks if the game isn't active
  
  const rect = gameCanvas.getBoundingClientRect();
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
  startButton.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 24px; padding: 10px 20px; z-index: 11;';
  startButton.addEventListener('click', () => {
    document.body.removeChild(startButton);
    startGame();
  });
  document.body.appendChild(startButton);
}

// Function to create and handle the end game button
function createEndButton() {
  const endButton = document.createElement('button');
  endButton.id = 'endGameButton';
  endButton.textContent = 'End Game';
  endButton.style.cssText = 'position: absolute; top: 20px; right: 20px; font-size: 16px; padding: 5px 10px; z-index: 11;';
  endButton.addEventListener('click', endGame);
  document.body.appendChild(endButton);
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Hide the scoreboard initially
  scoreboardCanvas.style.display = 'none';
  createStartButton();
  // The starfield.js script will handle its own animation loop, so we don't need to start it here.
});