class Hourglass {
    constructor() {
        this.sandAmount = 100;
        this.shrinkRate = 2;
        this.isComplete = false;
    }

    reset() { this.sandAmount = 100; this.isComplete = false; }
    update() { this.sandAmount -= this.shrinkRate; if (this.sandAmount <= 0) this.isComplete = true; }
    display() {
        fill('#00f7c1');
        triangle(width / 2, height / 2 - this.sandAmount, width / 2 - 30, height / 2, width / 2 + 30, height / 2);
        triangle(width / 2, height / 2 + this.sandAmount, width / 2 - 30, height / 2, width / 2 + 30, height / 2);
    }
    handleInteraction(x, y) { this.sandAmount += 20; }
    isPhaseComplete() { return this.isComplete; }
}
