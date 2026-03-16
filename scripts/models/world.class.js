import { ImageHub } from "../manager-classes/image-hub.js";
import { AudioHub } from "../manager-classes/audio-hub.js";
import { IntervalHub } from "../manager-classes/interval-hub.js";
import { Character } from "./character.class.js";
import { Chicken } from "./chicken.class.js";
import { Cloud } from "./cloud.class.js";
import { ParticleSystem } from "./particle-system.class.js";
import { StatusBar } from "./status-bar.class.js";
import { StatusBossBar } from "./status-boss-bar.class.js";
import { StatusObject } from "./status-object.class.js";
import { StatusOverlay } from "./status-overlay.class.js";
import { StatusTextObject } from "./status-text.class.js";
import { Keyboard } from "./keyboard.class.js";
import { showBackToMenuBtn } from "../overlayUI.js";
import { CollisionHub } from "../manager-classes/collision-hub.js";

/**
 * @class
 * Represents the game world.
 * Handles rendering, object management, collisions and game state.
 */
export class World {
    //#region Properties
    level;
    ctx;
    canvas;
    keyboard;

    overlay = new StatusOverlay(2);
    statusTextObject = new StatusTextObject();
    character = new Character(this);
    statusBar = new StatusBar();
    statusBossBar = new StatusBossBar();
    bottleUI = new StatusObject(0, this.character);
    coinUI = new StatusObject(1, this.character);

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
    /**
     * Initializes keyboard input and button events.
     */
    initKeyboard() {
        Keyboard.addEvents();
        Keyboard.addButtonEvents();
    }

    /**
     * Activates the game after the loading overlay.
     */
    initLoadOverlay() {
        setTimeout(() => {
            this.showOverlay = true;
            this.overlay.stopInterval();
            this.initPlayerAndEnemyIntervals();
        }, 1200);
    }

    /**
     * Displays the initial mission text.
     */
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

    /**
     * Starts intervals for all enemies and the player.
     */
    initPlayerAndEnemyIntervals() {
        for (let i = 0; i < this.level.enemies.length; i++) {
            if (!this.level.enemies[i].isBoss) {
                this.level.enemies[i].initStartInvervals(true);
            }
        }
        this.character.startPlayerIntervals();
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

    /**
     * Draws the far background layer.
     */
    drawBackgroundLayer() {
        this.addObjectsToMap(this.level.staticBackground);
    }

    /**
     * Draws the far background layer.
     */
    drawBackgroundLayerFar() {
        this.addObjectsToMap(this.level.backgroundObjects_L3);
        this.addObjectsToMap(this.clouds_L2);
    }

    /**
     * Draws the near background layer.
     */
    drawBackgroundLayerNear() {
        this.addObjectsToMap(this.level.backgroundObjects_L2);
        this.addObjectsToMap(this.clouds_L3);
    }

    /**
     * Draws all player layer objects.
     */
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

    /**
     * Draws all in-game UI elements.
     */
    drawInGameUIObjects() {
        this.addToMap(this.statusBar);
        this.addToMap(this.bottleUI);
        this.addToMap(this.coinUI);
        this.addTextToMap(this.statusTextObject);
        if (!this.showOverlay) this.addToMap(this.overlay);
        if (this.showBossBar) this.addToMap(this.statusBossBar);
    }

    /**
     * Draws a list of objects.
     * @param {Array} objects - Objects to draw.
     */
    addObjectsToMap(objects) {
        objects.forEach((object) => {
            this.addToMap(object);
        });
    }

    /**
     * Draws a single map object.
     * @param {Object} mo - Map object.
     */
    addToMap(mo) {
        if (mo == null) return;
        if (mo.otherDirection) this.flipImage(mo);
        mo.draw(this.ctx);
        if (mo.drawCollisionFrame) mo.drawFrame(this.ctx);
        if (mo.isDrawText) mo.drawText(this.ctx);
        if (mo.otherDirection) this.flipImageBack(mo);
    }

    /**
     * Draws a text object.
     * @param {Object} to - Text object.
     */
    addTextToMap(to) {
        to.drawText(this.ctx);
    }

    /**
     * Flips an object horizontally before drawing.
     * @param {Object} mo - Map object.
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restores the canvas after flipping.
     * @param {Object} mo - Map object.
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
    //#endregion

    //#region Methods
    /**
     * Generates a number of clouds and assigns them randomly - to the far or near cloud layer.
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

    //#region Game State Controls
    reloadStartWindow() {
        IntervalHub.stopIntervals();
        showBackToMenuBtn();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        cancelAnimationFrame(this.drawCanvas_Id);
    }

    /**
     * Triggers the game over state and stops all active intervals.
     * @param {boolean} isPlayerDead - Determines if the player lost or won.
     */
    gameIsOver(isPlayerDead) {
        if (this.isGameOver) return;
        this.isGameOver = true;

        setTimeout(() => {
            IntervalHub.stopIntervals();
            this.character.stopPlayerIntervals();
            this.showOverlay = false;
            if (isPlayerDead) {
                this.showEndScreen(1);
            } else {
                this.showEndScreen(0);
            }
        }, 1000);
    }

    /**
     * Shows the end overlay and returns to the start screen.
     * @param {number} type - 0 = victory, 1 = defeat.
     */
    showEndScreen(type) {
        this.overlay.initOverlay(type);
        setTimeout(() => {
            this.reloadStartWindow();
        }, 3500);
    }
    //#endregion

    //#region Intervals
    /**
     * Updates the game state by checking collisions between all relevant entities.
     */
    update = () => {
        CollisionHub.checkCollisions(this.level.enemies, this.level.collectables, this.throwableObjects, this.character, this);
    };

    /**
     * Toggles the vertical screen shake direction.
     */ k;
    sceenShake = () => {
        if (this.yShake > 0) this.yShake = -2;
        else this.yShake = -this.yShake;
    };

    /**
     * Spawns chicken enemies if the max enemy limit is not reached.
     * Stops the spawn interval if maxEnemies is 0 or less.
     */
    chickenSpawner = () => {
        if (this.level.maxEnemies <= 0) {
            IntervalHub.stopInterval(this.spawn_id);
        }

        if (this.level.enemies.length >= this.level.maxEnemies) return;

        let xSpawnPos = (this.level.level_size - 1000) / 2;
        let turnXPosition = this.level.level_size - 1000;
        let type = Math.random() < 0.35 ? 1 : 0;
        this.level.enemies.push(new Chicken(xSpawnPos, type, turnXPosition, true));
    };
    //#endregion
}
