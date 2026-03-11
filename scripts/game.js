let world;
const canvas = document.getElementById("canvas");
//let keyboard = new Keyboard();

function init() {
    // hierüber lässt sich das spiel starten! -> können wir auf einen overlay button legen
    AudioHub.initAudioHub();
}

function startGame() {
    IntervalHub.stopIntervals();

    document.activeElement.blur();
    const level = levelInit();
    world = new World(canvas, level);
    AudioHub.playOne(AudioHub.GAME_MUSIC);
    uiStartGame();
}

