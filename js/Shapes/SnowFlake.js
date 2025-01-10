class Snowflake {
    constructor() {
        this.size = 100;
        this.shrinkRate = 2;
        this.isComplete = false;
        this.targetSnowflake = floor(random(3)); 
    }

    reset() { this.size = 100; this.isComplete = false; this.targetSnowflake = floor(random(3)); }
    update() { this.size -= this.shrinkRate; if (this.size <= 0) this.isComplete = true; }
    display() {
        fill('#00f7c1');
        for (let i = 0; i < 3; i++) {
            circle(width / 2 + (i * 50 - 50), height / 2, this.size);
        }
    }
    handleInteraction(x, y) {
        if (dist(x, y, width / 2 + (this.targetSnowflake * 50 - 50), height / 2) < this.size / 2) {
            this.size += 20;
        }
    }
    isPhaseComplete() { return this.isComplete; }
}
