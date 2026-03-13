let isFullscreenMode = false;
const fullscreenRef = document.getElementById("fullscreen");

/**
 * Initializes the fullscreen change listener.
 * This keeps the internal fullscreen state in sync when the user exits
 * fullscreen using ESC or browser controls.
 *  https://developer.mozilla.org/en-US/docs/Web/API/Document/fullscreenchange_event
 */
function initFullscreenListner() {
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
 * Toggles fullscreen mode on or off.
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
        document.webkitRequestFullscreen();
    }
}
