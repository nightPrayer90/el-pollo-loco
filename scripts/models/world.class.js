class World {
    character = new Character();
    level;

    ctx;
    canvas;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar();
    throwableObjects = [];
    thrownBottles =[];


    constructor(canvas, keyboard, level) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.level = level;
        this.draw();
        this.setWorld();
        IntervalHub.startInterval(this.run, 50);
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
        this.addObjectsToMap(this.level.clouds);

        // level 3
        this.ctx.translate(this.camera_x * 0.25, 0);
        this.addObjectsToMap(this.level.backgroundObjects_L2);
        // bk layer

        // - last bk -> 100/ movement
        this.ctx.translate(this.camera_x * 0.5, 0);
        this.addObjectsToMap(this.level.backgroundObjects_L1);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.thrownBottles);

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

    run = () => {
        this.checkCollisions();
        this.checkThrowObjects();
    };

    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            // collision Character -> enemy
            if (this.character.isColliding(enemy)) {
                this.character.hit(enemy.damage);
            }

            // collision bottle -> enemy
            if (this.throwableObjects.length > 0) {
                this.throwableObjects.forEach((bottle) => {
                    if (bottle.isColliding(enemy)) {

                        // ich muss hier unbedingt die referenz von bottle aus dem array nehmen!
                        bottle.splash();
                        console.log("enemy hit!");
                        enemy.hit();
                    }
                });
            }
        });
    }

    // wirklich hier? -> eigentlich gehört das werfen in den charakter
    checkThrowObjects() {
        if (this.keyboard.D && this.character.canThrow == true) {
            let bottle = new ThrowableObject(this.character.x, this.character.y, world);
            this.throwableObjects.push(bottle);
            this.character.canThrow = false;
            
            setTimeout(() => {
                this.character.canThrow = true;
            }, 1000);
        }
    }
}
