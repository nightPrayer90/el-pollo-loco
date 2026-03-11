let isFullscreenMode = false;
const fullscreenRef = document.getElementById("fullscreen");


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

function toggleFullscreen() {
    isFullscreenMode = !isFullscreenMode;

    toggleFullscreenBtnSprite(isFullscreenMode);
    if (isFullscreenMode) {
        enterFullscreen();
    } else {
        exitFullscreen();
    }
}
