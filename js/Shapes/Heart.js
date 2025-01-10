class Heart {
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
        vertex(width / 2, height / 2 - this.size / 4);
        bezierVertex(width / 2 + this.size / 2, height / 2 - this.size / 2, width / 2 + this.size / 2, height / 2 + this.size / 2, width / 2, height / 2 + this.size);
        bezierVertex(width / 2 - this.size / 2, height / 2 + this.size / 2, width / 2 - this.size / 2, height / 2 - this.size / 2, width / 2, height / 2 - this.size / 4);
        endShape(CLOSE);
    }
    handleInteraction(x, y) { this.size += 20; }
    isPhaseComplete() { return this.isComplete; }
}
