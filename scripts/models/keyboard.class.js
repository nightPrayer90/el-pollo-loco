class Keyboard {
    static LEFT = false;
    static RIGHT = false;
    static UP = false;
    static DOWN = false;
    static SPACE = false;

    static addEvents() {
        window.addEventListener("keydown", (e) => {
            if (e.keyCode == 39) {
                Keyboard.RIGHT = true;
            }

            if (e.keyCode == 37) {
                Keyboard.LEFT = true;
            }

            if (e.keyCode == 38) {
                Keyboard.UP = true;
            }

            if (e.keyCode == 40) {
                Keyboard.DOWN = true;
            }

            if (e.keyCode == 32) {
                Keyboard.SPACE = true;
            }

            if (e.keyCode == 68) {
                Keyboard.D = true;
            }
        });

        // TODO: SWITCH!!! _> keycode? lagacy
        window.addEventListener("keyup", (e) => {
            console.log(e);
            if (e.keyCode == 39) {
                Keyboard.RIGHT = false;
            }

            if (e.keyCode == 37) {
                Keyboard.LEFT = false;
            }

            if (e.keyCode == 38) {
                Keyboard.UP = false;
            }

            if (e.keyCode == 40) {
                Keyboard.DOWN = false;
            }

            if (e.keyCode == 32) {
                Keyboard.SPACE = false;
            }

            if (e.keyCode == 68) {
                Keyboard.D = false;
            }
        });
    }
}
