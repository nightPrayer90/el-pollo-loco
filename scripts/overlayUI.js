import { AudioHub } from "./manager-classes/audio-hub.js";

let isFullscreenMode = false;
const fullscreeBtnRef = document.getElementById("fullscreenBtn");
const fullscreenRef = document.getElementById("fullscreen");
const fullscreenBtnImageRef = document.getElementById("fullscreen-btn-image");
const mainMenuRef = document.getElementById("overlay-main-menu");
const ingameUIRef = document.getElementById("overlay-UI");
const mobileControlsRef = document.getElementById("mobile-controls");
const muteBtnImageRef = document.getElementById("mute-btn-image");
const exitBtnRef = document.getElementById("closefullscreenBtn");
const impressumBtn = document.getElementById("impressumBtn");

// https://dev.to/niorad/detecting-hover-and-touch-in-css-and-js-4e42

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
}

/**
 * Shows the main menu and hides the in-game UI.
 */
function uiMainMenu() {
    changeClass(mainMenuRef, "hide-object", false);
    changeClass(ingameUIRef, "hide-object", true);

    if (isFullscreenMode) 
        changeClass(exitBtnRef, "hide-object", false);
    else 
        changeClass(exitBtnRef, "hide-object", true);
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

function openImpressum() {
    window.location.href = "impressum.html";
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
    fullscreeBtnRef.addEventListener("click", toggleFullscreen);
    exitBtnRef.addEventListener("click", pressExitBtn);
    impressumBtn.addEventListener("click", openImpressum);

    document.addEventListener("fullscreenchange", () => {
        if (document.fullscreenElement) {
            isFullscreenMode = true;
            toggleFullscreenBtnSprite();
        } else {
            isFullscreenMode = false;
            changeClass(exitBtnRef, "hide-object", true);
            toggleFullscreenBtnSprite();
        }
    });
}

/**
 * Close Fullscreen and Hide Exit btn after click.
 */
function pressExitBtn() {
    isFullscreenMode = false;
    changeClass(exitBtnRef, "hide-object", true);
    exitFullscreen();
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
    if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitFullscreenElement && document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
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