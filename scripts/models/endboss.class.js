class Endboss extends MovableObject {
    y = 100;
    height = 350;
    width = 280;

    isHurt = false;
    isBoss = true;
    health = 5;

    collisionOffset = {
        top: 80,
        right: 50,
        bottom: 50,
        left: 30,
    };

    images_alert = ImageHub.ENDBOSS.alert;
    images_walking = ImageHub.ENDBOSS.walk;
    images_attack = ImageHub.ENDBOSS.attack;
    images_attack = ImageHub.ENDBOSS.attack;
    images_hurt = ImageHub.ENDBOSS.hurt;
    images_dead = ImageHub.ENDBOSS.dead;

    animate_id;
    world;

    constructor(x) {
        super();
        this.x = x;
        this.initImages();
        this.setCollisionRect();
        this.animate_id = IntervalHub.startInterval(this.animate, 100);
    }

    initImages() {
        this.loadImage(this.images_alert[0]);
        this.loadImages(this.images_alert);
        this.loadImages(this.images_walking);
        this.loadImages(this.images_attack);
        this.loadImages(this.images_hurt);
        this.loadImages(this.images_dead);
    }

    animate = () => {
        if (this.isDead()) {
            this.y += 15;
            if (this.playAnimationSingle(this.images_dead)) {
                this.world.gameIsOver(false);
            };
            return;
        }

        if (this.isHurt == true) {
            this.playAnimationLoop(this.images_hurt);
        } else {
            this.playAnimationLoop(this.images_alert);
        }
    };

    hit(world, hitFrom) {
        if (this.isHurt == true) return;

        this.isHurt = true;
        this.health -= 1;
        console.log("ENDBOSS HIT " + this.health);

        setTimeout(() => {
            this.isHurt = false;
        }, 500);
    }

    isDead() {
        return (this.health<=0);
    }
}
