/**
 * @class
 * Represents a UI status object displaying coins or bottles.
 */
class StatusObject extends DrawableObject {
    
    //#region Properties
    x = 38;
    y = 55;
    width = 50;
    height = 40;

    imagesBottle = ImageHub.STATUSBAR.bottle;
    imagesCoin = ImageHub.STATUSBAR.coin;

    isDrawText = true;
    type;
    character;
    //#endregion

    /**
     * Creates a status UI element.
     * @param {number} type - Status type (0 = bottle, 1 = coin).
     * @param {Character} character - Reference to the player character.
     */
    constructor(type, character) {
        super();
        this.type = type;
        this.character = character;
        this.init();
        
    }

    //#region Methods
    /**
     * Initializes the UI element based on its type.
     */
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

    /**
     * Initializes the bottle UI.
     */
    initBottle() {
        this.loadImage(this.imagesBottle[0]);
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

    /**
     * Initializes the coin UI.
     */
    initCoin() {
        this.loadImage(this.imagesCoin[0]);
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

    /**
     * Updates the displayed text value.
     */
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
    //#endregion
}
