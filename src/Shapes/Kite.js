// Kite.js
export class Kite {
  constructor(x, y, size) {
    const scaleFactor = 2.0;
    this.size = size * scaleFactor;
    this.baseSize = this.size;
    this.x = x;
    this.y = y;
    this.color = '#191970';
    this.name = 'Kite';
    this.vy = 0;
    this.gravity = 0.001;
    this.fallDelay = 500;
    this.fallDelayTimer = 0;
    this.lightningStrikes = [];
    this.lightningTimer = 0;
    this.baseLightningInterval = 3000;
    this.lightningInterval = this.baseLightningInterval;
    this.lightningDuration = 300;
    this.tiltTime = 0;
    this.rotation = 0;
    // Use arrays for multiple pre-strike glows
    this.preStrikeDatas = [];
    this.preStrikeClouds = [];
    this.initialX = x;
    this.initialY = y;
  }

  update(deltaTime, level) {
    if (level === 1) {
      this.lightningInterval = this.baseLightningInterval;
    } else if (level === 2) {
      this.lightningInterval = 2000;
    } else if (level === 3) {
      this.lightningInterval = 1500;
    }

    this.tiltTime += deltaTime;
    this.rotation = 0.1 * Math.sin(this.tiltTime / 200);

    if (this.fallDelayTimer < this.fallDelay) {
      this.fallDelayTimer += deltaTime;
    } else {
      this.vy += this.gravity * deltaTime;
      this.y += this.vy * deltaTime;
    }

    this.lightningTimer += deltaTime;

    const paY = window.playAreaY || 0;
    const paSize = window.playAreaSize || 600;
    if (this.lightningTimer >= this.lightningInterval - 1000 && this.preStrikeDatas.length === 0) {
      const numStrikes = (level === 3) ? 2 : 1;
      for (let i = 0; i < numStrikes; i++) {
        this.preStrikeDatas.push({
          edge: Math.random() < 0.5 ? 'left' : 'right',
          y: paY + Math.random() * paSize
        });
        this.preStrikeClouds.push(this.generatePreStrikeClouds());
      }
    }

    if (this.lightningTimer >= this.lightningInterval) {
      this.lightningTimer = 0;
      for (let data of this.preStrikeDatas) {
        this.spawnLightning(data);
      }
      this.preStrikeDatas = [];
      this.preStrikeClouds = [];
    }

    for (let i = this.lightningStrikes.length - 1; i >= 0; i--) {
      this.lightningStrikes[i].lifetime -= deltaTime;
      if (this.lightningStrikes[i].lifetime <= 0) {
        this.lightningStrikes.splice(i, 1);
      }
    }
  }

  generatePreStrikeClouds() {
    const layers = [];
    // Layer 1: Base dark clouds.
    const layer1 = [];
    for (let i = 0; i < 4; i++) {
      layer1.push({
        offsetX: (Math.random() - 0.5) * 40,
        offsetY: (Math.random() - 0.5) * 30,
        radius: 35 + Math.random() * 10,
        fill: "rgba(20,20,30,0.7)",
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        speedX: 0.3 + Math.random() * 0.4,  // slower movement
        speedY: 0.3 + Math.random() * 0.4
      });
    }
    layers.push(layer1);
    // Layer 2: Intermediate clouds.
    const layer2 = [];
    for (let i = 0; i < 3; i++) {
      layer2.push({
        offsetX: (Math.random() - 0.5) * 30,
        offsetY: (Math.random() - 0.5) * 30,
        radius: 40 + Math.random() * 10,
        fill: "rgba(40,40,50,0.6)",
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        speedX: 0.3 + Math.random() * 0.4,
        speedY: 0.3 + Math.random() * 0.4
      });
    }
    layers.push(layer2);
    // Layer 3: Light highlights.
    const layer3 = [];
    for (let i = 0; i < 2; i++) {
      layer3.push({
        offsetX: (Math.random() - 0.5) * 20,
        offsetY: (Math.random() - 0.5) * 20,
        radius: 50 + Math.random() * 10,
        fill: "rgba(80,80,90,0.4)",
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        speedX: 0.3 + Math.random() * 0.4,
        speedY: 0.3 + Math.random() * 0.4
      });
    }
    layers.push(layer3);
    // Layer 4: Glow points.
    const layer4 = [];
    for (let i = 0; i < 3; i++) {
      layer4.push({
        offsetX: (Math.random() - 0.5) * 30,
        offsetY: (Math.random() - 0.5) * 30,
        phase: Math.random() * Math.PI * 2,
        frequency: 5 + Math.random() * 5,
        size: 10 + Math.random() * 10
      });
    }
    layers.push(layer4);
    return layers;
  }

