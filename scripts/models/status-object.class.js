class StatusObject extends DrawableObject {
    IMAGES_BOTTLE = ImageHub.STATUSBAR.bottle;
    IMAGES_COIN = ImageHub.STATUSBAR.coin;

    x = 38;
    y = 55;
    width = 50;
    height = 40;

    isDrawText = true;
    type;
    character;

    constructor(type, character) {
        super();
        this.type = type;
        this.character = character;
        this.init();
        
    }

    init() {
        switch (this.type) {
            case 0:
                this.initBottle();
                break;
            case 1:
                this.initCoin();
                break;
        }
    }

    initBottle() {
        this.loadImage(this.IMAGES_BOTTLE[0]);
        this.x = 38;
        this.y = 58;
        this.width = 50;
        this.height = 40;
        this.textOffset = {
            x: 43,
            y: 30,
        };
        this.updateText(this.character.bottles);
    }

    initCoin() {
        this.loadImage(this.IMAGES_COIN[0]);
        this.x = 145;
        this.y = 53;
        this.width = 46;
        this.height = 46;
        this.textOffset = {
            x: 45,
            y: 35,
        };
        this.updateText(this.character.coins);
    } 

    updateText(value) {
        switch (this.type) {
            case 0:
                this.showTextString = value;
                break;
            case 1:
                this.showTextString = value + "/4";
                break;
        }
    }
}
