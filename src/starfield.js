// Starfield Animation
const starfieldCanvas = document.getElementById("starfieldCanvas");
const ctxStarfield = starfieldCanvas.getContext("2d");

// Set canvas dimensions
function resizeCanvas() {
  starfieldCanvas.width = window.innerWidth;
  starfieldCanvas.height = window.innerHeight;
}
resizeCanvas();

window.addEventListener("resize", () => {
  resizeCanvas();
  initializeStars();
  initializeComets();
});

// Stars setup
let stars = [];
const numStars = 200;

function initializeStars() {
  stars = [];
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * starfieldCanvas.width,
      y: Math.random() * starfieldCanvas.height,
      size: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 1.5 + 0.5,
      twinkle: Math.random() * 0.3 + 0.7,
    });
  }
}
initializeStars();

// Comets setup
let comets = [];
const numComets = 5;
const cometSpawnInterval = 1.5; // Increased spawn interval for reduced frequency
let lastCometSpawnTime = 0; // Track the last comet spawn time

function initializeComets() {
  comets = []; // Reset comets array when initializing

  for (let i = 0; i < numComets; i++) {
    // Calculate comet's spawn time with a random delay
    const spawnDelay = i * cometSpawnInterval; // Increase delay between each comet
    const startX = Math.random() * starfieldCanvas.width;
    const startY = Math.random() * starfieldCanvas.height;
    const endX = startX + (Math.random() > 0.5 ? 1 : -1) * starfieldCanvas.width * 1.2;
    const endY = startY + Math.random() * 300 - 150;
    const controlX = (startX + endX) / 2 + Math.random() * 300 - 150;
    const controlY = Math.min(startY, endY) - Math.random() * 200;

    comets.push({
      startX,
      startY,
      endX,
      endY,
      controlX,
      controlY,
      progress: 0, // Start with 0 progress
      speed: Math.random() * 0.0003 + 0.0003,
      trail: [],
      maxTrailLength: 60, // Trail length unchanged
      streaks1: generateStreaks(),
      streaks2: generateStreaks(),
      streaks3: generateStreaks(),
      width: Math.random() * 3 + 1,
      glowSize: Math.random() * 6 + 5,
      opacity: 0, // Start opacity at 0
      opacitySpeed: 0.001, // Speed up fade-in
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: Math.random() * 0.0005 + 0.0005,
      rotationSpeedStreaks: 0.00004,
      spawnDelay, // Individual comet delay
      startTime: performance.now() / 1000 + spawnDelay, // Spawn time considering delay
      fadeInDuration: 2, // Duration of fade-in effect in seconds
      fadeStartTime: null, // Store when fade-in starts
    });
  }
}
initializeComets();

// Generate random light streaks
function generateStreaks() {
  const streaks = [];
  const numStreaks = Math.floor(Math.random() * 4) + 3;
  for (let i = 0; i < numStreaks; i++) {
    const angle = Math.random() * Math.PI * 2;
    const length = Math.random() * 30 + 15;
    const opacity = Math.random() * 0.3 + 0.4;
    streaks.push({ angle, length, opacity });
  }
  return streaks;
}

// Draw stars
function drawStars() {
  stars.forEach((star) => {
    ctxStarfield.beginPath();
    ctxStarfield.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    const gradient = ctxStarfield.createRadialGradient(
      star.x, star.y, star.size * 0.3, star.x, star.y, star.size
    );
    gradient.addColorStop(0, `rgba(255, 255, 255, ${star.twinkle})`);
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctxStarfield.fillStyle = gradient;
    ctxStarfield.fill();

    // Move star
    star.x -= star.speed;
    if (star.x < 0) star.x = starfieldCanvas.width;
  });
}

