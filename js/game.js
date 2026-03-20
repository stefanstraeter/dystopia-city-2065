const GAME_CONFIG = {
    MAX_WIDTH: 800,
    MAX_HEIGHT: 450,
    TARGET_RATIO: 800 / 450,
    SCREEN_MARGIN: 0.9
};

let canvas;
let world;
let keyboard = new Keyboard();

async function init() {
    canvas = document.getElementById('canvas');
    if (!canvas) return;

    setupInput();
    setupMobile();
    resizeGame();

    await loadInitialAssets();

    world = new World(canvas, keyboard);
    setupAudioTrigger();
}


function setupInput() {
    canvas.addEventListener('mousedown', (e) => toggleMouseClick(e, true));
    canvas.addEventListener('mouseup', (e) => toggleMouseClick(e, false));

    window.addEventListener('keydown', (e) => handleKeyboard(e.code, true));
    window.addEventListener('keyup', (e) => handleKeyboard(e.code, false));

    window.addEventListener('resize', resizeGame);
}

function toggleMouseClick(event, isPressed) {
    if (event.button === 0) keyboard.LEFT_CLICK = isPressed;
}

function setupMobile() {
    if (typeof MobileControls !== 'undefined') {
        MobileControls.init();
    }
}

async function loadInitialAssets() {
    await Promise.all([
        document.fonts.ready,
        preloadAssets()
    ]);
}

function setupAudioTrigger() {
    const startAudio = () => startInitialAudio();
    window.addEventListener('mousedown', startAudio, { once: true });
    window.addEventListener('touchstart', startAudio, { once: true });
    window.addEventListener('keydown', startAudio, { once: true });
}

function handleKeyboard(code, isPressed) {
    const keyMap = {
        'ArrowLeft': 'KEY_LEFT',
        'ArrowRight': 'KEY_RIGHT',
        'ArrowUp': 'KEY_UP',
        'ArrowDown': 'KEY_DOWN',
        'Space': 'KEY_SPACE',
        'Enter': 'KEY_ENTER',
        'KeyM': 'KEY_M',
        'KeyC': 'KEY_C'
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

    let newWidth = window.innerWidth * GAME_CONFIG.SCREEN_MARGIN;
    let newHeight = newWidth / GAME_CONFIG.TARGET_RATIO;

    if (newHeight > window.innerHeight * GAME_CONFIG.SCREEN_MARGIN) {
        newHeight = window.innerHeight * GAME_CONFIG.SCREEN_MARGIN;
        newWidth = newHeight * GAME_CONFIG.TARGET_RATIO;
    }

    newWidth = Math.min(newWidth, GAME_CONFIG.MAX_WIDTH);
    newHeight = Math.min(newHeight, GAME_CONFIG.MAX_HEIGHT);

    canvas.style.width = `${newWidth}px`;
    canvas.style.height = `${newHeight}px`;
}

function toggleFullscreen() {
    const container = document.querySelector('.game-container');
    const isFS = document.fullscreenElement || document.webkitFullscreenElement;

    if (!isFS) {
        if (container.requestFullscreen) container.requestFullscreen();
        else if (container.webkitRequestFullscreen) container.webkitRequestFullscreen();
    } else {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    }
}

document.addEventListener('DOMContentLoaded', init);