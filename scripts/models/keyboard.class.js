/**
 * @class
 * Handles keyboard and touch input for the player controls.
 */
class Keyboard {

    //#region Properties
    static LEFT = false;
    static RIGHT = false;
    static D = false;
    static SPACE = false;
    //#endregion

    //#region Methods
    /**
     * Registers keyboard key events.
     */
    static addEvents() {
        window.addEventListener("keydown", (e) => {
            if (e.key == "ArrowRight") {
                Keyboard.RIGHT = true;
            }

            if (e.key == "ArrowLeft") {
                Keyboard.LEFT = true;
            }

            if (e.key == " ") {
                e.preventDefault();
                Keyboard.SPACE = true;
            }

            if (e.key == "d") {
                Keyboard.D = true;
            }
        });

        window.addEventListener("keyup", (e) => {
            if (e.key == "ArrowRight") {
                Keyboard.RIGHT = false;
            }

            if (e.key == "ArrowLeft") {
                Keyboard.LEFT = false;
            }

            if (e.key == " ") {
                Keyboard.SPACE = false;
            }

            if (e.key == "d") {
                Keyboard.D = false;
            }
        });
    }

    /**
     * Registers touch controls for mobile buttons.
     */
    static addButtonEvents() {
        const btnLeft = document.getElementById("btn-left");
        const btnRight = document.getElementById("btn-right");
        const btnD = document.getElementById("btn-d");
        const btnSpace = document.getElementById("btn-space");

        btnLeft.addEventListener("touchstart", (e) => {
            e.preventDefault();
            Keyboard.LEFT = true;
            btnLeft.classList.add("touchPressed");
        });
        btnLeft.addEventListener("touchend", (e) => {
            Keyboard.LEFT = false;
            btnLeft.classList.remove("touchPressed");
        });

        btnRight.addEventListener("touchstart", (e) => {
            e.preventDefault();
            Keyboard.RIGHT = true;
            btnRight.classList.add("touchPressed");
        });

        btnRight.addEventListener("touchend", () => {
            Keyboard.RIGHT = false;
            btnRight.classList.remove("touchPressed");
        });

        btnD.addEventListener("touchstart", (e) => {
            e.preventDefault();
            Keyboard.D = true;
            btnD.classList.add("touchPressed");
        });

        btnD.addEventListener("touchend", () => {
            Keyboard.D = false;
            btnD.classList.remove("touchPressed");
        });

        btnSpace.addEventListener("touchstart", (e) => {
            e.preventDefault();
            Keyboard.SPACE = true;
            btnSpace.classList.add("touchPressed");
        });

        btnSpace.addEventListener("touchend", () => {
            Keyboard.SPACE = false;
            btnSpace.classList.remove("touchPressed");
        });
    }
    //#endregion
}
