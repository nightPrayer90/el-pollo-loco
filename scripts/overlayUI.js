import { AudioHub } from "./manager-classes/audio-hub.js";

let isFullscreenMode = false;
const fullscreenRef = document.getElementById("fullscreen");
const fullscreenBtnImageRef = document.getElementById("fullscreen-btn-image");
const mainMenuRef = document.getElementById("overlay-main-menu");
const ingameUIRef = document.getElementById("overlay-UI");
const mobileControlsRef = document.getElementById("mobile-controls");
const muteBtnImageRef = document.getElementById("mute-btn-image");
// https://dev.to/niorad/detecting-hover-and-touch-in-css-and-js-4e42
const isMobile = !window.matchMedia("(hover: hover)").matches;


//#region UI
/**
 * Switches the UI from main menu to in-game state.
 * Hides the main menu and enables the in-game UI.
 */
export function uiStartGame() {
    changeClass(mainMenuRef, "hide-object", true);
    changeClass(ingameUIRef, "hide-object", false);

    toggleMuteBtnSprite();
    showMobileOverlay();
    
    if (isMobile == true) {
        isFullscreenMode = true;
        enterFullscreen();
    }
}

/**
 * Shows the main menu and hides the in-game UI.
 */
export function uiMainMenu() {
    changeClass(mainMenuRef, "hide-object", false);
    changeClass(ingameUIRef, "hide-object", true);

    if (isMobile == true) {
        isFullscreenMode = false;
        exitFullscreen();
    }
}

/**
 * Shows the main menu after the game ends and stops the game music.
 */
export function showBackToMenuBtn() {
    uiMainMenu();
    AudioHub.stopOne(AudioHub.GAME_MUSIC);
}

/**
 * Displays mobile control buttons.
 */
function showMobileOverlay() {
    changeClass(mobileControlsRef, "hide-object", false);
}

/**
 * Toggles the audio mute state.
 */
export function toggleMuteBtn() {
    AudioHub.toggleSound(); 
    toggleMuteBtnSprite();
}

/**
 * Updates the mute button sprite depending on the audio state.
 */
function toggleMuteBtnSprite() {
    if (AudioHub.ISSOUND_MUTE) {
        muteBtnImageRef.src = "./assets/img/13_icons/mute-icon.png";
    } else {
        muteBtnImageRef.src = "./assets/img/13_icons/unmute-icon.png";
    }
}

/**
 * Adds or removes a CSS class from an element.
 * @param {HTMLElement} elementRef - Reference to the DOM element.
 * @param {string} className - CSS class name.
 * @param {boolean} control - True to add the class, false to remove it.
 */
function changeClass(elementRef, className, control) {
    switch (control) {
        case true:
            elementRef.classList.add(className);
            break;
        case false:
            elementRef.classList.remove(className);
            break;
    }
}
//#endregion

//#region  Fullscreen
/**
 * Initializes the fullscreen change listener.
 * This keeps the internal fullscreen state in sync when the user exits
 * fullscreen using ESC or browser controls.
 *  https://developer.mozilla.org/en-US/docs/Web/API/Document/fullscreenchange_event
 */
export function initFullscreenListner() {
    document.getElementById("fullscreenBtn").addEventListener("click", toggleFullscreen);

    document.addEventListener("fullscreenchange", () => {
        if (document.fullscreenElement) {
            isFullscreenMode = true;
            toggleFullscreenBtnSprite(isFullscreenMode);
        } else {
            isFullscreenMode = false;
            toggleFullscreenBtnSprite(isFullscreenMode);
        }
    });
}

/**
 * Toggles fullscreen mode.
 */
function toggleFullscreen() {
    isFullscreenMode = !isFullscreenMode;
    if (isFullscreenMode) {
        enterFullscreen();
    } else {
        exitFullscreen();
    }
}

/**
 * Requests fullscreen mode for the game container.
 */
function enterFullscreen() {
    if (fullscreenRef.requestFullscreen) {
        fullscreenRef.requestFullscreen();
    } else if (fullscreenRef.msRequestFullscreen) {
        fullscreenRef.requestFullscreen();
    } else if (fullscreenRef.webkitRequestFullscreen) {
        fullscreenRef.webkitRequestFullscreen();
    }
}

/**
 * Exits fullscreen mode.
 */
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitRequestFullscreen) {
        document.webkitExitFullscreen();
    }0
}

/**
 * Updates the fullscreen button icon depending on the current fullscreen state.
 */
function toggleFullscreenBtnSprite() {
    if (!isFullscreenMode) {
        fullscreenBtnImageRef.src = "./assets/img/13_icons/fullscreen-open.png";
    } else {
        fullscreenBtnImageRef.src = "./assets/img/13_icons/fullscreen-close.png";
    }
}
//#endregion