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
    IMAGES_DEAD = ImageHub.CHARACTER.dead;
    IMAGES_HURT = ImageHub.CHARACTER.hurt;

    animate_id;
    move_id;
    applyGravity_id;

    world;

    collisionOffset = {
        top: 110,
        right: 35,
        bottom: 10,
        left: 35,
    };

    canTakeDamage = true;
    canThrow = true;

    animate_id

    constructor() {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);

        this.setCollisionRect();
        this.animate_id = IntervalHub.startInterval(this.animate, 100);
        this.move_id = IntervalHub.startInterval(this.move, 16);
        this.applyGravity_id = IntervalHub.startInterval(this.applyGravity, 16);
    }

    move = () => {
        if(this.isDead() == true) return;

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

    hit(damage) {
        if (this.canTakeDamage == true) {
            this.canTakeDamage = false;
            this.health -= damage;
            this.world.statusBar.setPercentage(this.health);

            this.speedY = 10;
            setTimeout(() => {
                this.isHurt();
            }, 1000);
        }
    }

    isHurt() {
        this.canTakeDamage = true;
    }

    isDead(){
        return this.health <= 0 ;
    }

    animate = () => {

        if (this.isDead()) {
            if (this.playAnimationSingle(this.IMAGES_DEAD)) {
                IntervalHub.stopInterval(this.animate_id);
                IntervalHub.stopInterval(this.move_id);
                IntervalHub.stopInterval(this.applyGravity_id);
            };
        }
        else if (!this.canTakeDamage) {
            this.playAnimationLoop(this.IMAGES_HURT);
        }
        else if (this.isAboveGround()) {
            this.playAnimationSingle(this.IMAGES_JUMPING);
        } else {
            if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                this.playAnimationLoop(this.IMAGES_WALKING);
            } else {
                this.playAnimationLoop(this.IMAGES_IDLE);
            }
        }
    };
}
