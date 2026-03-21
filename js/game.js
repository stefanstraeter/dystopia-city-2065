const byteBounce = new FontFace('ByteBounce', 'url(./assets/fonts/ByteBounce.woff2)');
const cyberwayRiders = new FontFace('CyberwayRiders', 'url(./assets/fonts/CyberwayRiders.woff2)');
const IS_MOBILE = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

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
    resizeGame();

    await loadFonts();
    await loadInitialAssets();

    world = new World(canvas, keyboard);
    setupMobile();

    window.addEventListener('keydown', () => {
        if (world && !world.gameState.gameStarted) {
            world.audioManager.unlockAudio();
        }
    }, { once: true });
}

function setupMobile() {
    if (typeof MobileControls !== 'undefined') {
        MobileControls.init(keyboard);
    }
}

function setupInput() {
    canvas.addEventListener('pointerdown', (e) => {
        keyboard.LEFT_CLICK = true;
    });
    canvas.addEventListener('pointerup', () => {
        keyboard.LEFT_CLICK = false;
    });
    canvas.addEventListener('touchstart', (e) => {
        keyboard.LEFT_CLICK = true;
    }, { passive: false });

    canvas.addEventListener('touchend', () => {
        keyboard.LEFT_CLICK = false;
    });
    window.addEventListener('keydown', (e) => handleKeyboard(e.code, true));
    window.addEventListener('keyup', (e) => handleKeyboard(e.code, false));
    window.addEventListener('resize', resizeGame);
}

function toggleMouseClick(event, isPressed) {
    if (event.button === 0) keyboard.LEFT_CLICK = isPressed;
}

async function loadInitialAssets() {
    await Promise.all([
        document.fonts.ready,
        typeof preloadAssets === 'function' ? preloadAssets() : Promise.resolve()
    ]);
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

async function startInitialAudio() {
    if (world && world.audioManager) {
        const am = world.audioManager;
        if (am.context && am.context.state === 'suspended') {
            await am.context.resume();
        }

        try {
            await am.play('background');
        } catch (err) {
        }
    }
}

async function loadFonts() {
    try {
        const byteBounce = new FontFace('ByteBounce', 'url(./assets/fonts/ByteBounce.woff2)');
        const cyberwayRiders = new FontFace('CyberwayRiders', 'url(./assets/fonts/CyberwayRiders.woff2)');
        const fonts = await Promise.all([byteBounce.load(), cyberwayRiders.load()]);
        fonts.forEach(font => document.fonts.add(font));
    } catch (err) {
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
        if (container.requestFullscreen) {
            container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
            container.webkitRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
}

function unlockAudio() {
    if (world && world.audioManager) {
        if (world.audioManager.context && world.audioManager.context.state === 'suspended') {
            world.audioManager.context.resume();
        }
        const playPromise = world.audioManager.play('background');
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(err => {
            });
        }
    }
}

function setupInput() {
    canvas.addEventListener('mousedown', (e) => toggleMouseClick(e, true));
    canvas.addEventListener('mouseup', (e) => toggleMouseClick(e, false));
    canvas.addEventListener('touchstart', (e) => {
        keyboard.LEFT_CLICK = true;
    }, { passive: false });
    canvas.addEventListener('touchend', () => {
        keyboard.LEFT_CLICK = false;
    });
    window.addEventListener('keydown', (e) => handleKeyboard(e.code, true));
    window.addEventListener('keyup', (e) => handleKeyboard(e.code, false));
    window.addEventListener('resize', resizeGame);
}

window.addEventListener('load', init);