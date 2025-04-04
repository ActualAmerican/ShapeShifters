// Kite.js
export class Kite {
  constructor(x, y, size) {
    // Increase the size with a larger scale factor.
    const scaleFactor = 2.0;
    this.size = size * scaleFactor;
    this.baseSize = this.size;
    
    this.x = x;
    this.y = y;
    this.color = '#191970';  // Default color
    this.name = 'Kite';      // Set a name so it displays correctly

    // Physics properties
    this.vy = 0;
    this.gravity = 0.001; // Adjust as needed

    // Delay before gravity applies (in milliseconds)
    this.fallDelay = 500;
    this.fallDelayTimer = 0;

    // Lightning properties
    this.lightningStrikes = [];
    this.lightningTimer = 0;
    this.baseLightningInterval = 3000; // Base interval for level 1
    this.lightningInterval = this.baseLightningInterval;
    this.lightningDuration = 300;  // Lightning lasts 300 ms
    this.cloudGlow = false;

    // For smooth tilting.
    this.tiltTime = 0;
    this.rotation = 0; // Current rotation in radians

    // Pre-strike glow data.
    // When in the pre-strike phase, this will be set to:
    // { edge: 'left' or 'right', y: chosenY }
    this.preStrikeData = null;

    // Save initial position for resets.
    this.initialX = x;
    this.initialY = y;
  }

  update(deltaTime, level) {
    // Adjust lightning frequency based on level.
    if (level === 1) {
      this.lightningInterval = this.baseLightningInterval;
    } else if (level === 2) {
      this.lightningInterval = 2000;
    } else if (level === 3) {
      this.lightningInterval = 1500;
    }

    // Increase tilt timer and update rotation for smooth oscillating tilt.
    this.tiltTime += deltaTime;
    this.rotation = 0.1 * Math.sin(this.tiltTime / 200);

    // Handle fall delay.
    if (this.fallDelayTimer < this.fallDelay) {
      this.fallDelayTimer += deltaTime;
    } else {
      this.vy += this.gravity * deltaTime;
      this.y += this.vy * deltaTime;
    }

    // Update lightning timer.
    this.lightningTimer += deltaTime;

    // When entering the pre-strike phase (last 500ms before a strike),
    // set preStrikeData if not already set.
    if (this.lightningTimer >= this.lightningInterval - 500 && !this.preStrikeData) {
      const paY = (typeof window.playAreaY !== "undefined") ? window.playAreaY : 0;
      const paSize = (typeof window.playAreaSize !== "undefined") ? window.playAreaSize : 600;
      this.preStrikeData = {
        edge: Math.random() < 0.5 ? 'left' : 'right',
        y: paY + Math.random() * paSize
      };
    }

    // When lightning timer reaches the interval, spawn lightning using preStrikeData.
    if (this.lightningTimer >= this.lightningInterval) {
      this.lightningTimer = 0;
      // Use the preStrikeData (if available) so the strike spawns exactly there.
      // If not available for some reason, fall back to random.
      this.spawnLightning( (level === 3) ? 2 : 1, this.preStrikeData );
      this.preStrikeData = null;
      this.cloudGlow = false;
    } else {
      this.cloudGlow = false;
    }

    // Update existing lightning strikes.
    for (let i = this.lightningStrikes.length - 1; i >= 0; i--) {
      this.lightningStrikes[i].lifetime -= deltaTime;
      if (this.lightningStrikes[i].lifetime <= 0) {
        this.lightningStrikes.splice(i, 1);
      }
    }
  }

  /**
   * spawnLightning(count, preStrikeData)
   * If preStrikeData is provided, use it to set the strike's position;
   * otherwise, use random positions.
   */
  spawnLightning(count = 1, preStrikeData = null) {
    const paX = (typeof window.playAreaX !== "undefined") ? window.playAreaX : 100;
    const paY = (typeof window.playAreaY !== "undefined") ? window.playAreaY : 0;
    const paSize = (typeof window.playAreaSize !== "undefined") ? window.playAreaSize : 600;
    
    // Determine base X and strikeY.
    let baseX, strikeY;
    if (preStrikeData) {
      baseX = (preStrikeData.edge === 'left') ? paX : paX + paSize;
      strikeY = preStrikeData.y;
    } else {
      // Fallback to random if no preStrikeData.
      strikeY = paY + Math.random() * paSize;
      baseX = paX + Math.random() * paSize;
    }
    
    for (let k = 0; k < count; k++) {
      let path = [];
      const numPoints = 10;
      // Divide the vertical span of the play area.
      const stepY = paSize / (numPoints - 1);
      // Generate points starting at strikeY, moving vertically down.
      for (let i = 0; i < numPoints; i++) {
        // Use the same base X (with slight jitter) for all points.
        const posX = baseX + ((Math.random() - 0.5) * 20);
        const posY = strikeY + i * stepY + ((Math.random() - 0.5) * 20);
        path.push({ x: posX, y: posY });
      }
      this.lightningStrikes.push({ path: path, lifetime: this.lightningDuration });
    }
  }

