class Pentagon {
    constructor() {
        this.size = 100;
        this.shrinkRate = 1.5;
        this.isComplete = false;
    }

    reset() { this.size = 100; this.isComplete = false; }
    update() { this.size -= this.shrinkRate; if (this.size <= 0) this.isComplete = true; }
    display() {
        fill('#00f7c1');
        beginShape();
        for (let i = 0; i < 5; i++) {
            let angle = TWO_PI * i / 5 - HALF_PI;
            vertex(width / 2 + cos(angle) * this.size, height / 2 + sin(angle) * this.size);
        }
        endShape(CLOSE);
    }
    handleInteraction(x, y) { this.size += 20; }
    isPhaseComplete() { return this.isComplete; }
}
