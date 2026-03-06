class ThrowableObject extends MovableObject {
    speed = 10;
    height = 60;
    width = 60;

    ROTATE_BOTTLE = ImageHub.BOTTLE.rotate;
    SPLASH_BOTTLE = ImageHub.BOTTLE.splash;

    isHit = false;

    world;

    constructor(x, y, world) {
        super();
        this.loadImage(this.ROTATE_BOTTLE[0]);
        this.loadImages(this.ROTATE_BOTTLE);
        this.loadImages(this.SPLASH_BOTTLE);
        this.x = x + 50;
        this.y = y + 100;
        this.world = world;

        this.setCollisionRect();
        this.throw();
        IntervalHub.startInterval(this.animate, 60);
    }

    throw() {
        let jumpHight = (180-this.world.character.y)/25;
        this.speedY = 10 + jumpHight;
        if (this.world.keyboard.RIGHT == true) this.speed += 3;

        if(this.world.character.otherDirection)
            this.speed *= -1;

        IntervalHub.startInterval(this.flyWithGravity, 16);
    }

    flyWithGravity = () => {
        if (this.y < 400) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
            this.moveRight();
        } else {
            this.splash();
        }
    };

    splash() {
        this.removeBottleFromCollision();
    }

    animate = () => {
        if (this.isHit == false) {
            this.playAnimationLoop(this.ROTATE_BOTTLE);
        } else {
            this.playAnimationSingle(this.SPLASH_BOTTLE);
        }
    };

    removeBottleFromCollision() {
        // MAYBE TODO: -> INTERVAL Läuft noch aber sonst tut sich nichts mehr
        if (this.isHit == false) {
            // -> wir wechseln das array, somit fällt die Flasche aus der Collisionsabfrage raus
            const index = this.world.throwableObjects.indexOf(this);
            if (index != -1) {
                this.world.throwableObjects.splice(index, 1);
                this.world.thrownBottles.push(this);
            }
            this.isHit = true;
        }
    }
}
