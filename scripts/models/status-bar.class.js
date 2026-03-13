/**
 * @class
 * Represents the player health status bar.
 */
class StatusBar extends DrawableObject{

    //#region Properties
    images_set = ImageHub.STATUSBAR.health;
    percentage;
    x = 40;
    y = 0;
    width = 200;
    height = 60;
    //#endregion

    /**
     * Creates the status bar instance.
     */
    constructor() {
        super();
        this.loadImages(this.images_set)
        this.setPercentage(100);
    }

    //#region Methods
    /**
     * Updates the displayed health percentage.
     * @param {number} percentage - Current health value.
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.images_set[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Resolves which health image should be displayed.
     */
    resolveImageIndex() {
        if (this.percentage == 100) {
            return 5;
        } else if (this.percentage >= 80) {
            return 4;
        } else if (this.percentage >= 60) {
            return 3;
        } else if (this.percentage >= 40) {
            return 2;
        } else if (this.percentage >= 20) {
            return 1;
        } else {
            return 0;
        }
    }
    //#endregion
}