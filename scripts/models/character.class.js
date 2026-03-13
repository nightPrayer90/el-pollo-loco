/**
 * @class
 * Represents the playable character and handles movement, animation,
 * combat interactions and player related gameplay logic.
 */
class Character extends MovableObject {
    //#region Properties
    x = 120;
    y = 0;
    groundY = 180;
    height = 250;
    width = 120;
    speed = 4;
    sleepTimer = 0;
    jumpPower = 18;
    cameraOffset = 100;

    health = 100;
    coins = 0;
    bottles = 5;

    images_walking = ImageHub.CHARACTER.walk;
    images_jumping = ImageHub.CHARACTER.jump;
    images_falling = ImageHub.CHARACTER.fall;
    images_idle = ImageHub.CHARACTER.idle;
    images_dead = ImageHub.CHARACTER.dead;
    images_hurt = ImageHub.CHARACTER.hurt;
    images_sleep = ImageHub.CHARACTER.sleep;

    animate_id;
    move_id;
    applyGravity_id;
    sleepInverval_id;
    cameraOffset_id;
    world;

    collisionOffset = {
        top: 110,
        right: 35,
        bottom: 20,
        left: 35,
    };

    otherDirection = false;
    canTakeDamage = true;
    canThrow = true;
    playHurtAnimation = true;
    isPlayWalksound = false;
    //#endregion

    /**
     * Creates the player character.
     * @param {World} world - Reference to the game world.
     */
    constructor(world) {
        super();
        this.world = world;
        this.initImages();
        this.setCollisionRect();
        this.startPlayerIntervals();
    }

    //#region Methods
    /**
     * Loads all animation images for the character.
     */
    initImages() {
        this.loadImage(this.images_walking[0]);
        this.loadImages(this.images_walking);
        this.loadImages(this.images_jumping);
        this.loadImages(this.images_falling);
        this.loadImages(this.images_idle);
        this.loadImages(this.images_dead);
        this.loadImages(this.images_hurt);
        this.loadImages(this.images_sleep);
    }

    /**
     * Starts all player related intervals.
     */
    startPlayerIntervals() {
        this.animate_id = IntervalHub.startInterval(this.animate, 100);
        this.move_id = IntervalHub.startInterval(this.move, 16);
        this.applyGravity_id = IntervalHub.startInterval(this.applyGravity, 16);
        this.sleepInverval_id = IntervalHub.startInterval(this.sleepInterval, 1000);
    }

    /**
     * Stops the player intervals.
     */
    stopPlayerIntervals() {
        IntervalHub.stopInterval(this.animate_id);
        IntervalHub.stopInterval(this.move_id);
        IntervalHub.stopInterval(this.sleepInverval_id);
    }

    /**
     * Starts the camera offset animation.
     */
    changeCameraOffset() {
        this.cameraOffset_id = IntervalHub.startInterval(this.animateCameraOffset, 16);
    }

    canMoveRight() {
        return Keyboard.RIGHT && this.x < this.world.level.level_size - 650;
    }

    canMoveLeft() {
        return Keyboard.LEFT && this.x > -500;
    }

    canThrowBottle() {
        return Keyboard.D && this.canThrow && this.bottles > 0;
    }

    canJump() {
        return Keyboard.SPACE;
    }

    /**
     * Plays and stops walking sound while the character moves on the ground.
     */
    playMoveSound() {
        if (!this.isAboveGround() && (Keyboard.RIGHT || Keyboard.LEFT)) {
            if (!this.isPlayWalksound) {
                this.isPlayWalksound = true;
                AudioHub.playOne(AudioHub.CHAR_WALK, true);
            }
        } else {
            this.stopMoveSound();
        }
    }

    /**
     * Stops the walking sound.
     */
    stopMoveSound() {
        this.isPlayWalksound = false;
        AudioHub.stopOne(AudioHub.CHAR_WALK);
    }

    /**
     * Throws a bottle projectile.
     */
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
        this.sleepTimer = 0;
        super.moveLeft(true);
    }

    moveRight() {
        this.sleepTimer = 0;
        super.moveRight(false);
    }

    /**
     * Cooldown after throwing a bottle.
     */
    throwCooldown() {
        this.canThrow = false;
        setTimeout(() => {
            this.canThrow = true;
        }, 1500);
    }

    /**
     * Makes the character jump.
     */
    jump() {
        if (!this.isAboveGround()) {
            super.jump();
            AudioHub.playOne(AudioHub.CHAR_JUMP);
        }
        this.sleepTimer = 0;
    }

    /**
     * Called when the jump animation finishes.
     */
    jumpEndFrame() {
        super.jumpEndFrame();
        AudioHub.playOne(AudioHub.CHAR_LANDING);
        this.world.createParticleSystem(ImageHub.VFX.jump, this.x + this.width / 2, this.y + this.height - 10, 126, 126);
    }

    hit(damage) {
        if (this.canTakeDamage && !this.isDead()) {
            AudioHub.playOne(AudioHub.CHAR_HURT);
            this.collisionTimeout();
            this.playHurtAnimation = false;
            this.health -= damage;
            this.world.statusBar.setPercentage(this.health);
            this.sleepTimer = 0;
            this.speedY = 6;
            this.isHurt();
        }
    }

    /**
     * Character cant collide for a short time.
     */
    collisionTimeout() {
        this.canTakeDamage = false;

        setTimeout(() => {
            this.canTakeDamage = true;
        }, 1000);
    }

    /**
     * Character get damage -> animation reset.
     */
    isHurt() {
        setTimeout(() => {
            this.playHurtAnimation = true;
        }, 1000);
    }

    isDead() {
        return this.health <= 0;
    }

    triggerGameOver() {
        AudioHub.playOne(AudioHub.CHAR_DEAD);
        this.stopPlayerIntervals();
        this.world.gameIsOver(this.isDead());
    }
    //#endregion

    //#region Intervals
    move = () => {
        if (this.isDead()) return;

        if (this.canMoveRight()) this.moveRight();
        else if (this.canMoveLeft()) this.moveLeft();

        if (this.canJump()) this.jump();

        if (this.canThrowBottle()) this.throwBottle();

        this.playMoveSound();
        this.world.camera_x = -this.x + this.cameraOffset;
    };

    animate = () => {
        if (this.isDead()) {
            if (this.playAnimationSingle(this.images_dead)) {
                this.triggerGameOver();
            }
        } else if (!this.playHurtAnimation) {
            this.playAnimationLoop(this.images_hurt);
        } else if (this.isAboveGround()) {
            if (this.speedY > 0) this.playAnimationSingle(this.images_jumping);
            else this.playAnimationSingle(this.images_falling);
        } else {
            if (Keyboard.RIGHT || Keyboard.LEFT) {
                this.playAnimationLoop(this.images_walking);
                this.sleepTimer = 0;
            } else {
                if (this.sleepTimer >= 15) this.playAnimationLoop(this.images_sleep);
                else this.playAnimationLoop(this.images_idle);
            }
        }
    };

    sleepInterval = () => {
        this.sleepTimer++;
        if (this.sleepTimer >= 15) {
            if (this.sleepTimer % 2) AudioHub.playOne(AudioHub.CHAR_SLEEP);
        }
    };

    animateCameraOffset = () => {
        this.cameraOffset++;

        if (this.cameraOffset >= 340) {
            IntervalHub.stopInterval(this.cameraOffset_id);
        }
    };
     //#endregion
}
