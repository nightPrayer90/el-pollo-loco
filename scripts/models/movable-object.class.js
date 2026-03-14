import { DrawableObject } from "./drawable-object.class.js";

/**
 * @class
 * Base class for all movable game objects.
 * Handles movement, jumping, animation playback and collision logic.
 */
export class MovableObject extends DrawableObject {
    
     //#region Properties
    speed = 0.15;
    speedY = 0;
    acceleration = 1;
    groundY = 180;
    jumpPower = 18;

    lastImages = [];
    health;
    damage;

    animationFlag = false;
    isLanding = false;
    drawCollisionFrame = false;

    cX;
    cY;
    cW;
    cH;
    collisionOffset = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    };
    //#endregion

    //#region Methods
    /**
     * Moves the object to the right.
     */
    moveRight(isEnemy = true) {
        this.x += this.speed;
        this.otherDirection = isEnemy;
    }

    /**
     * Moves the object to the left.
     */
    moveLeft(isInvert = false) {
        this.x -= this.speed;
        this.otherDirection = isInvert;
    }

    /**
     * Starts a jump.
     */
    jump() {
        this.speedY = this.jumpPower;
        this.lastImages = [];
    }

    /**
     * Returns whether the object is above the ground.
     */
    isAboveGround() {
        return this.y < this.groundY;
    }

    /**
     * Called when a jump lands.
     */
    jumpEndFrame(){
        this.isLanding = true;
    }

    /**
     * Plays a looping animation.
     */
    playAnimationLoop(images) {
        if (images != this.lastImages) {
            this.currentImage = 0;
            this.lastImages = images;
        }

        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Plays a single animation once.
     */
    playAnimationSingle(images) {
        if (images != this.lastImages) { 
            this.currentImage = 0;
            this.animationFlag = false; 
            this.lastImages = images;
        }

        if (this.animationFlag) return;

        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;

        if (i == images.length - 1) {
            this.animationFlag = true;
            return true;
        }
        return false;
    }
    //#endregion

    //#region Collision
    /**
     * Initializes the collision rectangle.
     */
    setCollisionRect() {
        this.cX = this.x + this.collisionOffset.left;
        this.cY = this.y + this.collisionOffset.top;
        this.cW = this.width - this.collisionOffset.left - this.collisionOffset.right;
        this.cH = this.height - this.collisionOffset.top - this.collisionOffset.bottom;
    }

    /**
     * Updates the collision rectangle position.
     */
    updateCollisionRect() {
        this.cX = this.x + this.collisionOffset.left;
        this.cY = this.y + this.collisionOffset.top;
    }

    /**
     * Checks collision with another movable object.
     */
    isColliding(mo) {
        this.updateCollisionRect();
        mo.updateCollisionRect();

        return this.cX + this.cW > mo.cX && 
        this.cY + this.cH > mo.cY && 
        this.cX < mo.cX + mo.cW && 
        this.cY < mo.cY + mo.cH;
    }

    /**
     * Checks if the collision occurred from above.
     */
    isCollidingFromTop(mo) {
        const playerBottomPrev = this.cY + this.cH + this.speedY;
        const enemyTop = mo.cY;
        return playerBottomPrev < enemyTop;
    }
    //#endregion

    //#region Intervals
    /**
     * Applies gravity and vertical movement.
     */
    applyGravity = () => {
        if (this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
            this.isLanding = false;
        }

        if (!this.isAboveGround() && !this.isLanding) {
            this.jumpEndFrame();
        }
    }
    //#endregion
}
