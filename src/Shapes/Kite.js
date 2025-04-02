export default class Kite {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.baseSize = size;
    this.color = '#191970';  // Default color (as provided)

    // Physics
    this.vy = 0;
    this.gravity = 0.001;  // Adjust as needed; could scale with level later

    // Lightning strike properties
    this.lightningStrikes = [];
    this.lightningTimer = 0;
    this.lightningInterval = 3000;  // in ms, for level 1 default; can be adjusted per level
    this.lightningDuration = 300;   // lightning lasts 300 ms

    // Cloud glow flag (for impending strike)
    this.cloudGlow = false;
  }

  update(deltaTime, level) {
    // (For level scaling, you can update gravity and lightningInterval here based on level.)
    // Apply gravity:
    this.vy += this.gravity * deltaTime;
    this.y += this.vy * deltaTime;

    // Update lightning timer
    this.lightningTimer += deltaTime;
    if (this.lightningTimer >= this.lightningInterval) {
      this.lightningTimer = 0;
      this.spawnLightning();
      this.cloudGlow = false;
    } else if (this.lightningTimer >= this.lightningInterval - 500) {
      // Last 500ms before lightning strike, show cloud glow
      this.cloudGlow = true;
    } else {
      this.cloudGlow = false;
    }

    // Update existing lightning strikes:
    for (let i = this.lightningStrikes.length - 1; i >= 0; i--) {
      this.lightningStrikes[i].lifetime -= deltaTime;
      if (this.lightningStrikes[i].lifetime <= 0) {
        this.lightningStrikes.splice(i, 1);
      }
    }
  }

  spawnLightning() {
    // We want a horizontal lightning strike with a slight zigzag.
    // Determine the y position for the strike. Here, we pick a random y near the kite.
    let strikeY = this.y + (Math.random() - 0.5) * 50; 
    let path = [];
    // We'll assume the play area x boundaries are available globally (or use defaults)
    const paX = (typeof window.playAreaX !== "undefined") ? window.playAreaX : 100;
    const paSize = (typeof window.playAreaSize !== "undefined") ? window.playAreaSize : 600;
    const numPoints = 10;
    const step = paSize / (numPoints - 1);
    for (let i = 0; i < numPoints; i++) {
      let x = paX + i * step;
      // Add a slight random vertical offset to create a zigzag.
      let offset = (Math.random() - 0.5) * 10;
      path.push({ x: x, y: strikeY + offset });
    }
    this.lightningStrikes.push({ path: path, lifetime: this.lightningDuration });
  }

  draw(ctx) {
    // Draw the kite shape as per your original design.
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y + this.size * 1.25);
    ctx.lineTo(this.x + this.size * 0.85, this.y);
    ctx.lineTo(this.x, this.y - this.size * 0.85);
    ctx.lineTo(this.x - this.size * 0.85, this.y);
    ctx.closePath();
    ctx.fill();

    // Draw lightning strikes.
    for (let strike of this.lightningStrikes) {
      ctx.save();
      // Set stroke style: white with a purple glow.
      ctx.strokeStyle = "white";
      ctx.lineWidth = 4;
      ctx.shadowColor = "purple";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      let first = true;
      for (let point of strike.path) {
        if (first) {
          ctx.moveTo(point.x, point.y);
          first = false;
        } else {
          ctx.lineTo(point.x, point.y);
        }
      }
      ctx.stroke();
      ctx.restore();
    }

    // Draw cloud glow (indicating an impending lightning strike)
    if (this.cloudGlow) {
      ctx.save();
      // Clip to play area boundaries:
      const paX = (typeof window.playAreaX !== "undefined") ? window.playAreaX : 100;
      const paY = (typeof window.playAreaY !== "undefined") ? window.playAreaY : 0;
      const paSize = (typeof window.playAreaSize !== "undefined") ? window.playAreaSize : 600;
      ctx.beginPath();
      ctx.rect(paX, paY, paSize, paSize);
      ctx.clip();

      // Create a horizontal linear gradient near the top edge of the play area.
      let gradient = ctx.createLinearGradient(paX, paY, paX + paSize, paY);
      gradient.addColorStop(0, "rgba(255,255,255,0)");
      gradient.addColorStop(0.5, "rgba(255,255,255,0.3)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(paX, paY, paSize, 20);  // 20px tall glow
      ctx.restore();
    }
  }

  handleClick(x, y) {
    // If click is within the kite's bounding box, push it upward.
    const half = this.size / 2;
    if (
      x >= this.x - half &&
      x <= this.x + half &&
      y >= this.y - half &&
      y <= this.y + half
    ) {
      this.vy = -0.5;  // Adjust upward force as needed.
      return true;
    }
    return false;
  }

  checkBoundary(playAreaX, playAreaY, playAreaSize) {
    const half = this.size / 2;
    // Fail if kite hits the bottom.
    if (this.y + half >= playAreaY + playAreaSize) return true;
    // Fail if kite collides with any lightning strike.
    for (let strike of this.lightningStrikes) {
      // Use a simple collision test: if the kite's center is near the average y of the strike.
      let avgY = strike.path.reduce((sum, p) => sum + p.y, 0) / strike.path.length;
      if (Math.abs(this.y - avgY) < 20) {
        // Also check horizontal proximity.
        let xs = strike.path.map(p => p.x);
        let minX = Math.min(...xs), maxX = Math.max(...xs);
        if (this.x + half > minX && this.x - half < maxX) return true;
      }
    }
    return false;
  }

  reset() {
    this.x = this.initialX;
    this.y = this.initialY;
    this.size = this.baseSize;
    this.vy = 0;
    this.lightningStrikes = [];
    this.lightningTimer = 0;
  }
}
