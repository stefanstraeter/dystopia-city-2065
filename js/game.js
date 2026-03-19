let canvas;
let world;
let keyboard = new Keyboard();

function init() {
    canvas = document.getElementById('canvas');
    canvas.addEventListener('mousedown', (event) => { if (event.button === 0) keyboard.LEFT_CLICK = true; });
    canvas.addEventListener('mouseup', (event) => { if (event.button === 0) keyboard.LEFT_CLICK = false; });

    resizeGame();
    world = new World(canvas, keyboard);
}

function resizeGame() {
    if (!canvas) return;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const maxWidth = 800;
    const maxHeight = 450;
    const targetRatio = maxWidth / maxHeight;

    let availableWidth = windowWidth * 0.9;
    let availableHeight = windowHeight * 0.9;
    let newWidth, newHeight;

    if (availableWidth / availableHeight > targetRatio) {
        newHeight = Math.min(availableHeight, maxHeight);
        newWidth = newHeight * targetRatio;
    } else {
        newWidth = Math.min(availableWidth, maxWidth);
        newHeight = newWidth / targetRatio;
    }

    canvas.style.width = `${newWidth}px`;
    canvas.style.height = `${newHeight}px`;
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        canvas.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

function handleKeyboard(keyCode, isPressed) {
    if (keyCode == 32) keyboard.KEY_SPACE = isPressed;
    if (keyCode == 37) keyboard.KEY_LEFT = isPressed;
    if (keyCode == 38) keyboard.KEY_UP = isPressed;
    if (keyCode == 39) keyboard.KEY_RIGHT = isPressed;
    if (keyCode == 40) keyboard.KEY_DOWN = isPressed;
    if (keyCode == 88) keyboard.KEY_X = isPressed;
    if (keyCode == 13) keyboard.KEY_ENTER = isPressed;
    if (keyCode == 72) keyboard.KEY_H = isPressed;
}

window.addEventListener('resize', resizeGame);

document.addEventListener('keydown', (event) => {
    handleKeyboard(event.keyCode, true);
});

document.addEventListener('keyup', (event) => {
    handleKeyboard(event.keyCode, false);
});

document.addEventListener('DOMContentLoaded', init);