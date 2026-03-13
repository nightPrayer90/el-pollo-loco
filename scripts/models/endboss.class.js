class Endboss extends MovableObject {
    y = 240;
    groundY = 240;
    acceleration = 1.5;
    jumpPower = 22;
    damage = 20;

    height = 200;
    width = 150;

    isHurt = false;
    isBoss = true;
    isDead = false;
    isBlockMoving = false;
    isAttack = false;
    canAttack = false;
    isLanding = true;
    health = 5;
    speed = 4.5;

    strArray = ["This guy is only interested in rich Mexicans!", "You're too poor for him to be interested in you.", "Pepe is short on cash.", "Your poverty makes me sick!", "Hmm, your coins will taste good to me. Just like your flesh."];

    isWaitingState = true;
    isAttackState = false;

    collisionOffset = {
        top: 90,
        right: 30,
        bottom: 20,
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
        AudioHub.playOne(AudioHub.ENDBOSS_CHANGE_STATE);

        this.world.showBossBar = true;
        this.move_id = IntervalHub.startInterval(this.move, 16);
        this.world.character.changeCameraOffset();
        this.isBlockMoving = false;
        this.canAttack = true;
    }

    animate = () => {
        if (this.isDie()) {
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
                if (this.isWaitingState == true) this.playAnimationLoop(this.images_alert);
                else this.playAnimationLoop(this.images_walking);
            }
        }
    };

    move = () => {
        if (this.isDead == true) return;
        if (this.isAttack == true) return;
        if (this.isBlockMoving == true) return;

        const directionOffset = 400;

        if (this.x > this.world.character.x + directionOffset) {
            if (this.moveDirection !== true) {
                this.moveDirection = true;
                this.doAttack();
                this.blockMoveing();
            }
        }

        if (this.x < this.world.character.x - directionOffset) {
            if (this.moveDirection !== false) {
                this.moveDirection = false;
                this.doAttack();
                this.blockMoveing();
            }
        }

        if (this.moveDirection == true) this.moveLeft();
        else this.moveRight();
    };

    hit(world, hitFrom) {
        if (this.isHurt == true) return;
        if (this.isWaitingState == false) {
            this.takeDamge();
        } else {
            this.isAttack = true;
            this.jump();
            AudioHub.playOne(AudioHub.ENDBOSS_HIT_S1);
        }
    }

    doAttack() {
        if (this.canAttack == false) return;
        this.isAttack = true;
        this.jump();

        this.setCoolDownAttack();
    }

    setCoolDownAttack() {
        this.canAttack = false;
        setTimeout(() => {
            this.canAttack = true;
        }, 3000);
    }

    takeDamge() {
        this.isHurt = true;
        this.health -= 1;
        this.speed++;
        this.world.statusBossBar.setHealth(this.health);
        if (this.health > 0) AudioHub.playOne(AudioHub.ENDBOSS_HIT_S2);
        else  AudioHub.playOne(AudioHub.ENDBOSS_DIE);
        setTimeout(() => {
            this.isHurt = false;
        }, 500);
    }

    isDie() {
        return this.health <= 0;
    }

    jump() {
        super.jump();
        AudioHub.playOne(AudioHub.ENDBOSS_JUMP_ATTACK);
    }

    jumpEndFrame() {
        if (this.isDie()) return;
        super.jumpEndFrame();
        AudioHub.playOne(AudioHub.ENDBOSS_LANDING);
        this.world.createParticleSystem(ImageHub.VFX.jump, this.x + this.width / 2, this.y + this.height - 30, 500, 500);
        this.world.triggerScreenShake(300);
        this.chickenSpawnAttack(3);
        this.isAttack = false;

        if (this.isWaitingState == true) {
            if (this.world.character.coins >= 4) {
                this.changeStage();
                this.world.statusTextObject.updateText(this.strArray[4]);
            } else {
                let ran = Math.floor(Math.random() * (this.strArray.length - 1));
                console.log(ran);
                this.world.statusTextObject.updateText(this.strArray[ran]);
            }
        }
    }

    chickenSpawnAttack(spawnQuantity) {
        if (this.isDie()) return;

        for (let i = 0; i < spawnQuantity; i++) {
            this.world.level.enemies.push(new Chicken(this.world.character.x, 2, 5000));
        }
    }

    blockMoveing() {
        this.isBlockMoving = true;
        setTimeout(() => {
            this.isBlockMoving = false;
        }, 500);
    }
}
