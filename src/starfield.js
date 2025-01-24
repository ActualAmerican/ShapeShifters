// Starfield Animation
const starfieldCanvas = document.getElementById('starfieldCanvas');
const ctxStarfield = starfieldCanvas.getContext('2d');

// Set canvas dimensions
function resizeCanvas() {
  starfieldCanvas.width = window.innerWidth;
  starfieldCanvas.height = window.innerHeight;
}
resizeCanvas();

// Reinitialize on window resize
window.addEventListener('resize', () => {
  resizeCanvas();
  initializeStars();
  initializeDust();
});

// Starfield setup
let stars = [];
const numStars = 200;

function initializeStars() {
  stars = [];
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * starfieldCanvas.width,
      y: Math.random() * starfieldCanvas.height,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.5 + 0.1,
    });
  }
}
initializeStars();

// Space dust setup
let dust = [];
const numDust = 50;

function initializeDust() {
  dust = [];
  for (let i = 0; i < numDust; i++) {
    dust.push({
      x: Math.random() * starfieldCanvas.width,
      y: Math.random() * starfieldCanvas.height,
      opacity: Math.random() * 0.5 + 0.2,
      size: Math.random() * 4 + 1,
      speed: Math.random() * 0.3 + 0.1,
    });
  }
}
initializeDust();

// Draw stars
function drawStars() {
  stars.forEach(star => {
    ctxStarfield.beginPath();
    ctxStarfield.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctxStarfield.fillStyle = 'white';
    ctxStarfield.fill();

    // Move star
    star.y += star.speed;
    if (star.y > starfieldCanvas.height) star.y = 0; // Reset to top
  });
}

// Draw space dust
function drawDust() {
  dust.forEach(d => {
    ctxStarfield.beginPath();
    ctxStarfield.arc(d.x, d.y, d.size, 0, Math.PI * 2);
    ctxStarfield.fillStyle = `rgba(255, 255, 255, ${d.opacity})`;
    ctxStarfield.fill();

    // Move dust
    d.y += d.speed;
    if (d.y > starfieldCanvas.height) d.y = 0; // Reset to top
  });
}

// Animation loop
function animate() {
  ctxStarfield.clearRect(0, 0, starfieldCanvas.width, starfieldCanvas.height); // Clear the canvas
  drawStars();
  drawDust();
  requestAnimationFrame(animate); // Continue the loop
}
animate();