  draw(ctx) {
    ctx.save();
    
    // Translate to kite's position and apply tilt rotation.
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    
    // Draw kite shape (diamond) using relative coordinates.
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(0, this.size * 0.625);
    ctx.lineTo(this.size * 0.425, 0);
    ctx.lineTo(0, -this.size * 0.425);
    ctx.lineTo(-this.size * 0.425, 0);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();

    // Draw lightning strikes.
    for (let strike of this.lightningStrikes) {
      ctx.save();
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

    // Draw pre-strike glow if available.
    if (this.preStrikeData) {
      ctx.save();
      const paX = (typeof window.playAreaX !== "undefined") ? window.playAreaX : 100;
      const paY = (typeof window.playAreaY !== "undefined") ? window.playAreaY : 0;
      const paSize = (typeof window.playAreaSize !== "undefined") ? window.playAreaSize : 600;
      // Define glow dimensions.
      const glowWidth = 50;
      const glowHeight = 100;
      let glowX, glowY;
      if (this.preStrikeData.edge === 'left') {
        glowX = paX;
      } else {
        glowX = paX + paSize - glowWidth;
      }
      // Center glow vertically on preStrikeData.y.
      glowY = this.preStrikeData.y - glowHeight / 2;
      // Clamp glowY to play area.
      if (glowY < paY) glowY = paY;
      if (glowY + glowHeight > paY + paSize) glowY = paY + paSize - glowHeight;
      
      // Create a linear gradient for the glow.
      let gradient;
      if (this.preStrikeData.edge === 'left') {
        gradient = ctx.createLinearGradient(glowX, glowY, glowX + glowWidth, glowY);
      } else {
        gradient = ctx.createLinearGradient(glowX + glowWidth, glowY, glowX, glowY);
      }
      gradient.addColorStop(0, "rgba(255,255,255,0)");
      gradient.addColorStop(0.5, "rgba(255,255,255,0.5)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(glowX, glowY, glowWidth, glowHeight);
      ctx.restore();
    }
  }

  /**
   * Collision check:
   * 1) Fail if kite hits bottom boundary.
   * 2) For each lightning segment, check precise intersection
   *    with the kite's diamond shape (computed in world coordinates).
   */
  checkBoundary(playAreaX, playAreaY, playAreaSize) {
    // 1) Bottom boundary.
    const half = this.size / 2;
    if (this.y + half >= playAreaY + playAreaSize) {
      return true;
    }
    // 2) Check lightning intersection.
    const kitePolygon = this.getKitePolygonPoints();
    for (let strike of this.lightningStrikes) {
      for (let i = 0; i < strike.path.length - 1; i++) {
        const p1 = strike.path[i];
        const p2 = strike.path[i + 1];
        if (this.lineIntersectsPolygon(p1, p2, kitePolygon)) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Compute the kite's diamond polygon (4 points) in world coordinates.
   */
  getKitePolygonPoints() {
    const localPoints = [
      { x: 0, y: 0.625 * this.size },
      { x: 0.425 * this.size, y: 0 },
      { x: 0, y: -0.425 * this.size },
      { x: -0.425 * this.size, y: 0 },
    ];
    const cosR = Math.cos(this.rotation);
    const sinR = Math.sin(this.rotation);
    let worldPoints = [];
    for (let lp of localPoints) {
      const rx = lp.x * cosR - lp.y * sinR;
      const ry = lp.x * sinR + lp.y * cosR;
      worldPoints.push({ x: this.x + rx, y: this.y + ry });
    }
    return worldPoints;
  }

  /**
   * Checks if line segment (p1 to p2) intersects any edge of the polygon.
   */
  lineIntersectsPolygon(p1, p2, polygon) {
    for (let i = 0; i < polygon.length; i++) {
      const j = (i + 1) % polygon.length;
      if (this.linesIntersect(p1, p2, polygon[i], polygon[j])) {
        return true;
      }
    }
    return false;
  }

  /**
   * Standard line intersection test for segments AB and CD.
   */
  linesIntersect(A, B, C, D) {
    const denom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);
    if (denom === 0) return false;
    const ua = ((D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x)) / denom;
    const ub = ((B.x - A.x) * (A.y - C.y) - (B.y - A.y) * (A.x - C.x)) / denom;
    return (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1);
  }

  reset() {
    this.x = this.initialX;
    this.y = this.initialY;
    this.vy = 0;
    this.size = this.baseSize;
    this.lightningStrikes = [];
    this.lightningTimer = 0;
    this.fallDelayTimer = 0;
    this.tiltTime = 0;
    this.rotation = 0;
    this.preStrikeData = null;
  }

  /**
   * Extends the clickable hitbox slightly without affecting hazard collision.
   */
  handleClick(x, y) {
    const hitboxMargin = 10;
    const half = this.size / 2;
    if (
      x >= this.x - half - hitboxMargin &&
      x <= this.x + half + hitboxMargin &&
      y >= this.y - half - hitboxMargin &&
      y <= this.y + half + hitboxMargin
    ) {
      this.vy = -0.5;
      return true;
    }
    return false;
  }
}
