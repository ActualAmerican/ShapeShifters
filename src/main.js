import { Square } from './shapes/shapes.js';

// Game canvas setup
const gameCanvas = document.getElementById('gameCanvas');
const gameCtx = gameCanvas.getContext('2d');
gameCanvas.width = 800;
gameCanvas.height = 600;

// Scoreboard canvas setup
const scoreboardCanvas = document.createElement('canvas');
scoreboardCanvas.id = 'scoreboardCanvas';
scoreboardCanvas.width = 300;
scoreboardCanvas.height = 50;
scoreboardCanvas.style.position = 'absolute';
scoreboardCanvas.style.zIndex = '10';
document.body.appendChild(scoreboardCanvas);
const scoreboardCtx = scoreboardCanvas.getContext('2d');

// Function to update scoreboard position dynamically
function updateScoreboardPosition() {
  const canvasRect = gameCanvas.getBoundingClientRect();
  scoreboardCanvas.style.left = (canvasRect.left + 560) + 'px'; // Align right edge with play area's right edge
  scoreboardCanvas.style.top = (canvasRect.top - 60) + 'px'; // Position just above the canvas
}

// Initial positioning
updateScoreboardPosition();

// Update position on window resize
window.addEventListener('resize', updateScoreboardPosition);

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
let lastTime = 0; // For deltaTime calculation
let animationFrameId = null; // To manage animation frame
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
  scoreboardCtx.clearRect(0, 0, scoreboardCanvas.width, scoreboardCanvas.height);
  if (gameActive) {
    scoreboardCtx.font = '24px Arial';
    scoreboardCtx.fillStyle = 'white';
    scoreboardCtx.textAlign = 'right';
    scoreboardCtx.fillText(`Score: ${score.toFixed(2)}`, scoreboardCanvas.width - 10, 30);
    scoreboardCtx.font = '16px Arial';
    scoreboardCtx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    scoreboardCtx.fillText(`Best: ${parseFloat(personalBest).toFixed(2)}`, scoreboardCanvas.width - 10, 50);
  }
}

function drawDebugInfo() {
  if (gameActive) {
    gameCtx.fillStyle = 'white';
    gameCtx.font = '16px Arial';
    gameCtx.textAlign = 'center';
    gameCtx.fillText(`Shape: ${square.name}, Level: ${currentLevel}`, gameCanvas.width / 2, 570);
  }
}

// Function to start game
function startGame() {
  // Cancel any existing animation frame to prevent overlap
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  gameActive = true;
  score = 0; // Reset score
  console.log('Score reset to:', score); // Debug log
  currentLevel = 1;
  gameTime = 0;
  lastTime = 0; // Reset lastTime for accurate deltaTime
  square.reset();
  createEndButton();

  scoreboardCanvas.style.display = 'block';
  drawScore(); // Immediate score update

  // Start the game loop
  animationFrameId = requestAnimationFrame(gameLoop);
}

// Function to handle game over
function endGame() {
  gameActive = false;

  // Cancel the animation frame to stop the game loop
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  console.log('Game Over! Final Score:', score);
  if (score > personalBest) {
    personalBest = score;
    localStorage.setItem('personalBest', personalBest);
  }
  
  const endButton = document.getElementById('endGameButton');
  if (endButton) document.body.removeChild(endButton);
  
  scoreboardCanvas.style.display = 'none';
  createGameOverPopup();
}

// New function to create the game over popup
function createGameOverPopup() {
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

  const scoreDisplay = document.createElement('p');
  scoreDisplay.textContent = `Your Score: ${score.toFixed(2)}`;
  scoreDisplay.style.color = 'white';
  scoreDisplay.style.fontSize = '24px';
  popup.appendChild(scoreDisplay);

  const buttonContainer = document.createElement('div');
  buttonContainer.style.cssText = 'display: flex; justify-content: center; gap: 10px;';

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

  const continueWithAdButton = document.createElement('button');
  continueWithAdButton.textContent = 'Watch Ad to Continue';
  continueWithAdButton.style.cssText = 'font-size: 16px; padding: 10px; margin-top: 10px; display: block; width: 100%;';
  continueWithAdButton.disabled = true;
  continueWithAdButton.addEventListener('click', () => {
    console.log('Watch ad functionality not yet implemented');
  });
  popup.appendChild(continueWithAdButton);

  document.body.appendChild(popup);
}

// Game loop
function gameLoop(timestamp) {
  if (!gameActive) return; // Exit if game isn’t active

  if (lastTime === 0) {
    lastTime = timestamp;
    animationFrameId = requestAnimationFrame(gameLoop);
    return;
  }

  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  if (gameTime === 0) gameTime = timestamp / 1000;

  gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
  drawPlayArea();
  drawScore();
  drawDebugInfo();

  score += (scoreIncreaseRate * deltaTime / 1000);

  square.update(deltaTime, currentLevel);
  square.draw(gameCtx);

  if (square.checkBoundary(playAreaX, playAreaY, playAreaSize)) {
    endGame();
    return;
  }

  // Modified level transition logic:
  if ((timestamp / 1000 - gameTime) >= levelDurations[currentLevel - 1]) {
    if (currentLevel < 3) {
      currentLevel++;
      gameTime = timestamp / 1000;
    } else {
      // For level 3, keep the game running indefinitely by resetting gameTime.
      gameTime = timestamp / 1000;
    }
  }

  if (square.isSequenceCompleted()) {
    score += 50;
    square.resetSequence(currentLevel);
  }

  animationFrameId = requestAnimationFrame(gameLoop);
}

// Event listener for player interaction
gameCanvas.addEventListener('click', handleClick);

function handleClick(event) {
  if (!gameActive) return;
  
  const rect = gameCanvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  if (square.handleClick(x, y)) {
    score += 10;
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
  scoreboardCanvas.style.display = 'none';
  createStartButton();
});
