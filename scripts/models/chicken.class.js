class Chicken extends MovableObject {
    x;
    y;
    height;
    width;
    speed;
    damage = 20;

    IMAGES_WALKING;
    IMAGES_DEAD;

    isDead = false;

    animate_id;
    move_id;

    collisionOffset = {};
    ;

    constructor(x, chickenType) {
        super();
        this.x = x;
        this.chickenType(chickenType);
        this.setCollisionRect();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.animate_id = IntervalHub.startInterval(this.animate, 100);
        this.move_id = IntervalHub.startInterval(this.move, 32);
    }

    move = () => {
        if (this.isDead == true) return;

        this.moveLeft();
    };

    hit(world) {
        console.log("ich bin getroffen");
        this.removeEnemyFromCollision(world);
    }

    animate = () => {
        if (this.isDead == false) {
            this.playAnimationLoop(this.IMAGES_WALKING);
        } else {
            if (this.playAnimationSingle(this.IMAGES_DEAD)) {
                this.y +=10;
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
        this.IMAGES_WALKING = ImageHub.CHICKEN_NORMAL.walk;
        this.IMAGES_DEAD = ImageHub.CHICKEN_NORMAL.dead;
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
        this.IMAGES_WALKING = ImageHub.CHICKEN_SMALL.walk;
        this.IMAGES_DEAD = ImageHub.CHICKEN_SMALL.dead;
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
