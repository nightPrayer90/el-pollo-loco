class Character extends MovableObject {
    x = 120;
    y = 180;
    height = 250;
    width = 120;
    speed = 4;
    otherDirection = false;

    IMAGES_WALKING = ImageHub.CHARACTER.walk;
    IMAGES_JUMPING = ImageHub.CHARACTER.jump;
    world;

    constructor() {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        IntervalHub.startInterval(this.animate, 100);
        IntervalHub.startInterval(this.move, 1000 / 60);
        IntervalHub.startInterval(this.applyGravity, 1000 / 60);
    }

    move = () => {
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
            this.otherDirection = false;
        } else if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft();
            this.otherDirection = true;
        } 
        if (this.world.keyboard.SPACE && !this.isAboveGround()) {
            this.jump();   
        }


        this.world.camera_x = -this.x + 100;
    };

    animate = () => {
        if (this.isAboveGround()) {
            this.playAnimation(this.IMAGES_JUMPING);
        } else {
            if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                // Walk animation
                this.playAnimation(this.IMAGES_WALKING);
            }
        }
    };
}
