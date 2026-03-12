class Endboss extends MovableObject {
    y = -50;
    height = 500;
    width = 300;
    images_walking = ImageHub.ENDBOSS.walk;
    
    constructor() {
        super().loadImage(this.images_walking[0]);
        this.loadImages(this.images_walking);

        this.x = 2300;

        IntervalHub.startInterval(this.animate, 100);
    }


    animate = () => {
        this.playAnimationLoop(this.images_walking);
    };
}