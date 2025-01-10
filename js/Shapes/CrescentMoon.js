class CrescentMoon {
    constructor() {
        this.radius = 100;
        this.shrinkRate = 1.5;
        this.isComplete = false;
    }

    reset() { this.radius = 100; this.isComplete = false; }
    update() { this.radius -= this.shrinkRate; if (this.radius <= 0) this.isComplete = true; }
    display() {
        fill('#00f7c1');
        arc(width / 2, height / 2, this.radius, this.radius, PI / 4, PI + PI / 4);
    }
    handleInteraction(x, y) { this.radius += 20; }
    isPhaseComplete() { return this.isComplete; }
}
