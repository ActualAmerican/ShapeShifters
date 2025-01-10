// src/main.js

// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Shape list (default and unlockable)
const shapes = ['circle', 'heart', 'triangle', 'square', 'kite', 'trapezoid', 'crescentMoon', 'pentagon', 'octagon', 'arrow', 'snowflake', 'butterfly', 'feather', 'hourglass', 'angel'];
let currentShapeIndex = 0;
let shapeSize = 200;
let shrinking = true;

// Function to draw shapes
function drawShape(shape) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.fillStyle = '#00f7c1';

    switch (shape) {
        case 'circle':
            ctx.arc(canvas.width / 2, canvas.height / 2, shapeSize, 0, Math.PI * 2);
            break;
        case 'square':
            ctx.rect(canvas.width / 2 - shapeSize / 2, canvas.height / 2 - shapeSize / 2, shapeSize, shapeSize);
            break;
        case 'triangle':
            ctx.moveTo(canvas.width / 2, canvas.height / 2 - shapeSize);
            ctx.lineTo(canvas.width / 2 - shapeSize, canvas.height / 2 + shapeSize);
            ctx.lineTo(canvas.width / 2 + shapeSize, canvas.height / 2 + shapeSize);
            break;
        // Additional shapes (simplified versions)
        case 'trapezoid':
            ctx.moveTo(canvas.width / 2 - shapeSize, canvas.height / 2 + shapeSize / 2);
            ctx.lineTo(canvas.width / 2 + shapeSize, canvas.height / 2 + shapeSize / 2);
            ctx.lineTo(canvas.width / 2 + shapeSize / 2, canvas.height / 2 - shapeSize / 2);
            ctx.lineTo(canvas.width / 2 - shapeSize / 2, canvas.height / 2 - shapeSize / 2);
            break;
        case 'pentagon':
            for (let i = 0; i < 5; i++) {
                let angle = Math.PI * 2 * (i / 5) - Math.PI / 2;
                ctx.lineTo(canvas.width / 2 + Math.cos(angle) * shapeSize, canvas.height / 2 + Math.sin(angle) * shapeSize);
            }
            break;
        case 'octagon':
            for (let i = 0; i < 8; i++) {
                let angle = Math.PI * 2 * (i / 8) - Math.PI / 8;
                ctx.lineTo(canvas.width / 2 + Math.cos(angle) * shapeSize, canvas.height / 2 + Math.sin(angle) * shapeSize);
            }
            break;
        default:
            console.log('Shape not implemented yet');
            break;
    }
    ctx.closePath();
    ctx.fill();
}

// Main game loop
function gameLoop() {
    if (shrinking) {
        shapeSize -= 1;
        if (shapeSize <= 50) shrinking = false;
    } else {
        shapeSize += 1;
        if (shapeSize >= 200) shrinking = true;
    }

    drawShape(shapes[currentShapeIndex]);
    requestAnimationFrame(gameLoop);
}

// Cycle shapes on click
canvas.addEventListener('click', () => {
    currentShapeIndex = (currentShapeIndex + 1) % shapes.length;
    shapeSize = 200;
    shrinking = true;
});

gameLoop();
