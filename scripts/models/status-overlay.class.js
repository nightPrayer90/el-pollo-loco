class StatusOverlay extends DrawableObject {
    image_victory = ImageHub.OVERLAY.victory;
    image_gameOver = ImageHub.OVERLAY.gameOver;
    image_startscreen = ImageHub.OVERLAY.startScreen;
    type;
    animate_id;

    constructor(type) {
        super();
        this.initOverlay(type);
    }

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

    initVictory() {
        this.loadImage(this.image_victory[0]);
        this.x = (720 - 500) / 2;
        this.y = 5;
        this.width = 500;
        this.height = 480;
        this.textOffset = {
            x: 0,
            y: 0,
        };
    }

    initGameOver() {
        this.loadImage(this.image_gameOver[0]);
        this.x = 0;
        this.y = 0;
        this.width = 720;
        this.height = 480;
        this.textOffset = {
            x: 0,
            y: 0,
        };
    }

    initStartGame() {
        this.loadImage(this.image_startscreen[0]);
        this.x = 0;
        this.y = 0;
        this.width = 720;
        this.height = 480;
        this.textOffset = {
            x: 0,
            y: 0,
        };
        this.animate_id = IntervalHub.startInterval(this.aninmate, 16);
    }

    aninmate = () => {
        Math.max(0, this.width -= 16);
        Math.max(0, this.height -= 16);
        this.x +=8;
        this.y +=8;
    }

    stopInterval() {
        IntervalHub.stopInterval(this.animate_id);
    }
}
