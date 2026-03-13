/**
 * @class
 * Represents a throwable bottle object used by the player.
 * Handles flight physics, collision and splash effects.
 */
class ThrowableObject extends MovableObject {
    
    //#region Properties
    speed = 10;
    height = 50;
    width = 50;

    imagesRotateBottle = ImageHub.BOTTLE.rotate;
    imagesBrokenBottle = ImageHub.BOTTLE.broken;

    isHit = false;
    isSplash = false;
    isHitOnGround = false;

    animate_id;
    fly_id;
    world;
    //#endregion

    /**
     * Creates a throwable bottle instance.
     * @param {number} x - Spawn X position.
     * @param {number} y - Spawn Y position.
     * @param {World} world - Reference to the game world.
     */
    constructor(x, y, world) {
        super();
        this.x = x + 50;
        this.y = y + 100;
        this.world = world;
        this.initImages();
        this.setCollisionRect();
        this.throw();
    }

    //#region Methods
    /**
     * Loads bottle rotation images.
     */
    initImages(){
        this.loadImage(this.imagesRotateBottle[0]);
        this.loadImages(this.imagesRotateBottle);
    }

    /**
     * Starts the bottle throw motion.
     */
    throw() {
        let jumpHeight = (180 - this.world.character.y) / 25;
        this.speedY = 10 + jumpHeight;
        if (Keyboard.RIGHT) this.speed += 3;

        if (this.world.character.otherDirection) this.speed *= -1;

        this.animate_id = IntervalHub.startInterval(this.animate, 60);
        this.fly_id = IntervalHub.startInterval(this.flyWithGravity, 16);
    }

    /**
     * Handles bottle splash effect.
     */
    splash() {
        if (this.isSplash) return;
        this.isSplash = true

        this.removeBottleFromCollision();
        this.world.createParticleSystem(ImageHub.BOTTLE.splash, this.x+this.width/2, this.y + this.height-2, 150, 150);
        IntervalHub.stopInterval(this.fly_id); 
    }

    /**
     * Removes the bottle from collision checks.
     */
    removeBottleFromCollision() {
        if (!this.isHit) {
            const index = this.world.throwableObjects.indexOf(this);
            if (index != -1) {
                this.world.throwableObjects.splice(index, 1);
                if (this.isHitOnGround)
                    this.world.thrownBottles.push(this);
            }
            this.isHit = true;
        }
    }
    //#endregion

     //#region Intervals
    /**
     * Updates bottle movement with gravity.
     */
    flyWithGravity = () => {
        if (this.y < 400) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
            this.moveRight();
        } else {
            this.isHitOnGround = true;
            this.splash();
        }
    }

    /**
     * Handles bottle animation states.
     */
    animate = () => {
        if (!this.isHit) {
            this.playAnimationLoop(this.imagesRotateBottle);
        }
        else {
            if (this.isHitOnGround) {
                AudioHub.playOne(AudioHub.THROW_HITGORUND);
                this.loadImage(this.imagesBrokenBottle[Math.floor(Math.random() * this.imagesBrokenBottle.length)]);
                IntervalHub.stopInterval(this.animate_id);
            }
        }
    }
     //#endregion
}