  spawnLightning(preStrikeData) {
    const paX = window.playAreaX || 100;
    const paY = window.playAreaY || 0;
    const paSize = window.playAreaSize || 600;
    let baseX, strikeY, step;
    if (preStrikeData) {
      baseX = preStrikeData.edge === 'left' ? paX : paX + paSize;
      strikeY = preStrikeData.y;
      step = paSize / 9;
    } else {
      strikeY = paY + Math.random() * paSize;
      baseX = paX + Math.random() * paSize;
      step = paSize / 9;
    }
    // For distinct strikes, add fixed offsets.
    let offsetX = 0;
    let offsetY = 0;
    if (preStrikeData && this.preStrikeDatas.length > 1) {
      // For 2 strikes, assign one a negative offset and one a positive offset.
      const index = this.preStrikeDatas.indexOf(preStrikeData);
      offsetX = (index === 0) ? -20 : 20;
      offsetY = (index === 0) ? -50 : 50;
    }
    let currentBaseX = baseX;
    if (preStrikeData) {
      currentBaseX = preStrikeData.edge === 'left' ? paX + offsetX : paX + paSize + offsetX;
    }
    let localStrikeY = strikeY + offsetY;
    let path = [];
    const numPoints = 10;
    for (let i = 0; i < numPoints; i++) {
      let posX;
      if (preStrikeData && preStrikeData.edge === 'left') {
        posX = currentBaseX + i * step;
      } else if (preStrikeData && preStrikeData.edge === 'right') {
        posX = currentBaseX - i * step;
      } else {
        posX = currentBaseX + i * step;
      }
      const posY = localStrikeY + (Math.random() - 0.5) * 20;
      path.push({ x: posX, y: posY });
    }
    let strike = {
      path: path,
      lifetime: this.lightningDuration,
      maxLifetime: this.lightningDuration,
      branches: []
    };
    const numBranches = Math.floor(Math.random() * 2) + 2;
    for (let b = 0; b < numBranches; b++) {
      const branchStartIndex = Math.floor(Math.random() * (numPoints - 4)) + 2;
      const branchPath = [path[branchStartIndex]];
      const numBranchPoints = Math.floor(Math.random() * 2) + 2;
      for (let j = 1; j <= numBranchPoints; j++) {
        const prevPoint = branchPath[branchPath.length - 1];
        const branchOffsetX = (Math.random() - 0.5) * 30;
        const branchOffsetY = (Math.random() - 0.5) * 30;
        branchPath.push({ x: prevPoint.x + branchOffsetX, y: prevPoint.y + branchOffsetY });
      }
      strike.branches.push(branchPath);
    }
    this.lightningStrikes.push(strike);
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(0, this.size * 0.625);
    ctx.lineTo(this.size * 0.425, 0);
    ctx.lineTo(0, -this.size * 0.425);
    ctx.lineTo(-this.size * 0.425, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    for (let strike of this.lightningStrikes) {
      ctx.save();
      let progress = 1 - strike.lifetime / strike.maxLifetime;
      let fadeAlpha = (progress > 0.7) ? Math.max(0, 1 - (progress - 0.7) / 0.3) : 1;
      ctx.globalAlpha = fadeAlpha;
      ctx.strokeStyle = "white";
      ctx.lineWidth = 4;
      ctx.shadowColor = "rgba(255,255,255,0.8)";
      ctx.shadowBlur = 20;
      const numPoints = strike.path.length;
      const lastIndex = Math.floor(progress * (numPoints - 1));
      ctx.beginPath();
      ctx.moveTo(strike.path[0].x, strike.path[0].y);
      for (let i = 1; i <= lastIndex; i++) {
        ctx.lineTo(strike.path[i].x, strike.path[i].y);
      }
      if (lastIndex < numPoints - 1) {
        let segProgress = (progress * (numPoints - 1)) - lastIndex;
        let pCurrent = strike.path[lastIndex];
        let pNext = strike.path[lastIndex + 1];
        let interpX = pCurrent.x + segProgress * (pNext.x - pCurrent.x);
        let interpY = pCurrent.y + segProgress * (pNext.y - pCurrent.y);
        ctx.lineTo(interpX, interpY);
      }
      ctx.stroke();
      if (strike.branches && strike.branches.length > 0) {
        for (let branch of strike.branches) {
          ctx.beginPath();
          ctx.moveTo(branch[0].x, branch[0].y);
          const branchNumPoints = branch.length;
          const branchLastIndex = Math.floor(progress * (branchNumPoints - 1));
          for (let j = 1; j <= branchLastIndex; j++) {
            ctx.lineTo(branch[j].x, branch[j].y);
          }
          if (branchLastIndex < branchNumPoints - 1) {
            let segProgress = (progress * (branchNumPoints - 1)) - branchLastIndex;
            let pCurrent = branch[branchLastIndex];
            let pNext = branch[branchLastIndex + 1];
            let interpX = pCurrent.x + segProgress * (pNext.x - pCurrent.x);
            let interpY = pCurrent.y + segProgress * (pNext.y - pCurrent.y);
            ctx.lineTo(interpX, interpY);
          }
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    const currentTime = Date.now() / 1000;
    for (let i = 0; i < this.preStrikeDatas.length; i++) {
      const data = this.preStrikeDatas[i];
      const clouds = this.preStrikeClouds[i];
      const preProgress = (this.lightningTimer - (this.lightningInterval - 1000)) / 1000;
      const overallAlpha = Math.sin(Math.PI * preProgress) * 0.4;
      const paX = window.playAreaX || 100;
      const paY = window.playAreaY || 0;
      const paSize = window.playAreaSize || 600;
      let centerX = data.edge === 'left' ? paX : paX + paSize;
      let centerY = data.y;
      ctx.save();
      ctx.beginPath();
      ctx.rect(paX, paY, paSize, paSize);
      ctx.clip();
      ctx.globalAlpha = overallAlpha;
      // Draw each cloud layer (first three layers) using our new helper.
      for (let layerIndex = 0; layerIndex < 3; layerIndex++) {
        const layer = clouds[layerIndex];
        for (let blob of layer) {
          // Use a slower movement: reduce amplitude and speed.
          const amplitude = 2; // reduced amplitude
          const offsetX = amplitude * Math.sin(2 * Math.PI * blob.speedX * currentTime * 0.5 + blob.phaseX);
          const offsetY = amplitude * Math.cos(2 * Math.PI * blob.speedY * currentTime * 0.5 + blob.phaseY);
          const blobX = centerX + blob.offsetX + offsetX;
          const blobY = centerY + blob.offsetY + offsetY;
          this.drawIrregularBlob(ctx, blobX, blobY, blob.radius, blob.fill);
        }
      }
      // Overlay a stronger inner glow.
      let gradient = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 80);
      gradient.addColorStop(0, "rgba(255,255,255,0.6)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 80, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // New helper to draw an irregular, dynamic blob.
  drawIrregularBlob(ctx, x, y, radius, fill) {
    const numVertices = 8 + Math.floor(Math.random() * 4); // 8-11 vertices.
    ctx.fillStyle = fill;
    ctx.beginPath();
    for (let i = 0; i < numVertices; i++) {
      let angle = (i / numVertices) * Math.PI * 2;
      // Reduce jitter to make the shape more defined.
      let randomOffset = 0.1 + Math.random() * 0.2; // small variation
      let r = radius * randomOffset;
      let vx = x + r * Math.cos(angle + (Math.random() - 0.5) * 0.1);
      let vy = y + r * Math.sin(angle + (Math.random() - 0.5) * 0.1);
      if (i === 0) {
        ctx.moveTo(vx, vy);
      } else {
        ctx.lineTo(vx, vy);
      }
    }
    ctx.closePath();
    ctx.fill();
  }

  checkBoundary(playAreaX, playAreaY, playAreaSize) {
    const kitePolygon = this.getKitePolygonPoints();
    const allAbove = kitePolygon.every(pt => pt.y < playAreaY);
    const allBelow = kitePolygon.every(pt => pt.y > playAreaY + playAreaSize);
    if (allAbove || allBelow) {
      return true;
    }
    for (let strike of this.lightningStrikes) {
      let progress = 1 - strike.lifetime / strike.maxLifetime;
      if (progress < 0.7) continue;
      for (let i = 0; i < strike.path.length - 1; i++) {
        const p1 = strike.path[i];
        const p2 = strike.path[i + 1];
        if (this.lineIntersectsPolygon(p1, p2, kitePolygon)) {
          return true;
        }
      }
      for (let branch of strike.branches) {
        for (let i = 0; i < branch.length - 1; i++) {
          const p1 = branch[i];
          const p2 = branch[i + 1];
          if (this.lineIntersectsPolygon(p1, p2, kitePolygon)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  getKitePolygonPoints() {
    const localPoints = [
      { x: 0, y: 0.625 * this.size },
      { x: 0.425 * this.size, y: 0 },
      { x: 0, y: -0.425 * this.size },
      { x: -0.425 * this.size, y: 0 }
    ];
    const cosR = Math.cos(this.rotation);
    const sinR = Math.sin(this.rotation);
    const worldPoints = [];
    for (let lp of localPoints) {
      const rx = lp.x * cosR - lp.y * sinR;
      const ry = lp.x * sinR + lp.y * cosR;
      worldPoints.push({ x: this.x + rx, y: this.y + ry });
    }
    return worldPoints;
  }

  lineIntersectsPolygon(p1, p2, polygon) {
    for (let i = 0; i < polygon.length; i++) {
      const j = (i + 1) % polygon.length;
      if (this.linesIntersect(p1, p2, polygon[i], polygon[j])) {
        return true;
      }
    }
    return false;
  }

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
    this.preStrikeDatas = [];
    this.preStrikeClouds = [];
  }

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
