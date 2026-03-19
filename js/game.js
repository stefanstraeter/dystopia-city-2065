let canvas;
let world;
let keyboard = new Keyboard();

function init() {
    canvas = document.getElementById('canvas');
    if (!canvas) return;

    setupInputListeners();
    resizeGame();

    document.fonts.ready.then(() => {
        world = new World(canvas, keyboard);
        window.addEventListener('mousedown', startInitialAudio, { once: true });
        window.addEventListener('keydown', startInitialAudio, { once: true });
    });
}

function setupInputListeners() {
    canvas.addEventListener('mousedown', (e) => {
        if (e.button === 0) keyboard.LEFT_CLICK = true;
    });
    canvas.addEventListener('mouseup', (e) => {
        if (e.button === 0) keyboard.LEFT_CLICK = false;
    });

    window.addEventListener('keydown', (e) => handleKeyboard(e.code, true));
    window.addEventListener('keyup', (e) => handleKeyboard(e.code, false));
    window.addEventListener('resize', resizeGame);
}

function handleKeyboard(code, isPressed) {
    const keyMap = {
        'ArrowLeft': 'KEY_LEFT',
        'ArrowRight': 'KEY_RIGHT',
        'ArrowUp': 'KEY_UP',
        'ArrowDown': 'KEY_DOWN',
        'Space': 'KEY_SPACE',
        'Enter': 'KEY_ENTER',
        'KeyH': 'KEY_H'
    };

    if (keyMap[code]) {
        keyboard[keyMap[code]] = isPressed;
    }
}

function startInitialAudio() {
    if (world && world.audioManager) {
        world.audioManager.play('background');
    }
}

function resizeGame() {
    if (!canvas) return;

    const maxWidth = 800;
    const maxHeight = 450;
    const targetRatio = maxWidth / maxHeight;

    let newWidth = window.innerWidth * 0.9;
    let newHeight = newWidth / targetRatio;

    if (newHeight > window.innerHeight * 0.9) {
        newHeight = window.innerHeight * 0.9;
        newWidth = newHeight * targetRatio;
    }

    newWidth = Math.min(newWidth, maxWidth);
    newHeight = Math.min(newHeight, maxHeight);

    canvas.style.width = `${newWidth}px`;
    canvas.style.height = `${newHeight}px`;
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        canvas.requestFullscreen().catch(err => {
            console.error(err.message);
        });
    } else {
        document.exitFullscreen();
    }
}

document.addEventListener('DOMContentLoaded', init);