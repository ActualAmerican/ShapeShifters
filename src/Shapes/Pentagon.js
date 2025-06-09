import { Shape } from './Shape.js';

// Simple platform representation
class Platform {
  constructor(x, y, width, height, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
  }
  update(deltaTime) {
    this.y += this.speed * deltaTime;
  }
  draw(ctx) {
    ctx.fillStyle = '#228B22';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

export class Pentagon extends Shape {
  constructor(x, y, size, _ignoredColor, name = 'Pentagon') {
    super(x, y, size, '#7CFC00');
    this.startX = x;
    this.startY = y;
    this.name   = name;

    // Play area
    this.playArea = { x: window.playAreaX ?? 100, y: window.playAreaY ?? 0, size: window.playAreaSize ?? 600 };

    // Intro state
    this.playIntro     = true;
    this.introTimer    = 0;
    this.introDuration = 2500;
    this.fadeInTime    = 1200;
    this.glintTime     = 1800;

    // Physics
    this.vy         = 0;
    this.gravity    = 0.002;
    this.isCharging = false;
    this.chargeTime = 0;
    this.maxCharge  = 1000;
    this.jumpFactor = 0.005;
    this.isJumping  = false;
    this.scaleX     = 1;
    this.scaleY     = 1;

    // Calculate apothem (distance from center to side)
    // approximate distance from center to side, minus small fudge for visual overlap
    this.apothem = size * Math.cos(Math.PI / 5) - 2;

    // Platform tracking
    this.borderHeight          = 4;
    this.platformHeight        = 12;
    this.platforms             = [];
    this.platformSpawnTimer    = 0;
    this.platformSpawnInterval = 1200;
    this.currentSpeed          = 0;
    this.basePlatform          = null;
    this.currentPlatform       = null;
    this.shouldLaunchBase      = false;
    this.initialFall           = false;
    this.initialLaunched       = false;

    // Create initial base platform
    const { x: ax, y: ay, size: asz } = this.playArea;
    const baseY = ay + asz - this.borderHeight;
    this.basePlatform = new Platform(ax, baseY, asz, this.borderHeight, 0);
    this.platforms.push(this.basePlatform);
    this.groundY = baseY - this.apothem;

    // Input
    window.addEventListener('mousedown', () => this.handleMouseDown());
    window.addEventListener('mouseup',   () => this.handleMouseUp());
  }

  update(deltaTime, level) {
    const { x: ax, y: ay, size: asz } = this.playArea;

    // Intro: morph then drop
    if (this.playIntro) {
      this.introTimer += deltaTime;
      if (this.introTimer >= this.introDuration) {
        this.playIntro     = false;
        this.isJumping     = true;
        this.initialFall   = true;
        // Morph base platform
        const normalW = this.size * 2;
        const finalW  = normalW * 1.3;
        const finalX  = ax + (asz - finalW) / 2;
        const finalY  = ay + asz - this.platformHeight;
        this.basePlatform    = new Platform(finalX, finalY, finalW, this.platformHeight, 0);
        this.platforms       = [this.basePlatform];
        this.currentPlatform = null;
        this.groundY         = finalY - this.apothem;
      }
      return;
    }

    // Ride current platform when standing
    if (!this.isJumping && !this.isCharging && this.currentPlatform) {
      this.y = this.currentPlatform.y - this.apothem;
    }

    // Spawn moving platforms
    const speed = 0.06 + (level - 1) * 0.02;
    this.currentSpeed = speed;
    this.platformSpawnTimer += deltaTime;
    if (this.platformSpawnTimer >= this.platformSpawnInterval) {
      this.platformSpawnTimer -= this.platformSpawnInterval;
      const w      = this.size * 2;
      const spawnY = ay - this.platformHeight;
      const spawnX = ax + Math.random() * (asz - w);
      this.platforms.push(new Platform(spawnX, spawnY, w, this.platformHeight, speed));
    }

    // Update & cull platforms
    this.platforms.forEach(p => p.update(deltaTime));
    this.platforms = this.platforms.filter(p => p.y < ay + asz + p.height);

    // If the platform we were standing on has moved out of bounds, clear it and start falling
    if (this.currentPlatform && !this.platforms.includes(this.currentPlatform)) {
      this.currentPlatform = null;
      this.isJumping = true;
    }

    // Charging squish
    if (this.isCharging) {
      this.chargeTime = Math.min(this.chargeTime + deltaTime, this.maxCharge);
      const t = this.chargeTime / this.maxCharge;
      this.scaleY = 1 - 0.3 * t;
      this.scaleX = 1 + 0.3 * t;
      return;
    }

    // Launch base after leaving
    if (this.shouldLaunchBase && !this.initialLaunched) {
      if (this.y + this.apothem < this.basePlatform.y) {
        this.basePlatform.speed = this.currentSpeed;
        this.initialLaunched    = true;
        this.shouldLaunchBase   = false;
      }
    }

    // Physics & landing
    if (this.isJumping) {
      this.vy += this.gravity * deltaTime;
      this.y  += this.vy * deltaTime;

      if (this.vy > 0) {
        for (let p of this.platforms) {
          const bot = this.y + this.apothem;
          if (
            bot >= p.y && bot <= p.y + p.height &&
            this.x >= p.x && this.x <= p.x + p.width
          ) {
            // Landed
            this.isJumping      = false;
            this.vy             = 0;
            this.y              = p.y - this.apothem;
            this.currentPlatform= p;
            if (this.initialFall) {
              this.initialFall = false;
            }
            break;
          }
        }
      }
    }
  }

  draw(ctx) {
    const { x: ax, y: ay, size: asz } = this.playArea;
    ctx.save();

    // Clear borders
    ctx.clearRect(ax, ay + asz - this.borderHeight, asz, this.borderHeight);
    const m = Math.min(1, this.introTimer / this.introDuration);
    ctx.clearRect(ax, ay, asz, this.borderHeight * m);

    // Draw platforms or intro morph
    if (this.playIntro) {
      const t     = m;
      const minW  = asz;
      const maxW  = this.size * 2 * 1.3;
      const currW = minW + (maxW - minW) * t;
      const currX = ax + (asz - currW) / 2;
      const minH  = this.borderHeight;
      const maxH  = this.platformHeight;
      const currH = minH + (maxH - minH) * t;
      const currY = ay + asz - currH;
      ctx.fillStyle = '#FFFFFF'; ctx.fillRect(currX, currY, currW, currH);
      ctx.fillStyle = `rgba(34,139,34,${t})`; ctx.fillRect(currX, currY, currW, currH);
      ctx.globalAlpha = Math.min(1, this.introTimer / this.fadeInTime);
    } else {
      this.platforms.forEach(p => p.draw(ctx));
    }

    // Draw pentagon
    ctx.translate(this.x, this.y);
    ctx.scale(this.scaleX, this.scaleY);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a  = -Math.PI/2 + i*(2*Math.PI/5);
      const px = this.size * Math.cos(a);
      const py = this.size * Math.sin(a);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath(); ctx.fill();

    // Intro glint
    if (this.playIntro && this.introTimer >= this.glintTime && this.introTimer < this.glintTime + 400) {
      const g  = (this.introTimer - this.glintTime) / 400;
      const gx = -this.size + 2*this.size*g;
      const grad = ctx.createLinearGradient(gx-12,0,gx+12,0);
      grad.addColorStop(0,'rgba(255,255,255,0)');
      grad.addColorStop(0.5,'rgba(255,255,255,0.65)');
      grad.addColorStop(1,'rgba(255,255,255,0)');
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const a2  = -Math.PI/2 + i*(2*Math.PI/5);
        const px2 = this.size * Math.cos(a2);
        const py2 = this.size * Math.sin(a2);
        if (i===0) ctx.moveTo(px2, py2); else ctx.lineTo(px2, py2);
      }
      ctx.closePath(); ctx.clip(); ctx.fillStyle = grad; ctx.fillRect(-this.size,-this.size,this.size*2,this.size*2);
    }

    ctx.restore();
  }

  handleMouseDown() {
    if (!this.playIntro && !this.isJumping && !this.isCharging) {
      this.isCharging       = true;
      this.chargeTime       = 0;
      this.currentPlatform  = null;
    }
  }

  handleMouseUp() {
    if (this.isCharging) {
      this.isCharging        = false;
      this.shouldLaunchBase  = true;
      this.isJumping         = true;
      this.vy                = -this.chargeTime * this.jumpFactor;
      this.scaleX            = 1;
      this.scaleY            = 1;
    }
  }

  checkBoundary() {
    const { y: ay, size: asz } = this.playArea;
    return this.y - this.size > ay + asz || this.y + this.size < ay;
  }

  isSequenceCompleted() { return false; }

  reset() {
    this.x                = this.startX;
    this.y                = this.startY;
    const { x: ax, y: ay, size: asz } = this.playArea;
    this.playIntro        = true;
    this.introTimer       = 0;
    this.vy               = 0;
    this.isJumping        = false;
    this.isCharging       = false;
    this.chargeTime       = 0;
    this.scaleX           = 1;
    this.scaleY           = 1;
    this.shouldLaunchBase = false;
    this.initialFall      = false;
    this.initialLaunched  = false;
    this.currentPlatform  = null;
    const baseY = ay + asz - this.borderHeight;
    this.basePlatform = new Platform(ax, baseY, asz, this.borderHeight, 0);
    this.platforms   = [this.basePlatform];
    this.groundY     = baseY - this.apothem;
  }
}
