let isFullscreenMode = false;
const fullscreenRef = document.getElementById("fullscreen");

// need this because if i close the fullscreen window with ESC
// https://developer.mozilla.org/en-US/docs/Web/API/Document/fullscreenchange_event
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

function toggleFullscreen() {
    isFullscreenMode = !isFullscreenMode;
    if (isFullscreenMode) {
        enterFullscreen();
    } else {
        exitFullscreen();
    }
}

function enterFullscreen() {
    if (fullscreenRef.requestFullscreen) {
        fullscreenRef.requestFullscreen();
    } else if (fullscreenRef.msRequestFullscreen) {
        fullscreenRef.requestFullscreen();
    } else if (fullscreenRef.webkitRequestFullscreen) {
        fullscreenRef.webkitRequestFullscreen();
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitRequestFullscreen) {
        document.webkitRequestFullscreen();
    }
}