// Draw comets and trails
function drawComets() {
  // Track the time to allow spawning at different times
  const currentTime = performance.now() / 1000;

  comets.forEach((comet) => {
    if (currentTime >= comet.startTime) {
      // If the comet's start time has passed, update its progress
      comet.progress += comet.speed;
      if (comet.fadeStartTime === null) {
        comet.fadeStartTime = currentTime; // Record the start of fade-in
      }
    }

    const t = comet.progress;
    const x =
      (1 - t) * (1 - t) * comet.startX +
      2 * (1 - t) * t * comet.controlX +
      t * t * comet.endX;
    const y =
      (1 - t) * (1 - t) * comet.startY +
      2 * (1 - t) * t * comet.controlY +
      t * t * comet.endY;

    // Add to trail with fading effect
    comet.trail.unshift({ x, y, alpha: 1.0 });

    if (comet.trail.length > comet.maxTrailLength) {
      comet.trail.pop();
    }

    // Apply uniform fade-in effect for each comet (reset on each spawn)
    if (comet.fadeStartTime) {
      const fadeElapsed = currentTime - comet.fadeStartTime;
      comet.opacity = Math.min(1, fadeElapsed / comet.fadeInDuration); // Fade in over duration
    }

    // Only draw comet and streaks once the comet begins (ensuring uniform spawn)
    if (comet.progress > 0) {
      // Draw comet glow
      const glowGradient = ctxStarfield.createRadialGradient(x, y, 0, x, y, comet.glowSize);
      glowGradient.addColorStop(0, `rgba(255, 255, 255, ${comet.opacity})`);
      glowGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctxStarfield.fillStyle = glowGradient;
      ctxStarfield.beginPath();
      ctxStarfield.arc(x, y, comet.glowSize, 0, Math.PI * 2);
      ctxStarfield.fill();

      // Draw dynamically fading and shrinking trail
      for (let i = 0; i < comet.trail.length; i++) {
        const segment = comet.trail[i];
        const alpha = Math.max(0, 1 - i / comet.trail.length);
        const sizeFactor = 1 - i / comet.trail.length;

        ctxStarfield.beginPath();
        ctxStarfield.arc(segment.x, segment.y, comet.width * sizeFactor, 0, Math.PI * 2);
        ctxStarfield.fillStyle = `rgba(255, 255, 255, ${alpha * comet.opacity})`;
        ctxStarfield.fill();
      }

      // Draw streaks with comet progress
      drawStreaks(ctxStarfield, x, y, comet.streaks1, comet.rotation, true, comet.opacity);
      drawStreaks(ctxStarfield, x, y, comet.streaks2, comet.rotation * 1.5, false, comet.opacity);
      drawStreaks(ctxStarfield, x, y, comet.streaks3, comet.rotation * 2, true, comet.opacity);
    }

    // Update movement
    comet.rotation += comet.rotationSpeed;

    // Reset comet after it has completed its journey
    if (comet.progress >= 1.2) {
      // Add a delay before the next comet spawns, giving a sense of 1 at a time
      comet.startTime = performance.now() / 1000 + cometSpawnInterval;
      comet.progress = 0; // Reset progress to start again
      comet.opacity = 0; // Reset opacity for the next spawn (ensures uniform fade-in)
      comet.fadeStartTime = null; // Reset fadeStartTime for the next spawn
    }
  });
}

// Draw streaks
function drawStreaks(ctx, x, y, streaks, rotation, isClockwise, opacity) {
  streaks.forEach((streak) => {
    const rotatedAngle = streak.angle + (isClockwise ? rotation : -rotation);
    const xEnd = x + Math.cos(rotatedAngle) * streak.length;
    const yEnd = y + Math.sin(rotatedAngle) * streak.length;

    const glowGradient = ctx.createRadialGradient(x, y, 0, xEnd, yEnd, streak.length / 3);
    glowGradient.addColorStop(0, `rgba(255, 255, 255, ${opacity * streak.opacity})`);
    glowGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(xEnd, yEnd);

    ctx.strokeStyle = glowGradient;
    ctx.lineWidth = streak.length / 4;
    ctx.lineCap = "round";
    ctx.stroke();
  });
}

// Main animation loop
function animate() {
  ctxStarfield.fillStyle = "black";
  ctxStarfield.fillRect(0, 0, starfieldCanvas.width, starfieldCanvas.height);

  drawStars();
  drawComets();

  requestAnimationFrame(animate);
}

// Start the animation
animate();
