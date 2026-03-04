let canvas;
let world;
let keyboard = new Keyboard();
let level = level1;

function init() {
    canvas = document.getElementById("canvas");
    world = new World(canvas, keyboard, level);
    // ctx = canvas.getContext("2d");

    console.log("my character is", world.character);
}

window.addEventListener("keydown", (e) => {
    if (e.keyCode == 39) {
        keyboard.RIGHT = true;
    }

    if (e.keyCode == 37) {
        keyboard.LEFT = true;
    }

    if (e.keyCode == 38) {
        keyboard.UP = true;
    }

    if (e.keyCode == 40) {
        keyboard.DOWN = true;
    }

    if (e.keyCode == 32) {
        keyboard.SPACE = true;
    }
});

// TODO: SWITCH!!! _> keycode? lagacy
window.addEventListener("keyup", (e) => {
    console.log(e);
    if (e.keyCode == 39) {
        keyboard.RIGHT = false;
    }

    if (e.keyCode == 37) {
        keyboard.LEFT = false;
    }

    if (e.keyCode == 38) {
        keyboard.UP = false;
    }

    if (e.keyCode == 40) {
        keyboard.DOWN = false;
    }
    
    if (e.keyCode == 32) {
        keyboard.SPACE = false;
    }
});