let canvas;
let world;
let keyboard = new Keyboard();

async function init() {
    canvas = document.getElementById('canvas');
    if (!canvas) return;

    setupInputListeners();
    bindMobileEvents();
    resizeGame();

    await Promise.all([
        document.fonts.ready,
        preloadAssets()
    ]);

    world = new World(canvas, keyboard);

    window.addEventListener('mousedown', startInitialAudio, { once: true });
    window.addEventListener('touchstart', startInitialAudio, { once: true });
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

function initMobileControls() {
    const btnMap = {
        'btn-left': 'KEY_LEFT',
        'btn-right': 'KEY_RIGHT',
        'btn-jump': 'KEY_UP',
        'btn-shoot': 'KEY_SPACE',
        'btn-mission': 'KEY_M',
        'btn-controls': 'KEY_C'
    };

    Object.keys(btnMap).forEach(id => {
        const element = document.getElementById(id);
        const key = btnMap[id];

        element.addEventListener('touchstart', (e) => {
            e.preventDefault();
            keyboard[key] = true;
        }, { passive: false });

        element.addEventListener('touchend', (e) => {
            e.preventDefault();
            keyboard[key] = false;
        }, { passive: false });
        element.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            keyboard[key] = false;
        }, { passive: false });
    });

}


function bindMobileEvents() {
    const controls = document.querySelector('.mobile-controls-overlay');
    if (window.getComputedStyle(controls).display !== 'none') {
        initMobileControls();
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
    let container = document.querySelector('.game-container');
    if (!document.fullscreenElement) {
        container.requestFullscreen().catch(err => {
            console.error("Fullscreen failed:", err);
        });
    } else {
        document.exitFullscreen();
    }
}

document.addEventListener('DOMContentLoaded', init);