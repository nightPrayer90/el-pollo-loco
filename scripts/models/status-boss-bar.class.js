/**
 * @class
 * Represents the endboss health status bar.
 */
export class StatusBossBar extends DrawableObject{

    //#region Properties
    imagesSet = ImageHub.STATUSBAR.endboss;
    x = 250;
    y = 420;
    width = 250;
    height = 60;
    //#endregion

    /**
     * Creates the boss health bar.
     */
    constructor() {
        super();
        this.loadImages(this.imagesSet)
        this.setHealth(5);
    }

    /**
     * Updates the displayed boss health.
     * @param {number} health - Current boss health value.
     */
    setHealth(health) {
        let path = this.imagesSet[health];
        this.img = this.imageCache[path];
    }
}