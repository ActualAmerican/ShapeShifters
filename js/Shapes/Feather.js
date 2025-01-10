class Feather {
    constructor() {
        this.size = 100;
        this.shrinkRate = 1.2;
        this.isComplete = false;
        this.feathers = [{ x: width / 2, y: 0 }];
    }

    reset() {
        this.size = 100;
        this.isComplete = false;
        this.feathers = [{ x: width / 2, y: 0 }];
    }

    update() {
        for (let feather of this.feathers) {
            feather.y += this.shrinkRate;
            if (feather.y > height) this.isComplete = true;
        }
    }

    display() {
        fill('#00f7c1');
        for (let feather of this.feathers) {
            ellipse(feather.x, feather.y, this.size / 4, this.size);
        }
    }

    handleInteraction(x, y) {
        this.feathers.push({ x: random(width / 4, (3 * width) / 4), y: 0 });
    }

    isPhaseComplete() { return this.isComplete; }
}
