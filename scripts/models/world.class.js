class World {
    character = new Character(this);
    level;

    ctx;
    canvas;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar();
    statusBossBar = new StatusBossBar();
    bottleUI = new StatusObject(0, this.character);
    coinUI = new StatusObject(1, this.character);
    statusTextObject = new StatusTextObject();

    overlay = new StatusOverlay(2);
    showOverlay = false;
    showBossBar = false;

    throwableObjects = [];
    thrownBottles = [];

    diedEnemies = [];
    particleSystems = [];

    clouds_L2 = [];
    clouds_L3 = [];

    yShake = 0;
    yShake_id;
    drawCanvas_Id;
    spawn_id;
    isScreenShake = false;

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
            this.statusTextObject.updateText("Find and collect all the coins to stop the chicken invasion.");
        }, 1200);
    }

    initWorldInvervalsAndObjects() {
        IntervalHub.startInterval(this.update, 16);
        this.spawn_id = IntervalHub.startInterval(this.chickenSpawner, 3000);
        this.cloudsGenerator(6);

        for (let i = 0; i < this.level.enemies.length; i++) {
            if (this.level.enemies[i].isBoss == true) {
                this.level.enemies[i].world = this;
                console.log("FOUNDTHEBOSS!");
                return;
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //-first bk -> no movement
        // bk layer
        this.addObjectsToMap(this.level.staticBackground);

        //level2
        this.ctx.translate(this.camera_x * 0.25, this.yShake);
        this.addObjectsToMap(this.level.backgroundObjects_L3);
        this.addObjectsToMap(this.clouds_L2);

        // level 3
        this.ctx.translate(this.camera_x * 0.25, -this.yShake);
        this.addObjectsToMap(this.level.backgroundObjects_L2);
        this.addObjectsToMap(this.clouds_L3);
        // bk layer

        // - last bk -> 100/ movement
        this.ctx.translate(this.camera_x * 0.5, this.yShake);

        this.addObjectsToMap(this.level.backgroundObjects_L1);
        this.addObjectsToMap(this.diedEnemies);
        this.addObjectsToMap(this.thrownBottles);
        this.addObjectsToMap(this.level.collectables);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.particleSystems);
        this.addObjectsToMap(this.level.obstacles);

        this.ctx.translate(-this.camera_x, -this.yShake);

        // --- space for ui ---
        this.addToMap(this.statusBar);
        this.addToMap(this.bottleUI);
        this.addToMap(this.coinUI);
        this.addTextToMap(this.statusTextObject);
        if (!this.showOverlay) this.addToMap(this.overlay); // TODO -> change bool direction
        if (this.showBossBar) this.addToMap(this.statusBossBar);

        // Draw() wird immer wieder aufgerufen
        this.drawCanvas_Id = requestAnimationFrame(() => this.draw());
    }

    addObjectsToMap(objects) {
        objects.forEach((object) => {
            this.addToMap(object);
        });
    }

    addToMap(mo) {
        if (mo == null) return;
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);

        if (mo.drawCollisionFrame) mo.drawFrame(this.ctx);
        if (mo.isDrawText) mo.drawText(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
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

    update = () => {
        this.checkCollisions();
    };

    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            // collision Character -> enemy
            if (this.character.isColliding(enemy)) {
                // character from top
                if (this.character.isCollidingFromTop(enemy) && this.character.speedY < 0) {
                    enemy.hit(this, 0);
                    this.character.speedY = 8;
                    this.character.collisionTimeout();
                    this.createParticleSystem(ImageHub.VFX.hit, enemy.cX + enemy.cW / 2, enemy.cY + enemy.cH / 2, 126, 126);
                    return;
                } else {
                    // character get damge
                    if (enemy.isDead == false) {
                        this.character.hit(enemy.damage);
                        this.triggerScreenShake(250);
                    }
                }
            }

            // collision bottle -> enemy
            if (this.throwableObjects.length > 0) {
                this.throwableObjects.forEach((bottle) => {
                    if (bottle.isColliding(enemy)) {
                        bottle.splash();
                        enemy.hit(this, 1);
                        this.triggerScreenShake(150);
                    }
                });
            }
        });

        this.level.collectables.forEach((collectable) => {
            // collision chracter -> collectable
            if (this.character.isColliding(collectable) && collectable.isCollect == false) {
                collectable.collect(this);

                this.createParticleSystem(collectable.images_vfx, collectable.cX + collectable.cW / 2, collectable.cY + collectable.cH / 2, 200, 200);
            }
        });
    }

    cloudsGenerator(cloundQuantity) {
        for (let i = 0; i <= cloundQuantity; i++) {
            this.generateCloud(true);
        }
    }

    generateCloud(generateRandomX) {
        if (Math.random() > 0.35) {
            let cloud = new Cloud(this.level.level_size, 0, generateRandomX);
            this.clouds_L2.push(cloud);
        } else {
            let cloud = new Cloud(this.level.level_size, 1, generateRandomX);
            this.clouds_L3.push(cloud);
        }
    }

    createParticleSystem(images, x, y, width, height) {
        this.particleSystems.push(new ParticleSystem(images, x, y, width, height, this));
    }

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

    triggerScreenShake(shakeTime) {
        if (this.isScreenShake == true) return;
        this.isScreenShake = true;

        this.yShake_id = IntervalHub.startInterval(this.sceenShake, 33);
        this.yShake = 2;

        setTimeout(() => {
            this.yShake = 0;
            IntervalHub.stopInterval(this.yShake_id);
            this.isScreenShake = false;
        }, shakeTime);
    }

    sceenShake = () => {
        if (this.yShake > 0) this.yShake = -2;
        else this.yShake = -this.yShake;
    };

    gameIsOver(isPlayerDead) {
        if (isPlayerDead == true) {
            this.bottleUI = null;
            this.coinUI = null;
            this.statusBar = null;
        }
        AudioHub.stopOne(AudioHub.CHAR_WALK);

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
        setTimeout(() => {
            this.reloadStartWindow();
        }, 2000);
    }

    victroy() {
        this.overlay.initOverlay(0);
        setTimeout(() => {
            this.reloadStartWindow();
        }, 3000);
    }

    reloadStartWindow() {
        IntervalHub.stopIntervals();
        showBackToMenuBtn();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        cancelAnimationFrame(this.drawCanvas_Id);
    }
}
