class Chicken extends MovableObject {
    x;
    y = 330;
    height = 100;
    width = 70;
    speed = 1 + Math.random() * 1;
    damage = 20;

    IMAGES_WALKING = ImageHub.CHICKEN_NORMAL.walk;
    IMAGES_DEAD = ImageHub.CHICKEN_NORMAL.dead;

    isDead = false;

    animate_id;
    move_id;

    collisionOffset = {
        top: 15,
        right: 15,
        bottom: 0,
        left: 15,
    };

    constructor() {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.x = Math.random() * 1500 + 200;

        this.setCollisionRect();
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.animate_id = IntervalHub.startInterval(this.animate, 100); 
        this.move_id = IntervalHub.startInterval(this.move, 60);
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
}
