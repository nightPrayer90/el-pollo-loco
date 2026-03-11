class World {
    character = new Character();
    level;

    ctx;
    canvas;
    keyboard;
    spawn_id;
    camera_x = 0;
    statusBar = new StatusBar();
    bottleUI = new StatusObject(0, this.character);
    coinUI = new StatusObject(1, this.character);

    overlay = new StatusOverlay(2);
    showOverlay = false;

    throwableObjects = [];
    thrownBottles = [];

    diedEnemies = [];
    particleSystems = [];

    clouds_L2 = [];
    clouds_L3 = [];

    yShake = 0;
    yShake_id;
    isScreenShake = false;

    constructor(canvas, level) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.level = level;
        this.initKeyboard();
        this.initLoadOverlay();
        this.draw();
        this.setWorldToCharacter();
        this.cloudsGenerator(6);
        this.initWorldInvervals();
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

    initWorldInvervals() {
        IntervalHub.startInterval(this.update, 16);
        this.spawn_id = IntervalHub.startInterval(this.chickenSpawner, 3000);
    }

    setWorldToCharacter() {
        this.character.world = this;
    }

    draw() {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);

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
        if (!this.showOverlay) this.addToMap(this.overlay);

        // Draw() wird immer wieder aufgerufen
        requestAnimationFrame(() => this.draw());
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

                this.createParticleSystem(collectable.IMAGES_VFX, collectable.cX + collectable.cW / 2, collectable.cY + collectable.cH / 2, 200, 200);
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
        this.bottleUI = null;
        this.coinUI = null;
        this.statusBar = null;

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
        console.log("show game over");
        this.overlay.initOverlay(1);
        setTimeout(() => {
            showBackToMenuBtn();
        }, 2000);
    }

    victroy() {
        console.log("show victroy");
        this.overlay.initOverlay(0);
        setTimeout(() => {
            showBackToMenuBtn();
        }, 2000);
    }
}
