class ShapeManager {
    constructor() {
        this.shapes = [
            new Circle(), new Heart(), new Triangle(),
            new Square(), new Kite(), new Trapezoid(),
            new CrescentMoon(), new Pentagon(), new Octagon(),
            new Arrow()
        ];
        this.unlockableShapes = [new Snowflake(), new Feather(), new Butterfly(), new Hourglass(), new Angel()];
        this.currentShapeIndex = 0;
    }

    getCurrentShape() {
        return this.shapes[this.currentShapeIndex];
    }

    nextShape() {
        this.currentShapeIndex++;
        if (this.currentShapeIndex >= this.shapes.length) {
            this.currentShapeIndex = 0;
        }
    }

    unlockShape(index) {
        this.shapes.push(this.unlockableShapes[index]);
    }
}
