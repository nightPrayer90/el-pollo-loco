let world;
const canvas = document.getElementById("canvas");


function init() {
    AudioHub.initAudioHub();
    initFullscreenListner();
    
}

function startGame() {
    IntervalHub.stopIntervals();
    const level = levelInit();
    world = new World(canvas, level);
    AudioHub.playOne(AudioHub.GAME_MUSIC, true);
    uiStartGame();
}

