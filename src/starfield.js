// Starfield Animation
const canvas = document.getElementById('starfieldCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
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
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
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
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
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
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();

    // Move star
    star.y += star.speed;
    if (star.y > canvas.height) star.y = 0; // Reset to top
  });
}

// Draw space dust
function drawDust() {
  dust.forEach(d => {
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${d.opacity})`;
    ctx.fill();

    // Move dust
    d.y += d.speed;
    if (d.y > canvas.height) d.y = 0; // Reset to top
  });
}

// Animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  drawStars();
  drawDust();
  requestAnimationFrame(animate); // Continue the loop
}
animate();
