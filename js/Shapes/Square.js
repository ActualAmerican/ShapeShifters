class Square {
    constructor() {
        this.size = 100;
        this.shrinkRate = 2;
        this.isComplete = false;
    }

    reset() {
        this.size = 100;
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
        rectMode(CENTER);
        rect(width / 2, height / 2, this.size, this.size);
    }

    handleInteraction(x, y) {
        if (
            x > width / 2 - this.size / 2 &&
            x < width / 2 + this.size / 2 &&
            y > height / 2 - this.size / 2 &&
            y < height / 2 + this.size / 2
        ) {
            this.size += 20;
        }
    }

    isPhaseComplete() {
        return this.isComplete;
    }
}
