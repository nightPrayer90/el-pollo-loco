/**
 * @class
 * Represents the endboss health status bar.
 */
class StatusBossBar extends DrawableObject{

    //#region Properties
    images_set = ImageHub.STATUSBAR.endboss;
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
        this.loadImages(this.images_set)
        this.setHealth(5);
    }

    /**
     * Updates the displayed boss health.
     * @param {number} health - Current boss health value.
     */
    setHealth(health) {
        let path = this.images_set[health];
        this.img = this.imageCache[path];
    }
}