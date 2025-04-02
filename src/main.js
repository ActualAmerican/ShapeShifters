import ShapeManager from './ShapeManager.js';

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
  scoreboardCanvas.style.left = (canvasRect.left + 560) + 'px';
  scoreboardCanvas.style.top = (canvasRect.top - 60) + 'px';
}
updateScoreboardPosition();
window.addEventListener('resize', updateScoreboardPosition);

// Define the play area dimensions
const playAreaSize = 600;
const playAreaX = (gameCanvas.width - playAreaSize) / 2;
const playAreaY = (gameCanvas.height - playAreaSize) / 2;

// Define game variables
let score = 0;
let personalBest = localStorage.getItem('personalBest') || 0;
let currentLevel = 1; // Levels 1, 2, and 3 (level 3 runs indefinitely)
let gameTime = 0;
let gameActive = false;
let lastTime = 0;
let animationFrameId = null;
const levelDurations = [60, 120, 180]; // In seconds (level 3 is made infinite)
const scoreIncreaseRate = 1;

// Instantiate the ShapeManager
const shapeManager = new ShapeManager(gameCanvas, gameCtx);

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
    gameCtx.fillText(`Shape: ${shapeManager.shape.name}, Level: ${currentLevel}`, gameCanvas.width / 2, 570);
  }
}

function startGame() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  gameActive = true;
  score = 0;
  console.log('Score reset to:', score);
  currentLevel = 1;
  gameTime = 0;
  lastTime = 0;
  shapeManager.reset();
  createEndButton();
  scoreboardCanvas.style.display = 'block';
  drawScore();
  animationFrameId = requestAnimationFrame(gameLoop);
}

function endGame() {
  gameActive = false;
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

function gameLoop(timestamp) {
  if (!gameActive) return;
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
  shapeManager.update(deltaTime, currentLevel);
  shapeManager.draw();
  if (shapeManager.checkBoundary(playAreaX, playAreaY, playAreaSize)) {
    endGame();
    return;
  }
  // Level transition logic:
  if ((timestamp / 1000 - gameTime) >= levelDurations[currentLevel - 1]) {
    if (currentLevel < 3) {
      currentLevel++;
      gameTime = timestamp / 1000;
    } else {
      gameTime = timestamp / 1000;
    }
  }
  if (shapeManager.shape.isSequenceCompleted && shapeManager.shape.isSequenceCompleted()) {
    score += 50;
    shapeManager.shape.resetSequence(currentLevel);
  }
  animationFrameId = requestAnimationFrame(gameLoop);
}

gameCanvas.addEventListener('click', handleClick);
function handleClick(event) {
  if (!gameActive) return;
  const rect = gameCanvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  if (shapeManager.handleClick(x, y)) {
    score += 10;
  }
}

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

function createEndButton() {
  const endButton = document.createElement('button');
  endButton.id = 'endGameButton';
  endButton.textContent = 'End Game';
  endButton.style.cssText = 'position: absolute; top: 20px; right: 20px; font-size: 16px; padding: 5px 10px; z-index: 11;';
  endButton.addEventListener('click', endGame);
  document.body.appendChild(endButton);
}

document.addEventListener('DOMContentLoaded', () => {
  scoreboardCanvas.style.display = 'none';
  createStartButton();
});
