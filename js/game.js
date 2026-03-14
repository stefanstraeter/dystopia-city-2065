let canvas;
let world;
let keyboard = new Keyboard();

function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
};

document.addEventListener('keydown', (event) => {
    if (event.keyCode == 32) {
        keyboard.KEY_SPACE = true;
    }
    if (event.keyCode == 37) {
        keyboard.KEY_LEFT = true;
    }
    if (event.keyCode == 38) {
        keyboard.KEY_UP = true;
    }
    if (event.keyCode == 39) {
        keyboard.KEY_RIGHT = true;
    }
    if (event.keyCode == 40) {
        keyboard.KEY_DOWN = true;
    }
    console.log(event);
});

document.addEventListener('keyup', (event) => {
    if (event.keyCode == 32) {
        keyboard.KEY_SPACE = false;
    }
    if (event.keyCode == 37) {
        keyboard.KEY_LEFT = false;
    }
    if (event.keyCode == 38) {
        keyboard.KEY_UP = false;
    }
    if (event.keyCode == 39) {
        keyboard.KEY_RIGHT = false;
    }
    if (event.keyCode == 40) {
        keyboard.KEY_DOWN = false;
    }
    console.log(event);
});


document.addEventListener('DOMContentLoaded', init);