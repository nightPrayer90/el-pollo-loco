class Character extends MovableObject {
    x = 120;
    y = 0;
    height = 250;
    width = 120;
    speed = 4;
    otherDirection = false;
    sleepTimer = 0;

    health = 100;
    coins = 0;
    bottles = 5;

    IMAGES_WALKING = ImageHub.CHARACTER.walk;
    IMAGES_JUMPING = ImageHub.CHARACTER.jump;
    IMAGES_FALLING = ImageHub.CHARACTER.fall;
    IMAGES_IDLE = ImageHub.CHARACTER.idle;
    IMAGES_DEAD = ImageHub.CHARACTER.dead;
    IMAGES_HURT = ImageHub.CHARACTER.hurt;
    IMAGES_SLEEP = ImageHub.CHARACTER.sleep;

    animate_id;
    move_id;
    applyGravity_id;
    sleepInverval_id;

    world;

    collisionOffset = {
        top: 110,
        right: 35,
        bottom: 20,
        left: 35,
    };

    canTakeDamage = true;
    canThrow = true;
    playHurtAnimation = true;
    isPlayWalksound = false;

    constructor() {
        super();
        this.initImages();
        this.setCollisionRect();
        this.startPlayerIntervals();
    }

    initImages() {
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_FALLING);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_SLEEP);
    }

    startPlayerIntervals() {
        this.animate_id = IntervalHub.startInterval(this.animate, 100);
        this.move_id = IntervalHub.startInterval(this.move, 16);
        this.applyGravity_id = IntervalHub.startInterval(this.applyGravity, 16);
        this.sleepInverval_id = IntervalHub.startInterval(this.sleepInterval, 1000);
    }

    stopPlayerIntervals() {
        IntervalHub.stopInterval(this.animate_id);
        IntervalHub.stopInterval(this.move_id);
        IntervalHub.stopInterval(this.sleepInverval_id);
    }

    sleepInterval = () => {
        this.sleepTimer++;
        if (this.sleepTimer >= 15) {
            if (this.sleepTimer % 2)
            AudioHub.playOne(AudioHub.CHAR_SLEEP);
        }
        console.log(this.sleepTimer);
    };

    move = () => {
        if (this.isDead() == true) return;

        if (this.canMoveRight()) this.moveRight();
        else if (this.canMoveLeft()) this.moveLeft();

        if (this.canJump()) this.jump();

        if (this.canThrowBottle()) this.throwBottle();

        this.playMoveSound();
        this.world.camera_x = -this.x + 100;
    };

    canMoveRight() {
        return Keyboard.RIGHT && this.x < this.world.level.level_size - 650;
    }

    canMoveLeft() {
        return Keyboard.LEFT && this.x > -500;
    }

    canThrowBottle() {
        return Keyboard.D && this.canThrow == true && this.bottles > 0;
    }

    canJump() {
        return Keyboard.SPACE;
    }

    playMoveSound() {
        if (!this.isAboveGround() && (Keyboard.RIGHT || Keyboard.LEFT)) {
            if (this.isPlayWalksound == false) {
                this.isPlayWalksound = true;
                AudioHub.playOne(AudioHub.CHAR_WALK);
            }
        } else {
            this.isPlayWalksound = false;
            AudioHub.stopOne(AudioHub.CHAR_WALK);
        }
    }

    throwBottle() {
        AudioHub.playOne(AudioHub.CHAR_THROW);
        let bottle = new ThrowableObject(this.x, this.y, this.world);
        this.world.throwableObjects.push(bottle);
        this.bottles--;
        this.world.bottleUI.updateText(this.bottles);
        this.throwCooldown();
        this.sleepTimer = 0;
    }

    moveLeft() {
        super.moveLeft();
        this.sleepTimer = 0;
    }

    moveRight() {
        super.moveRight();
        this.sleepTimer = 0;
    }

    throwCooldown() {
        this.canThrow = false;
        setTimeout(() => {
            this.canThrow = true;
        }, 1000);
    }

    jump() {
        if (!this.isAboveGround()) {
            super.jump();
            AudioHub.playOne(AudioHub.CHAR_JUMP);
        }
        this.sleepTimer = 0;
    }

    jumpEndFrame() {
        super.jumpEndFrame();
        AudioHub.playOne(AudioHub.CHAR_LANDING);
        this.world.createParticleSystem(ImageHub.VFX.jump, this.x + this.width / 2, this.y + this.height - 10, 126, 126);
    }

    hit(damage) {
        if (this.canTakeDamage == true && !this.isDead()) {
            AudioHub.playOne(AudioHub.CHAR_HURT);
            this.collisionTimeout();

            this.playHurtAnimation = false;
            this.health -= damage;
            this.world.statusBar.setPercentage(this.health);

            this.speedY = 6;
            this.isHurt();
        }
    }

    collisionTimeout() {
        this.canTakeDamage = false;

        setTimeout(() => {
            this.canTakeDamage = true;
        }, 1000);
    }

    isHurt() {
        setTimeout(() => {
            this.playHurtAnimation = true;
        }, 1000);
    }

    isDead() {
        return this.health <= 0;
    }

    animate = () => {
        if (this.isDead()) {
            if (this.playAnimationSingle(this.IMAGES_DEAD)) {
                AudioHub.playOne(AudioHub.CHAR_DEAD);
                this.stopPlayerIntervals();
            }
        } else if (!this.playHurtAnimation) {
            this.playAnimationLoop(this.IMAGES_HURT);
        } else if (this.isAboveGround()) {
            if (this.speedY > 0) this.playAnimationSingle(this.IMAGES_JUMPING);
            else this.playAnimationSingle(this.IMAGES_FALLING);
        } else {
            if (Keyboard.RIGHT || Keyboard.LEFT) {
                this.playAnimationLoop(this.IMAGES_WALKING);
            } else {
                if (this.sleepTimer >= 15) this.playAnimationLoop(this.IMAGES_SLEEP);
                else this.playAnimationLoop(this.IMAGES_IDLE);
            }
        }
    };
}
