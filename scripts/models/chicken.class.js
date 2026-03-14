/**
 * @class
 * Represents a chicken enemy with different types and behaviors.
 */
export class Chicken extends MovableObject {
    //#region Properties
    x;
    y;
    height;
    width;
    speed;
    damage = 20;

    imagesWalking;
    imagesDead;

    isBoss = false;
    isDead = false;

    animate_id;
    move_id;

    moveDirection;
    turnXPosition;

    collisionOffset = {};
    //#endregion

    /**
     * Creates a chicken enemy.
     * @param {number} x - Spawn position on the x axis.
     * @param {number} chickenType - Type identifier of the chicken.
     * @param {number} turnXPosition - Position where the chicken turns around.
     */
    constructor(x, chickenType, turnXPosition, startInvervals) {
        super();
        this.x = x;
        this.chickenType(chickenType);
        this.setCollisionRect();
        this.initLoadImages();
        this.initStartInvervals(startInvervals);
        this.turnXPosition = turnXPosition;
        this.moveDirection = Math.random() < 0.6 ? true : false;
    }

    initLoadImages() {
        this.loadImage(this.imagesWalking[0]);
        this.loadImages(this.imagesWalking);
        this.loadImages(this.imagesDead);
    }

    initStartInvervals(startInvervals) {
        if (!startInvervals) return;
        this.animate_id = IntervalHub.startInterval(this.animate, 100);
        this.move_id = IntervalHub.startInterval(this.move, 32);
        this.applyGravity_id = IntervalHub.startInterval(this.applyGravity, 16);
    }

    //#region Methods
    /**
     * Handles enemy hit logic.
     * @param {World} world
     * @param {number} hitFrom - 0: player jump, 1: bottle
     */
    hit(world, hitFrom) {
        if (hitFrom == 0) AudioHub.playOne(AudioHub.JUMP_HITCHICKEN);
        else AudioHub.playOne(AudioHub.THROW_HITCHICKEN);

        this.removeEnemyFromCollision(world);
    }

    /**
     * Initializes the chicken based on its type.
     * @param {number} type
     */
    chickenType(type) {
        switch (type) {
            case 0:
                this.loadNormalChicken();
                break;
            case 1:
                this.loadSmallChicken();
                break;
            case 2:
                this.loadBossSpawnChickes();
                break;
        }
    }

    /**
     * Loads the normal chicken configuration.
     */
    loadNormalChicken() {
        this.imagesWalking = ImageHub.CHICKEN_NORMAL.walk;
        this.imagesDead = ImageHub.CHICKEN_NORMAL.dead;
        this.collisionOffset = {
            top: 15,
            right: 15,
            bottom: 0,
            left: 15,
        };
        this.height = 100;
        this.width = 95;
        this.y = 335 + Math.floor(Math.random() * 10);
        this.groundY = this.y;
        this.speed = 1 + Math.random() * 1;
    }

    /**
     * Loads the small chicken configuration.
     */
    loadSmallChicken() {
        this.imagesWalking = ImageHub.CHICKEN_SMALL.walk;
        this.imagesDead = ImageHub.CHICKEN_SMALL.dead;
        this.collisionOffset = {
            top: 5,
            right: 5,
            bottom: 0,
            left: 5,
        };
        this.height = 60;
        this.width = 55;
        this.y = 370 + Math.floor(Math.random() * 5);
        this.groundY = this.y;
        this.speed = 3 + Math.random() * 2;
    }

    /**
     * Loads the chicken configuration used by boss spawns.
     */
    loadBossSpawnChickes() {
        this.imagesWalking = ImageHub.CHICKEN_SMALL.walk;
        this.imagesDead = ImageHub.CHICKEN_SMALL.dead;
        this.collisionOffset = {
            top: 5,
            right: 5,
            bottom: 0,
            left: 5,
        };
        this.height = 60;
        this.width = 55;
        this.y = 25;
        this.groundY = 370;

        this.x = this.x + this.getRandomRange(200, 100);
        this.speed = 3 + Math.random() * 2;
    }

    /**
     * Removes the enemy from the world collision list.
     */
    removeEnemyFromCollision(world) {
        if (this.isDead == false) {
            const index = world.level.enemies.indexOf(this);
            if (index != -1) {
                world.level.enemies.splice(index, 1);
                if (this.isLanding == true) world.diedEnemies.push(this);
            }
            this.isDead = true;
        }
    }

    /**
     * Stops all intervals used by the enemy.
     */
    removeEnemyFormInverval() {
        IntervalHub.stopInterval(this.animate_id);
        IntervalHub.stopInterval(this.move_id);
        IntervalHub.stopInterval(this.applyGravity_id);
    }

    /**
     * Returns a random number with random sign within a range.
     */
    getRandomRange(maxValue, minAbs) {
        let sign = Math.random() < 0.5 ? -1 : 1;
        return sign * (Math.random() * (maxValue - minAbs) + minAbs);
    }
    //#endregion

    //#region Intervals
    move = () => {
        if (this.isDead == true) return;
        if (this.isLanding == false) return;

        if (this.x <= -300) this.moveDirection = false;
        if (this.x >= this.turnXPosition) this.moveDirection = true;

        if (this.moveDirection == true) this.moveLeft();
        else this.moveRight();
    };

    animate = () => {
        if (this.isDead == false) {
            this.playAnimationLoop(this.imagesWalking);
        } else {
            if (this.playAnimationSingle(this.imagesDead)) {
                this.y += 10;
                this.removeEnemyFormInverval();
            }
        }
    };
    //#endregion
}
