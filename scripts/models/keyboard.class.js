class Keyboard {
    static LEFT = false;
    static RIGHT = false;
    static UP = false;
    static SPACE = false;

    static addEvents() {
        window.addEventListener("keydown", (e) => {
            if (e.key == "ArrowRight") {
                Keyboard.RIGHT = true;
            }

            if (e.key == "ArrowLeft") {
                Keyboard.LEFT = true;
            }

            if (e.key == "ArrowUp") {
                Keyboard.UP = true;
            }

            if (e.key == " ") {
                Keyboard.SPACE = true;
            }

            if (e.key == "d") {
                Keyboard.D = true;
            }
        });

        // TODO: SWITCH!!! _> keycode? lagacy
        window.addEventListener("keyup", (e) => {
            console.log(e);
            if (e.key == "ArrowRight") {
                Keyboard.RIGHT = false;
            }

            if (e.key == "ArrowLeft") {
                Keyboard.LEFT = false;
            }

            if (e.key == "ArrowUp") {
                Keyboard.UP = false;
            }

            if (e.key == " ") {
                Keyboard.SPACE = false;
            }

            if (e.key == "d") {
                Keyboard.D = false;
            }
        });
    }
}
