class Chicken extends MovableObject {
    x;
    y = 330;
    height = 100;
    width = 70;
    speed = 1 + Math.random() * 1;
    damage = 20;

    IMAGES_WALKING = ImageHub.CHICKEN_NORMAL.walk;

    collisionOffset = {
        top: 20,
        right: 10,
        bottom: 0,
        left: 10
    };

    constructor() {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.x = Math.random() * 500 + 200;

        this.setCollisionRect();
        this.loadImages(this.IMAGES_WALKING);
        IntervalHub.startInterval(this.animate, 100); // wir sagen hier das die Hüher animation zusammen mit der geschwindigkeit animiert werden! das fühlt sich falsch an!!!
        IntervalHub.startInterval(this.moveLeft, 60); 
    }


    animate = () => {
        this.playAnimationLoop(this.IMAGES_WALKING);
    };
}
