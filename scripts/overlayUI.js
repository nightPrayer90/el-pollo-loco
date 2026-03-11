const mainMenuRef = document.getElementById("overlay-main-menu");
const ingameUIRef = document.getElementById("overlay-UI");
const mobileControlsRef = document.getElementById("mobile-controls");
const muteBtnImageRef = document.getElementById("mute-btn-image");
const fullscreenBtnImageRef = document.getElementById("fullscreen-btn-image");


function uiStartGame(){
    changeClass(mainMenuRef, "hide-object", true);
    changeClass(ingameUIRef, "hide-object", false);

    toggleMuteBtnSprite()
    showMobileOverlay();
}

function showMobileOverlay(){
    changeClass(mobileControlsRef, "hide-object", false);
}

function toggleMuteBtnSprite() {
    if(AudioHub.ISSOUND_MUTE) {
        muteBtnImageRef.src = "./assets/img/13_icons/mute-icon.png";
    }
    else {
        muteBtnImageRef.src = "./assets/img/13_icons/unmute-icon.png";
    }

}

function toggleFullscreenBtnSprite(){
    if (!isFullscreenMode) {
        fullscreenBtnImageRef.src ="./assets/img/13_icons/fullscreen-open.png"
    }
    else{
        fullscreenBtnImageRef.src ="./assets/img/13_icons/fullscreen-close.png"
    }
}

function showBackToMenuBtn() {
    console.log("show back to menu btn");

}

/** Function for adding or removing css classes. @param(elementRef) is a reference */
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
