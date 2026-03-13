let world;
const canvas = document.getElementById("canvas");

/**
 * Initializes core systems of the game.
 * Sets up audio handling and fullscreen event listeners.
 */
function init() {
    AudioHub.initAudioHub();
    initFullscreenListner();
    
}

/**
 * Starts the game.
 * Creates the world, loads the level and starts the game music.
 */
function startGame() {
    IntervalHub.stopIntervals();
    const level = levelInit();
    world = new World(canvas, level);
    AudioHub.playOne(AudioHub.GAME_MUSIC, true);
    AudioHub.playOne(AudioHub.RUN_START_SOUND);
    uiStartGame();
}

