class Endboss extends MovableObject {
    y = 100;
    groundY = 100;
    acceleration = 1.5;
    jumpPower = 22;

    height = 350;
    width = 280;

    isHurt = false;
    isBoss = true;
    isAttack = false;
    isLanding = true;
    health = 5;

    isWaitingState = true;
    isAttackState = false;

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
    move_id;
    applyGravity_id;
    world;

    constructor(x) {
        super();
        this.x = x;
        this.initImages();
        this.setCollisionRect();
        this.animate_id = IntervalHub.startInterval(this.animate, 100);
        this.applyGravity_id = IntervalHub.startInterval(this.applyGravity, 16);
    }

    initImages() {
        this.loadImage(this.images_alert[0]);
        this.loadImages(this.images_alert);
        this.loadImages(this.images_walking);
        this.loadImages(this.images_attack);
        this.loadImages(this.images_hurt);
        this.loadImages(this.images_dead);
    }

    changeStage() {
        this.isWaitingState = false;
        this.isAttackState = true;

        this.move_id = IntervalHub.startInterval(this.animate, 33);
    }

    animate = () => {
        if (this.isDead()) {
            this.y += 15;
            if (this.playAnimationSingle(this.images_dead)) {
                this.world.gameIsOver(false);
            }
            return;
        }

        if (this.isHurt == true) {
            this.playAnimationLoop(this.images_hurt);
        } else {
            if (this.isAttack == true) {
                if (this.playAnimationSingle(this.images_attack)) {
                    this.isAttack = false;
                }
            } else {
                this.playAnimationLoop(this.images_alert);
            }
        }
    };

    move = () => {};

    hit(world, hitFrom) {
        if (this.isHurt == true) return;
        if (this.isWaitingState == false) {
            this.takeDamge();
        } else {
            this.isAttack = true;
            this.jump();
        }
    }

    takeDamge() {
        this.isHurt = true;
        this.health -= 1;
        console.log("ENDBOSS HIT " + this.health);

        setTimeout(() => {
            this.isHurt = false;
        }, 500);
    }

    isDead() {
        return this.health <= 0;
    }

    jumpEndFrame() {
        super.jumpEndFrame();
        AudioHub.playOne(AudioHub.CHAR_LANDING);
        this.world.createParticleSystem(ImageHub.VFX.jump, this.x + this.width / 2, this.y + this.height - 30, 500, 500);
        this.world.triggerScreenShake(300);

        for (let i = 0; i < 3; i++) {
            this.world.level.enemies.push(new Chicken(this.world.character.x, 2, 5000));
        }
    }
}
