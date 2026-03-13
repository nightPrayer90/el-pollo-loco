/**
 * @class
 * Represents screen overlays such as victory, game over or start screen.
 */
class StatusOverlay extends DrawableObject {
    
    //#region Properties
    imageVictory = ImageHub.OVERLAY.victory;
    imageGameOver = ImageHub.OVERLAY.gameOver;
    imageStartscreen = ImageHub.OVERLAY.startScreen;
    type;
    animate_id;
    //#endregion

    /**
     * Creates an overlay instance.
     * @param {number} type - Overlay type (0 = victory, 1 = game over, 2 = start screen).
     */
    constructor(type) {
        super();
        this.initOverlay(type);
    }

     //#region Methods
    /**
     * Initializes the overlay based on its type.
     */
    initOverlay(type) {
        this.type = type;
        switch (this.type) {
            case 0:
                this.initVictory();
                break;
            case 1:
                this.initGameOver();
                break;
            case 2:
                this.initStartGame();
                break;
        }
    }

    /**
     * Initializes the victory overlay.
     */
    initVictory() {
        this.loadImage(this.imageVictory[0]);
        this.x = (720 - 500) / 2;
        this.y = 5;
        this.width = 500;
        this.height = 480;
        this.textOffset = {
            x: 0,
            y: 0,
        };
        this.animate_id = IntervalHub.startInterval(this.animateGrow, 16);
    }

    /**
     * Initializes the game over overlay.
     */
    initGameOver() {
        this.loadImage(this.imageGameOver[0]);
        this.x = 0;
        this.y = 0;
        this.width = 720;
        this.height = 480;
        this.textOffset = {
            x: 0,
            y: 0,
        };
        this.animate_id = IntervalHub.startInterval(this.animateGrow, 16);
    }

    /**
     * Initializes the start screen overlay.
     */
    initStartGame() {
        this.loadImage(this.imageStartscreen[0]);
        this.x = 0;
        this.y = 0;
        this.width = 720;
        this.height = 480;
        this.textOffset = {
            x: 0,
            y: 0,
        };
        this.animate_id = IntervalHub.startInterval(this.animateShrink, 16);
    }

    /**
     * Stops the overlay animation interval.
     */
    stopInterval() {
        IntervalHub.stopInterval(this.animate_id);
    }
     //#endregion

     //#region Intervals
    /**
     * Shrinks the overlay animation.
     */
    animateGrow = () => {
        this.width += 1;
        this.height += 1;
        this.x -= 0.5;
        this.y -= 0.5;
    };

    /**
     * Grows the overlay animation.
     */
    animateShrink = () => {
        this.width -= 16;
        this.height -= 16;
        this.x += 8;
        this.y += 8;
    };
    //#endregion
}
