class Angel {
    constructor() {
        this.size = 100;
        this.shrinkRate = 1.5;
        this.isComplete = false;
    }

    reset() { this.size = 100; this.isComplete = false; }
    update() { this.size -= this.shrinkRate; if (this.size <= 0) this.isComplete = true; }
    display() {
        fill('#00f7c1');
        // Head
        ellipse(width / 2, height / 2 - this.size / 2, this.size / 2);
        // Body
        triangle(width / 2, height / 2, width / 2 - this.size / 2, height / 2 + this.size, width / 2 + this.size / 2, height / 2 + this.size);
        // Wings
        ellipse(width / 2 - this.size, height / 2, this.size);
        ellipse(width / 2 + this.size, height / 2, this.size);
    }

    handleInteraction(x, y) { this.size += 20; }
    isPhaseComplete() { return this.isComplete; }
}
