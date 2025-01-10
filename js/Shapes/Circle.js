class Circle {
    constructor() {
        this.radius = 100;
        this.shrinkRate = 1.5;
        this.isComplete = false;
    }

    reset() {
        this.radius = 100;
        this.isComplete = false;
    }

    update() {
        this.radius -= this.shrinkRate;
        if (this.radius <= 0) {
            this.isComplete = true; 
        }
    }

    display() {
        fill('#00f7c1');
        circle(width / 2, height / 2, this.radius);
    }

    handleInteraction(x, y) {
        if (dist(x, y, width / 2, height / 2) < this.radius / 2) {
            this.radius += 20;  
        }
    }

    isPhaseComplete() {
        return this.isComplete;
    }
}
