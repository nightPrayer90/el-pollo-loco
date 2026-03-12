class StatusBossBar extends DrawableObject{
    images_set = ImageHub.STATUSBAR.endboss;
    x = 250;
    y = 420;
    width = 250;
    height = 60;

    constructor() {
        super();
        this.loadImages(this.images_set)
        this.setHealth(5);
    }

    setHealth(health) {
        let path = this.images_set[health];
        this.img = this.imageCache[path];
    }
}