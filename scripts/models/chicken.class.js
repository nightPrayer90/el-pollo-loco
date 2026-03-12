class Chicken extends MovableObject {
    x;
    y;
    height;
    width;
    speed;
    damage = 20;

    images_walking;
    images_dead;

    isBoss = false;
    isDead = false;

    animate_id;
    move_id;

    moveDirection;
    turnXPosition;

    collisionOffset = {};

    constructor(x, chickenType, turnXPosition) {
        super();
        this.x = x;
        this.chickenType(chickenType);
        this.setCollisionRect();
        this.loadImage(this.images_walking[0]);
        this.loadImages(this.images_walking);
        this.loadImages(this.images_dead);
        this.turnXPosition = turnXPosition;
        this.animate_id = IntervalHub.startInterval(this.animate, 100);
        this.move_id = IntervalHub.startInterval(this.move, 32);
        this.moveDirection = (Math.random() < 0.6) ? true : false;
    }

    move = () => {
        if (this.isDead == true) return;

        if (this.x <= -300) this.moveDirection = false;
        if (this.x >= this.turnXPosition) this.moveDirection = true;

        if (this.moveDirection == true) this.moveLeft();
        else this.moveRight();
    };

    // hitFrom 0-> PlayerJump 1->Bottle
    hit(world, hitFrom) {
        if (hitFrom == 0) 
            AudioHub.playOne(AudioHub.JUMP_HITCHICKEN);
        else
            AudioHub.playOne(AudioHub.THROW_HITCHICKEN);

        this.removeEnemyFromCollision(world);
    }

    animate = () => {
        if (this.isDead == false) {
            this.playAnimationLoop(this.images_walking);
        } else {
            if (this.playAnimationSingle(this.images_dead)) {
                this.y += 10;
                this.removeEnemyFormInverval();
            }
        }
    };

    removeEnemyFromCollision(world) {
        // INTERVAL Läuft noch aber sonst tut sich nichts mehr
        if (this.isDead == false) {
            // -> wir wechseln das array, somit fällt die Flasche aus der Collisionsabfrage raus
            const index = world.level.enemies.indexOf(this);
            if (index != -1) {
                world.level.enemies.splice(index, 1);
                world.diedEnemies.push(this);
            }
            this.isDead = true;
        }
    }

    // enemy wird aus dem intervalhub genommen
    removeEnemyFormInverval() {
        IntervalHub.stopInterval(this.animate_id);
        IntervalHub.stopInterval(this.move_id);
    }

    chickenType(type) {
        switch (type) {
            case 0:
                this.loadNormalChicken();
                break;
            case 1:
                this.loadSmallChicken();
                break;
        }
    }

    loadNormalChicken() {
        this.images_walking = ImageHub.CHICKEN_NORMAL.walk;
        this.images_dead = ImageHub.CHICKEN_NORMAL.dead;
        this.collisionOffset = {
            top: 15,
            right: 15,
            bottom: 0,
            left: 15,
        };
        this.height = 100;
        this.width = 95;
        this.y = 335;
        this.speed = 1 + Math.random() * 1;
    }

    loadSmallChicken() {
        this.images_walking = ImageHub.CHICKEN_SMALL.walk;
        this.images_dead = ImageHub.CHICKEN_SMALL.dead;
        this.collisionOffset = {
            top: 5,
            right: 5,
            bottom: 0,
            left: 5,
        };
        this.height = 60;
        this.width = 55;
        this.y = 370;
        this.speed = 3 + Math.random() * 2;
    }
}
