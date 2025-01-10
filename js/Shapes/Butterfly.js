class Butterfly {
    constructor() {
        this.wingSize = 100;
        this.shrinkRate = 1.2;
        this.isComplete = false;
    }

    reset() { this.wingSize = 100; this.isComplete = false; }
    update() { this.wingSize -= this.shrinkRate; if (this.wingSize <= 0) this.isComplete = true; }
    display() {
        fill('#00f7c1');
        ellipse(width / 2 - this.wingSize / 2, height / 2, this.wingSize);
        ellipse(width / 2 + this.wingSize / 2, height / 2, this.wingSize);
    }
    handleInteraction(x, y) { this.wingSize += 20; }
    isPhaseComplete() { return this.isComplete; }
}
