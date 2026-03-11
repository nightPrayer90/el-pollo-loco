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
        const btnD = document.getElementById("btn-d");
        const btnSpace = document.getElementById("btn-space");

        // left
        btnLeft.addEventListener("touchstart", (e) => {
            Keyboard.LEFT = true;
            btnLeft.classList.add("touchPressed");
        });
        btnLeft.addEventListener("touchend", (e) => {
            Keyboard.LEFT = false;
            btnLeft.classList.remove("touchPressed");
        });

        // right
        btnRight.addEventListener("touchstart", (e) => {
            Keyboard.RIGHT = true;
            btnRight.classList.add("touchPressed");
        });

        btnRight.addEventListener("touchend", () => {
            Keyboard.RIGHT = false;
            btnRight.classList.remove("touchPressed");
        });

        // d
        btnD.addEventListener("touchstart", (e) => {
            Keyboard.D = true;
            btnD.classList.add("touchPressed");
        });

        btnD.addEventListener("touchend", () => {
            Keyboard.D = false;
            btnD.classList.remove("touchPressed");
        });

        // jump
        btnSpace.addEventListener("touchstart", (e) => {
            Keyboard.SPACE = true;
            btnSpace.classList.add("touchPressed");
        });

        btnSpace.addEventListener("touchend", () => {
            Keyboard.SPACE = false;
            btnSpace.classList.remove("touchPressed");
        });
    }
}
