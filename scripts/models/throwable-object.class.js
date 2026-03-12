class ThrowableObject extends MovableObject {
    speed = 10;
    height = 50;
    width = 50;

    images_rotate_bottle = ImageHub.BOTTLE.rotate;
    images_broken_bottle = ImageHub.BOTTLE.broken;

    isHit = false;
    isSplash = false;
    isHitOnGround = false;

    animate_id;
    fly_id;
    world;

    constructor(x, y, world) {
        super();
        this.loadImage(this.images_rotate_bottle[0]);
        this.loadImages(this.images_rotate_bottle);

        this.x = x + 50;
        this.y = y + 100;
        this.world = world;

        this.setCollisionRect();
        this.throw();
    }

    throw() {
        let jumpHight = (180 - this.world.character.y) / 25;
        this.speedY = 10 + jumpHight;
        if (Keyboard.RIGHT == true) this.speed += 3;

        if (this.world.character.otherDirection) this.speed *= -1;

        this.animate_id = IntervalHub.startInterval(this.animate, 60);
        this.fly_id = IntervalHub.startInterval(this.flyWithGravity, 16);
    }

    flyWithGravity = () => {
        if (this.y < 400) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
            this.moveRight();
        } else {
            this.isHitOnGround = true;
            this.splash();
        }
    };

    animate = () => {
        if (this.isHit == false) {
            this.playAnimationLoop(this.images_rotate_bottle);
        }
        else {
            if (this.isHitOnGround == true) {
                AudioHub.playOne(AudioHub.THROW_HITGORUND);
                this.loadImage(this.images_broken_bottle[Math.floor(Math.random() * this.images_broken_bottle.length)]);
                
                //TODO: könnte man hier auch in die Superclass verschieben!
                IntervalHub.stopInterval(this.animate_id);
            }
        }
    };

    splash() {
        if (this.isSplash == true) return;
        this.disSplash = true

        this.removeBottleFromCollision();
        this.world.createParticleSystem(ImageHub.BOTTLE.splash, this.x+this.width/2, this.y + this.height-2, 150, 150);
        IntervalHub.stopInterval(this.fly_id); 
    }

    removeBottleFromCollision() {
        if (this.isHit == false) {
            // -> wir wechseln das array, somit fällt die Flasche aus der Collisionsabfrage raus
            const index = this.world.throwableObjects.indexOf(this);
            if (index != -1) {
                this.world.throwableObjects.splice(index, 1);
                if (this.isHitOnGround == true)
                    this.world.thrownBottles.push(this);
            }
            this.isHit = true;
        }
    }
}
