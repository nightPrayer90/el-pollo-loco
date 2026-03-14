const mainMenuRef = document.getElementById("overlay-main-menu");
const ingameUIRef = document.getElementById("overlay-UI");
const mobileControlsRef = document.getElementById("mobile-controls");
const muteBtnImageRef = document.getElementById("mute-btn-image");
const fullscreenBtnImageRef = document.getElementById("fullscreen-btn-image");


/**
 * Switches the UI from main menu to in-game state.
 * Hides the main menu and enables the in-game UI.
 */
function uiStartGame(){
    changeClass(mainMenuRef, "hide-object", true);
    changeClass(ingameUIRef, "hide-object", false);

    toggleMuteBtnSprite()
    showMobileOverlay();
}

/**
 * Shows the main menu and hides the in-game UI.
 */
function uiMainMenu(){
    changeClass(mainMenuRef, "hide-object", false);
    changeClass(ingameUIRef, "hide-object", true);
}

/**
 * Displays mobile control buttons.
 */
function showMobileOverlay(){
    changeClass(mobileControlsRef, "hide-object", false);
}

/**
 * Updates the mute button sprite depending on the audio state.
 */
function toggleMuteBtnSprite() {
    if(AudioHub.ISSOUND_MUTE) {
        muteBtnImageRef.src = "./assets/img/13_icons/mute-icon.png";
    }
    else {
        muteBtnImageRef.src = "./assets/img/13_icons/unmute-icon.png";
    }

}



/**
 * Updates the fullscreen button icon depending on the current fullscreen state.
 */
function toggleFullscreenBtnSprite(){
    if (!isFullscreenMode) {
        fullscreenBtnImageRef.src ="./assets/img/13_icons/fullscreen-open.png"
    }
    else{
        fullscreenBtnImageRef.src ="./assets/img/13_icons/fullscreen-close.png"
    }
}

/**
 * Shows the main menu after the game ends and stops the game music.
 */
function showBackToMenuBtn() {
    uiMainMenu();
    AudioHub.stopOne(AudioHub.GAME_MUSIC);
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
