/**
 * @class
 * Represents the game world.
 * Handles rendering, object management, collisions and game state.
 */
class World {
    //#region Properties
    level;
    ctx;
    canvas;
    keyboard;

    character = new Character(this);
    statusBar = new StatusBar();
    statusBossBar = new StatusBossBar();
    bottleUI = new StatusObject(0, this.character);
    coinUI = new StatusObject(1, this.character);
    statusTextObject = new StatusTextObject();
    overlay = new StatusOverlay(2);

    throwableObjects = [];
    thrownBottles = [];
    diedEnemies = [];
    particleSystems = [];
    clouds_L2 = [];
    clouds_L3 = [];

    showOverlay = false;
    showBossBar = false;
    isScreenShake = false;
    isGameOver = false;

    camera_x = 0;
    yShake = 0;

    yShake_id;
    drawCanvas_Id;
    spawn_id;
    //#endregion

    /**
     * Creates the game world.
     * @param {HTMLCanvasElement} canvas
     * @param {Level} level
     */
    constructor(canvas, level) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.level = level;
        this.initKeyboard();
        this.initLoadOverlay();
        this.initInfoText();
        this.initWorldInvervalsAndObjects();
        this.draw();
    }

    //#region Init
    initKeyboard() {
        Keyboard.addEvents();
        Keyboard.addButtonEvents();
    }

    initLoadOverlay() {
        setTimeout(() => {
            this.showOverlay = true;
            this.overlay.stopInterval();
        }, 700);
    }

    initInfoText() {
        setTimeout(() => {
            this.statusTextObject.updateText("Find and collect all the coins to stop the chicken invasion.", 1);
        }, 1200);
    }

    /**
     * Initializes world systems such as update loop, enemy spawning and clouds.
     */
    initWorldInvervalsAndObjects() {
        IntervalHub.startInterval(this.update, 16);
        this.spawn_id = IntervalHub.startInterval(this.chickenSpawner, 3000);
        this.cloudsGenerator(6);

        for (let i = 0; i < this.level.enemies.length; i++) {
            if (this.level.enemies[i].isBoss) {
                this.level.enemies[i].world = this;
                return;
            }
        }
    }
    //#endregion

    //#region Draw
    /**
     * Main render loop of the world.
     * Draws all background layers, entities and UI.
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // --- static background layer no movement ---
        this.drawBackgroundLayer();

        // --- far ---
        this.ctx.translate(this.camera_x * 0.25, this.yShake);
        this.drawBackgroundLayerFar();

        // --- mid ---
        this.ctx.translate(this.camera_x * 0.25, -this.yShake);
        this.drawBackgroundLayerNear();

        // --- player layer ---
        this.ctx.translate(this.camera_x * 0.5, this.yShake);
        this.drawPlayerLayerObjects();

        // --- space for ui ---
        this.ctx.translate(-this.camera_x, -this.yShake);
        this.drawInGameUIObjects();

        this.drawCanvas_Id = requestAnimationFrame(() => this.draw());
    }

    drawBackgroundLayer() {
        this.addObjectsToMap(this.level.staticBackground);
    }

    drawBackgroundLayerFar() {
        this.addObjectsToMap(this.level.backgroundObjects_L3);
        this.addObjectsToMap(this.clouds_L2);
    }

    drawBackgroundLayerNear() {
        this.addObjectsToMap(this.level.backgroundObjects_L2);
        this.addObjectsToMap(this.clouds_L3);
    }

    drawPlayerLayerObjects() {
        this.addObjectsToMap(this.level.backgroundObjects_L1);
        this.addObjectsToMap(this.diedEnemies);
        this.addObjectsToMap(this.thrownBottles);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.collectables);
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.particleSystems);
        this.addObjectsToMap(this.level.obstacles);
    }

    drawInGameUIObjects() {
        this.addToMap(this.statusBar);
        this.addToMap(this.bottleUI);
        this.addToMap(this.coinUI);
        this.addTextToMap(this.statusTextObject);
        if (!this.showOverlay) this.addToMap(this.overlay);
        if (this.showBossBar) this.addToMap(this.statusBossBar);
    }

    addObjectsToMap(objects) {
        objects.forEach((object) => {
            this.addToMap(object);
        });
    }

    addToMap(mo) {
        if (mo == null) return;

        if (mo.otherDirection) this.flipImage(mo);
        mo.draw(this.ctx);

        if (mo.drawCollisionFrame) mo.drawFrame(this.ctx);
        if (mo.isDrawText) mo.drawText(this.ctx);

        if (mo.otherDirection) this.flipImageBack(mo);
    }

    addTextToMap(to) {
        to.drawText(this.ctx);
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
    //#endregion

    //#region Collision
    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            // character -> enemy
            if (this.character.isColliding(enemy)) {
                this.handleCollisionPlayerEnemy(enemy);
            }

            // bottle -> enemy
            if (this.throwableObjects.length > 0) {
                this.throwableObjects.forEach((bottle) => {
                    this.handleCollionEnemyBottle(bottle, enemy);
                });
            }
        });

        // character -> collectable
        this.level.collectables.forEach((collectable) => {
            if (this.character.isColliding(collectable) && collectable.isCollect == false) {
                this.handleCollisionPlayerCollectable(collectable);
            }
        });
    }

    handleCollisionPlayerEnemy(enemy) {
        if (this.character.isCollidingFromTop(enemy) && this.character.speedY < 0) {
            this.handleCollisionFromTop(enemy);
            return;
        } else {
            this.handleCollisionCharacterGetHit(enemy);
        }
    }

    handleCollisionFromTop(enemy) {
        enemy.hit(this, 0);
        this.character.speedY = 8;
        this.character.collisionTimeout();
        this.createParticleSystem(ImageHub.VFX.hit, enemy.cX + enemy.cW / 2, enemy.cY + enemy.cH / 2, 126, 126);
    }

    handleCollisionCharacterGetHit(enemy) {
        if (!enemy.isDead) {
            this.character.hit(enemy.damage);
            this.triggerScreenShake(250);
        }
    }

    handleCollionEnemyBottle(bottle, enemy) {
        if (bottle.isColliding(enemy)) {
            bottle.splash();
            enemy.hit(this, 1);
            this.triggerScreenShake(150);
        }
    }

    handleCollisionPlayerCollectable(collectable) {
        collectable.collect(this);
        this.createParticleSystem(collectable.images_vfx, collectable.cX + collectable.cW / 2, collectable.cY + collectable.cH / 2, 200, 200);
    }
    //#endregion

    //#region Methods
    /**
     * Generates a number of clouds and assigns them randomly
     * to the far or near cloud layer.
     * @param {number} cloundQuantity - Number of clouds to generate.
     */
    cloudsGenerator(cloundQuantity) {
        for (let i = 0; i <= cloundQuantity; i++) {
            if (Math.random() > 0.35) {
                let cloud = new Cloud(this.level.level_size, 0, true);
                this.clouds_L2.push(cloud);
            } else {
                let cloud = new Cloud(this.level.level_size, 1, true);
                this.clouds_L3.push(cloud);
            }
        }
    }

    /**
     * Creates a particle system and adds it to the world.
     * Used for effects like hits, splashes or coin collection.
     * @param {string[]} images - Animation image set.
     * @param {number} x - Spawn position X.
     * @param {number} y - Spawn position Y.
     * @param {number} width - Particle width.
     * @param {number} height - Particle height.
     */
    createParticleSystem(images, x, y, width, height) {
        this.particleSystems.push(new ParticleSystem(images, x, y, width, height, this));
    }

    /**
     * Triggers a short screen shake effect.
     * @param {number} shakeTime - Duration of the shake in milliseconds.
     */
    triggerScreenShake(shakeTime) {
        if (this.isScreenShake) return;
        this.isScreenShake = true;

        this.yShake_id = IntervalHub.startInterval(this.sceenShake, 33);
        this.yShake = 2;

        setTimeout(() => {
            this.yShake = 0;
            IntervalHub.stopInterval(this.yShake_id);
            this.isScreenShake = false;
        }, shakeTime);
    }
    //#endregion

    //#region Game End Controls
    reloadStartWindow() {
        IntervalHub.stopIntervals();
        showBackToMenuBtn();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        cancelAnimationFrame(this.drawCanvas_Id);
    }

    gameIsOver(isPlayerDead) {
        if (this.isGameOver) return;
        this.isGameOver = true;

        if (isPlayerDead) {
            this.bottleUI = null;
            this.coinUI = null;
            this.statusBar = null;
        }
        this.character.stopMoveSound();

        setTimeout(() => {
            IntervalHub.stopIntervals();
            this.showOverlay = false;
            if (isPlayerDead) {
                this.gameOver();
            } else {
                this.victroy();
            }
        }, 1000);
    }

    gameOver() {
        this.overlay.initOverlay(1);
        AudioHub.playOne(AudioHub.GAME_OVER);
        setTimeout(() => {
            this.reloadStartWindow();
        }, 3500);
    }

    victroy() {
        this.overlay.initOverlay(0);
        AudioHub.playOne(AudioHub.GAME_WIN);
        setTimeout(() => {
            this.reloadStartWindow();
        }, 3500);
    }
    //#endregion

    //#region Intervals
    update = () => {
        this.checkCollisions();
    };

    sceenShake = () => {
        if (this.yShake > 0) this.yShake = -2;
        else this.yShake = -this.yShake;
    };

    /**
     * Generates a number of clouds and assigns them randomly
     * to the far or near cloud layer.
     * @param {number} cloundQuantity - Number of clouds to generate.
     */
    chickenSpawner = () => {
        if (this.level.maxEnemies <= 0) {
            IntervalHub.stopInterval(this.spawn_id);
        }

        if (this.level.enemies.length >= this.level.maxEnemies) return;

        let xSpawnPos = (this.level.level_size - 1000) / 2;
        let turnXPosition = this.level.level_size - 1000;
        let type = Math.random() < 0.35 ? 1 : 0;
        this.level.enemies.push(new Chicken(xSpawnPos, type, turnXPosition));
    };
    //#endregion
}
