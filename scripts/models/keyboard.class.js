class Keyboard {
    static LEFT = false;
    static RIGHT = false;
    static D = false;
    static SPACE = false;

    static addEvents() {
        window.addEventListener("keydown", (e) => {
            if (e.key == "ArrowRight") {
                Keyboard.RIGHT = true;
            }

            if (e.key == "ArrowLeft") {
                Keyboard.LEFT = true;
            }

            if (e.key == " ") {
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

    static addButtonEvents() {
        const btnLeft = document.getElementById("btn-left");
        const btnRight = document.getElementById("btn-right");
        const btnUp = document.getElementById("btn-d");
        const btnSpace = document.getElementById("btn-space");

        // LEFT
        btnLeft.addEventListener("touchstart", (e) => {
            e.preventDefault();
            Keyboard.LEFT = true;
        });
        btnLeft.addEventListener("touchend", (e) => (Keyboard.LEFT = false));

        // RIGHT
        btnRight.addEventListener("touchstart", (e) => {
            e.preventDefault();
            Keyboard.RIGHT = true;
        });
        btnRight.addEventListener("touchend", () => (Keyboard.RIGHT = false));

        // D
        btnUp.addEventListener("touchstart", (e) => {
            e.preventDefault();
            Keyboard.D = true;
        });
        btnUp.addEventListener("touchend", () => (Keyboard.D = false));

        // SPACE
        btnSpace.addEventListener("touchstart", (e) => {
            e.preventDefault();
            Keyboard.SPACE = true;
        });
        btnSpace.addEventListener("touchend", () => (Keyboard.SPACE = false));
    }
}
