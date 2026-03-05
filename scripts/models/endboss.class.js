class Endboss extends MovableObject {
    y = -50;
    height = 500;
    width = 300;
    IMAGES_WALKING = ImageHub.ENDBOSS.walk;
    
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);

        this.x = 2300;

        IntervalHub.startInterval(this.animate, 100);
    }


    animate = () => {
        this.playAnimationLoop(this.IMAGES_WALKING);
    };
}