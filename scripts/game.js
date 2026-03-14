import { initFullscreenListner, toggleFullscreen } from "./fullscreen.js";
import { levelInit } from "./levels/level1.js";
import { AudioHub } from "./manager-classes/audio-hub.js";
import { IntervalHub } from "./manager-classes/interval-hub.js";
import { World } from "./models/world.class.js";
import { toggleMuteBtn, uiStartGame } from "./overlayUI.js";

let world;
const canvas = document.getElementById("canvas");
init();

/**
 * Initializes core systems of the game.
 * Sets up audio handling and fullscreen event listeners.
 */
function init() {
    AudioHub.initAudioHub();
    initFullscreenListner();
    document.getElementById("startBtn").addEventListener("click", startGame);
    document.getElementById("fullscreenBtn").addEventListener("click", toggleFullscreen);
    document.getElementById("muteBtn").addEventListener("click", toggleMuteBtn);
    document.getElementById("volumeSlider").addEventListener("input", AudioHub.objSetVolume);
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