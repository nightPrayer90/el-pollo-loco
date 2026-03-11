const mainMenu = document.getElementById("overlay-main-menu");
const ingameUI = document.getElementById("overlay-UI");
const mobileControls = document.getElementById("mobile-controls");


function uiStartGame(){
    changeClass(mainMenu, "hide-object", true);
    changeClass(ingameUI, "hide-object", false);

    showMobileOverlay();
}

function showMobileOverlay(){
    changeClass(mobileControls, "hide-object", false);
}

/** Function for adding or removing css classes. @param(elementID) is a string */
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
