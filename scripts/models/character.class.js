class Character extends MovableObject {
    x = 120;
    y = 180;
    height = 250;
    width = 120;
    speed = 4;
    otherDirection = false;

    IMAGES_WALKING = ImageHub.CHARACTER.walk;
    IMAGES_JUMPING = ImageHub.CHARACTER.jump;
    IMAGES_IDLE = ImageHub.CHARACTER.idle;

    world;

    collisionOffset = {
        top: 110,
        right: 35,
        bottom: 10,
        left: 35
    };

    constructor() {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_IDLE);

        this.setCollisionRect();
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
        if (this.world.keyboard.SPACE) {
            if (!this.isAboveGround()) {
                this.jump();
            }
        }
        this.world.camera_x = -this.x + 100;
    };

    animate = () => {
        if (this.isAboveGround()) {
            this.playAnimationSingle(this.IMAGES_JUMPING);
        } else {    
            if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                this.playAnimationLoop(this.IMAGES_WALKING);
            }
            else {
                this.playAnimationLoop(this.IMAGES_IDLE);
            }
        }
    };
}
