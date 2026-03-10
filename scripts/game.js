let canvas;
let world;
//let keyboard = new Keyboard();
let level = level1;

function init() {
    canvas = document.getElementById("canvas");
    world = new World(canvas, level);
}

