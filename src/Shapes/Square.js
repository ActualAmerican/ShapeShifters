// Square.js
class Square {
  constructor(x, y, size, color) {
    this.name = 'square';
    this.color = color;
    this.size = size;
    this.x = x;
    this.y = y;
    this.sequence = []; // Will store the sequence of sides to tap
    this.sequenceIndex = 0;
    this.growthRate = 0.1; // How fast the square grows
    this.pulseSpeed = 1000; // Speed at which sides pulse in ms
    this.isMoving = false; // For level 3, to determine if the square moves
    this.initialX = x;
    this.initialY = y;
  }

  // Draw the square
  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
  }

  // Update the square's size and movement
  update(deltaTime, level) {
    console.log('Updating square size:', this.size, 'DeltaTime:', deltaTime, 'Level:', level);
    
    if (level === 1) {
      this.growthRate = 0.1;
      this.pulseSpeed = 1000;
    } else if (level === 2) {
      this.growthRate = 0.2; // Faster growth for level 2
      this.pulseSpeed = 800;
    } else if (level === 3) {
      this.growthRate = 0.3; // Even faster for level 3
      this.pulseSpeed = 600;
      this.isMoving = true; // Square moves in level 3
    }
    this.size += this.growthRate * deltaTime / 1000; // Adjust size based on time passed

    // If the square is moving in level 3
    if (this.isMoving) {
      this.x = this.initialX + Math.sin(Date.now() / 1000) * 50; // Simple circular motion
      this.y = this.initialY + Math.cos(Date.now() / 1000) * 50;
    }
  }

  // Generate a random sequence for the square
  generateSequence(length = 4) {
    this.sequence = [];
    for (let i = 0; i < length; i++) {
      this.sequence.push(Math.floor(Math.random() * 4));
    }
    this.sequenceIndex = 0;
  }

  // Check if the square has reached the play area boundary
  checkBoundary(playAreaX, playAreaY, playAreaSize) {
    if (this.x - this.size / 2 <= playAreaX || 
        this.x + this.size / 2 >= playAreaX + playAreaSize || 
        this.y - this.size / 2 <= playAreaY || 
        this.y + this.size / 2 >= playAreaY + playAreaSize) {
      return true;
    }
    return false;
  }

  // Handle player interaction
  handleClick(x, y) {
    const left = this.x - this.size / 2;
    const right = this.x + this.size / 2;
    const top = this.y - this.size / 2;
    const bottom = this.y + this.size / 2;

    let clickedSide;
    if (y >= top && y <= bottom) {
      if (x < left) clickedSide = 3; // Left
      else if (x > right) clickedSide = 1; // Right
    } else if (x >= left && x <= right) {
      if (y < top) clickedSide = 0; // Top
      else if (y > bottom) clickedSide = 2; // Bottom
    }

    // Check if the clicked side matches the current side in the sequence
    if (clickedSide === this.sequence[this.sequenceIndex]) {
      this.sequenceIndex++;
      if (this.sequenceIndex === this.sequence.length) {
        // Sequence completed, reset for next round
        this.resetSequence(currentLevel);
        return true; // Return true if the sequence is completed
      }
      return false; // Return false if sequence is not yet completed
    } else {
      // If the click was incorrect, reset the sequence
      this.resetSequence(currentLevel);
      return false; // Return false if the click was incorrect
    }
  }

  // Check if the sequence is completed
  isSequenceCompleted() {
    return this.sequenceIndex >= this.sequence.length;
  }

  // Reset the sequence
  resetSequence(level) {
    this.sequenceIndex = 0;
    this.generateSequence(level === 3 ? 6 : 4); // Longer sequence for level 3
  }

  // Reset the square to its initial state
  reset() {
    this.size = 50;
    this.x = this.initialX;
    this.y = this.initialY;
    this.isMoving = false;
    this.resetSequence(1); // Reset to level 1 sequence
  }
}

export { Square };