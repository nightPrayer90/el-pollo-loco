class Character extends MovableObject {
    x = 120;
    y = 180;
    height = 250;
    width = 150;

    IMAGES_WALKING = ImageHub.CHARACTER.walk;

    constructor() {
        super();
        this.loadImage("../assets/img/2_character_pepe/1_idle/idle/I-1.png");
        this.loadImages(this.IMAGES_WALKING);
        IntervalHub.startInterval(this.animate, 100);
    }

    animate = () => {
        let i = this.currentImage % this.IMAGES_WALKING.length;
        let path = this.IMAGES_WALKING[i];
        this.img = this.imageCache[path];
        this.currentImage ++;
    }

    jump() {}
}
