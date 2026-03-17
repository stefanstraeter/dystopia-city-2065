let canvas;
let world;
let keyboard = new Keyboard();

function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
}

function handleKeyboard(keyCode, isPressed) {
    if (keyCode == 32) keyboard.KEY_SPACE = isPressed;
    if (keyCode == 37) keyboard.KEY_LEFT = isPressed;
    if (keyCode == 38) keyboard.KEY_UP = isPressed;
    if (keyCode == 39) keyboard.KEY_RIGHT = isPressed;
    if (keyCode == 40) keyboard.KEY_DOWN = isPressed;
    if (keyCode == 88) keyboard.KEY_X = isPressed;
}

document.addEventListener('keydown', (event) => {
    handleKeyboard(event.keyCode, true);
});

document.addEventListener('keyup', (event) => {
    handleKeyboard(event.keyCode, false);
});

document.addEventListener('DOMContentLoaded', init);