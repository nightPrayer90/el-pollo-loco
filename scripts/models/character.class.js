class Character extends MovableObject {
    x = 120;
    y = 180;
    height = 250;
    width = 120;
    speed = 4;
    otherDirection = false;

    health = 100;
    coins = 0;
    bottles = 5;

    IMAGES_WALKING = ImageHub.CHARACTER.walk;
    IMAGES_JUMPING = ImageHub.CHARACTER.jump;
    IMAGES_FALLING = ImageHub.CHARACTER.fall;
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
        bottom: 20,
        left: 35,
    };

    canTakeDamage = true;
    canThrow = true;

    animate_id;

    constructor() {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_FALLING);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);

        this.setCollisionRect();
        this.animate_id = IntervalHub.startInterval(this.animate, 100);
        this.move_id = IntervalHub.startInterval(this.move, 16);
        this.applyGravity_id = IntervalHub.startInterval(this.applyGravity, 16);
    }

    move = () => {
        if (this.isDead() == true) return;

        if (this.world.keyboard.RIGHT && this.x < (this.world.level.level_size - 650)) {
            this.moveRight();

        } else if (this.world.keyboard.LEFT && this.x > -500) {
            this.moveLeft();
            
        }
        if (this.world.keyboard.SPACE) {
            if (!this.isAboveGround()) {
                this.jump();
            }
        }
        if (this.world.keyboard.D && this.canThrow == true && this.bottles > 0) {
            this.throwBottle();
        }

        this.world.camera_x = -this.x + 100;
    };

    throwBottle() {
        let bottle = new ThrowableObject(this.x, this.y, this.world);
        this.world.throwableObjects.push(bottle);
        this.canThrow = false;

        this.bottles--;
        console.log("[bottles: ]" + this.bottles);

        setTimeout(() => {
            this.canThrow = true;
        }, 1000);
    }

    jumpEndFrame() {
        super.jumpEndFrame();
        this.world.createParticleSystem(ImageHub.VFX.jump, this.x + this.width / 2, this.y + this.height - 10, 126, 126);
    }

    hit(damage) {
        if (this.canTakeDamage == true && !this.isDead()) {
            this.canTakeDamage = false;
            this.health -= damage;
            this.world.statusBar.setPercentage(this.health);

            this.speedY = 6;
            setTimeout(() => {
                this.isHurt();
            }, 1000);
        }
    }

    isHurt() {
        this.canTakeDamage = true;
    }

    isDead() {
        return this.health <= 0;
    }

    animate = () => {
        if (this.isDead()) {
            if (this.playAnimationSingle(this.IMAGES_DEAD)) {
                IntervalHub.stopInterval(this.animate_id);
                IntervalHub.stopInterval(this.move_id);
            }
        } else if (!this.canTakeDamage) {
            this.playAnimationLoop(this.IMAGES_HURT);
        } else if (this.isAboveGround()) {
            if (this.speedY > 0) this.playAnimationSingle(this.IMAGES_JUMPING);
            else this.playAnimationSingle(this.IMAGES_FALLING);
        } else {
            if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                this.playAnimationLoop(this.IMAGES_WALKING);
            } else {
                this.playAnimationLoop(this.IMAGES_IDLE);
            }
        }
    };
}
