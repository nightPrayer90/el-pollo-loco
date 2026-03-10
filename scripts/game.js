let canvas;
let world;
//let keyboard = new Keyboard();

function init() {
    canvas = document.getElementById("canvas");
    
    // hierüber lässt sich das spiel starten! -> können wir auf einen overlay button legen
    const level = levelInit();
    world = new World(canvas, level);
}

