export default class Circle {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = '#FF0000'; // Changed color for visibility
  }

  draw(ctx) {
    console.log("🎨 Drawing Circle at", this.x, this.y);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}
