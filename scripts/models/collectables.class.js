/**
 * @class
 * Represents a collectable object such as coins or bottles.
 */
export class Collectable extends MovableObject {

     //#region Properties
    x;
    y;
    width;
    height;

    imagesSet = [];
    imagesVfx = ImageHub.VFX.coin;

    animate_id;
    isCollect = false;

    strArray = ["Nice, only 3 coins left!", "Pepe does a great job! You are ok too!", "Only one Coin left! Can you get the last one?", "You're ready to roast the rooster! (Now Spice the chicken!)"];
    //#endregion

    /**
     * Creates a collectable object.
     * @param {number} x - X position in the world.
     * @param {number} y - Y position in the world.
     * @param {number} type - Collectable type (0 = coin, 1 = bottle).
     */
    constructor(x, y, type) {
        super();
        this.type = type;
        this.x = x;
        this.y = y;
        this.init(type);
        this.setCollisionRect();
    }

    //#region Methods

    /**
     * Initializes the collectable depending on its type.
     */
    init(type) {
        switch (type) {
            case 0:
                this.initCoin();
                break;
            case 1:
                this.initBottle();
                break;
        }
        this.loadImage(this.imagesSet[0]);
        this.loadImages(this.imagesSet);
        if (this.imagesSet.length > 1) this.animate_id = IntervalHub.startInterval(this.animate, 250);
    }

    /**
     * Initializes coin properties.
     */
    initCoin() {
        this.width = 120;
        this.height = 120;
        this.collisionOffset = {
            top: 40,
            right: 40,
            bottom: 40,
            left: 40,
        };
        this.imagesSet = ImageHub.COLLECTABLES.coin;
    }

    /**
     * Initializes bottle properties.
     */
    initBottle() {
        this.width = 60;
        this.height = 60;
        this.collisionOffset = {
            top: 5,
            right: 5,
            bottom: 5,
            left: 5,
        };
        this.imagesSet = Math.random() < 0.5 ? ImageHub.COLLECTABLES.bottle_v1 : ImageHub.COLLECTABLES.bottle_v2;
    }

    /**
     * Handles collection logic.
     */
    collect(world) {
        switch (this.type) {
            case 0:
                this.collectCoin(world);
                break;
            case 1:
                this.collectBottle(world);
                break;
        }

        if (this.imagesSet.length > 1) this.removeCollectableFormInverval();
        this.removeCollectableFromCollision(world);
    }

    /**
     * Handles coin collection.
     */
    collectCoin(world) {
        world.statusTextObject.updateText(this.strArray[world.character.coins]);
        world.character.coins++;
        world.level.maxEnemies = Math.max(world.level.maxEnemies - 5, 0);
        world.coinUI.updateText(world.character.coins);
        world.triggerScreenShake(66);
        if (world.character.coins != 4) AudioHub.playOne(AudioHub.COLL_COIN);
        else AudioHub.playOne(AudioHub.COLL_COIN_4);
    }

    /**
     * Handles bottle collection.
     */
    collectBottle(world) {
        world.character.bottles++;
        world.bottleUI.updateText(world.character.bottles);
        AudioHub.playOne(AudioHub.COLL_BOTTLE);
    }

    /**
     * Removes the collectable from collision checks.
     */
    removeCollectableFromCollision(world) {
        if (this.isCollect == false) {
            const index = world.level.collectables.indexOf(this);
            if (index != -1) {
                world.level.collectables.splice(index, 1);
            }
            this.isCollect = true;
        }
    }

    /**
     * Stops the animation interval.
     */
    removeCollectableFormInverval() {
        IntervalHub.stopInterval(this.animate_id);
    }

    animate = () => {
        if (this.isCollect == false) {
            this.playAnimationLoop(this.imagesSet);
        }
    };
    //#endregion
}
