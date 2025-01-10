class Triangle {
    constructor() {
        this.shrinkRate = 2;
        this.size = 150;
        this.isComplete = false;
    }

    reset() {
        this.size = 150;
        this.isComplete = false;
    }

    update() {
        this.size -= this.shrinkRate;
        if (this.size <= 0) {
            this.isComplete = true;
        }
    }

    display() {
        fill('#00f7c1');
        triangle(
            width / 2, height / 2 - this.size / 2,
            width / 2 - this.size / 2, height / 2 + this.size / 2,
            width / 2 + this.size / 2, height / 2 + this.size / 2
        );
    }

    handleInteraction(x, y) {
        this.size += 20;  
    }

    isPhaseComplete() {
        return this.isComplete;
    }
}
