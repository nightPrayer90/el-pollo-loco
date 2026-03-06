class World {
    character = new Character();
    level;

    ctx;
    canvas;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar();

    throwableObjects = [];
    thrownBottles = [];

    diedEnemies = [];

    clouds_L2 = [];
    clouds_L3 = [];

    constructor(canvas, keyboard, level) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.level = level;
        this.draw();
        this.setWorld();
        this.cloudsGenerator(5);
        IntervalHub.startInterval(this.update, 16);
    }

    setWorld() {
        this.character.world = this;
    }

    draw() {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);

        //-first bk -> no movement
        // bk layer
        this.addObjectsToMap(this.level.staticBackground);

        //level2
        this.ctx.translate(this.camera_x * 0.25, 0);
        this.addObjectsToMap(this.level.backgroundObjects_L3);
        this.addObjectsToMap(this.clouds_L2);

        // level 3
        this.ctx.translate(this.camera_x * 0.25, 0);
        this.addObjectsToMap(this.level.backgroundObjects_L2);
        this.addObjectsToMap(this.clouds_L3);
        // bk layer

        // - last bk -> 100/ movement
        this.ctx.translate(this.camera_x * 0.5, 0);
        this.addObjectsToMap(this.level.backgroundObjects_L1);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.thrownBottles);
        this.addObjectsToMap(this.diedEnemies);

        this.ctx.translate(-this.camera_x, 0);

        // --- space for ui ---
        this.addToMap(this.statusBar);

        // Draw() wird immer wieder aufgerufen
        requestAnimationFrame(() => this.draw());
    }

    addObjectsToMap(objects) {
        objects.forEach((object) => {
            this.addToMap(object);
        });
    }

    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);

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
        this.throwBottle();
    };

    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            // collision Character -> enemy
            if (this.character.isColliding(enemy)) {
                if(this.character.isCollidingFromTop(enemy) && this.character.speedY < 0) {
                    enemy.hit(this);
                    this.character.speedY = 8;
                }
                else 
                {
                    if (enemy.isDead == false)
                        this.character.hit(enemy.damage);
                }
            }

            // collision bottle -> enemy
            if (this.throwableObjects.length > 0) {
                this.throwableObjects.forEach((bottle) => {
                    if (bottle.isColliding(enemy)) {
                        bottle.splash();
                        console.log("enemy hit!");
                        enemy.hit(this);
                    }
                });
            }
        });
    }

    // wirklich hier? -> eigentlich gehört das werfen in den charakter
    throwBottle() {
        if (this.keyboard.D && this.character.canThrow == true) {
            let bottle = new ThrowableObject(this.character.x, this.character.y, world);
            this.throwableObjects.push(bottle);
            this.character.canThrow = false;

            setTimeout(() => {
                this.character.canThrow = true;
            }, 1000);
        }
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
}
