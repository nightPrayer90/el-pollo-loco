/**
 * @class
 * Represents the endboss enemy and controls its behavior,
 * attack phases and combat logic.
 */
class Endboss extends MovableObject {

    //#region Properties
    y = 240;
    groundY = 240;
    acceleration = 1.5;
    jumpPower = 22;
    damage = 20;
    directionOffset = 400;
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

    imagesAlert = ImageHub.ENDBOSS.alert;
    imagesWalking = ImageHub.ENDBOSS.walk;
    imagesAttack = ImageHub.ENDBOSS.attack;
    imagesHurt = ImageHub.ENDBOSS.hurt;
    imagesDead = ImageHub.ENDBOSS.dead;

    animate_id;
    move_id;
    applyGravity_id;
    world;
    //#endregion

    /**
     * Creates the endboss instance.
     * @param {number} x - Spawn position.
     */
    constructor(x) {
        super();
        this.x = x;
        this.initImages();
        this.setCollisionRect();
        this.animate_id = IntervalHub.startInterval(this.animate, 100);
        this.applyGravity_id = IntervalHub.startInterval(this.applyGravity, 16);
    }

    //#region Methods
    /**
     * Loads all animation images.
     */
    initImages() {
        this.loadImage(this.imagesAlert[0]);
        this.loadImages(this.imagesAlert);
        this.loadImages(this.imagesWalking);
        this.loadImages(this.imagesAttack);
        this.loadImages(this.imagesHurt);
        this.loadImages(this.imagesDead);
    }

    /**
     * Changes the boss from waiting state to attack phase.
     */
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

    /**
     * Handles boss damage interaction.
     * world and hitForm here are usless -> but i need both in the chicken class
     * and boss and chicken use the same collision logic in world
     */
    hit(world, hitFrom) {
        if (this.isHurt) return;
        if (!this.isWaitingState) {
            this.takeDamage();
        } else {
            this.isAttack = true;
            this.jump();
            AudioHub.playOne(AudioHub.ENDBOSS_HIT_S1);
        }
    }

    /**
     * Executes an attack jump.
     */
    doAttack() {
        if (!this.canAttack) return;
        this.isAttack = true;
        this.jump();
        this.blockMoveing();
        this.setCooldownAttack();
    }

    /**
     * Temporarily blocks movement.
     */
    blockMoveing() {
        this.isBlockMoving = true;
        setTimeout(() => {
            this.isBlockMoving = false;
        }, 500);
    }

    /**
     * Starts the attack cooldown.
     */
    setCooldownAttack() {
        this.canAttack = false;
        setTimeout(() => {
            this.canAttack = true;
        }, 3000);
    }

    /**
     * Applies damage to the boss.
     */
    takeDamage() {
        this.isHurt = true;
        this.health -= 1;
        this.speed++;
        this.world.statusBossBar.setHealth(this.health);
        if (this.health > 0) AudioHub.playOne(AudioHub.ENDBOSS_HIT_S2);
        else AudioHub.playOne(AudioHub.ENDBOSS_DIE);
        setTimeout(() => {
            this.isHurt = false;
        }, 500);
    }

    /**
     * Returns whether the boss is dead.
     */
    isDie() {
        return this.health <= 0;
    }

    /**
     * Executes the boss jump attack.
     */
    jump() {
        super.jump();
        AudioHub.playOne(AudioHub.ENDBOSS_JUMP_ATTACK);
    }

    /**
     * Called when the boss lands after jumping.
     */
    jumpEndFrame() {
        if (this.isDie()) return;

        super.jumpEndFrame();
        AudioHub.playOne(AudioHub.ENDBOSS_LANDING);
        this.chickenSpawnAttack(3);
        this.isAttack = false;
        this.world.createParticleSystem(ImageHub.VFX.jump, this.x + this.width / 2, this.y + this.height - 30, 500, 500);
        this.world.triggerScreenShake(300);
        
        if (this.isWaitingState) {
            this.updateHitWaitingMessage();
        }
    }

    /**
     * Spawns chickens during attack phase.
     */
    chickenSpawnAttack(spawnQuantity) {
        if (this.isDie()) return;

        for (let i = 0; i < spawnQuantity; i++) {
            this.world.level.enemies.push(new Chicken(this.world.character.x, 2, 5000));
        }
    }

    /**
     * Updates the dialog message while boss waits for coins.
     */
    updateHitWaitingMessage() {
        if (this.world.character.coins >= 4) {
            this.changeStage();
            this.world.statusTextObject.updateText(this.strArray[4]);
        } else {
            let ran = Math.floor(Math.random() * (this.strArray.length - 1));
            this.world.statusTextObject.updateText(this.strArray[ran]);
        }
    }
    //#endregion

    //#region Intervals
    animate = () => {
        if (this.isDie()) {
            this.y += 15;
            if (this.playAnimationSingle(this.imagesDead)) this.world.gameIsOver(false);
            return;
        }
        if (this.isHurt) this.playAnimationLoop(this.imagesHurt);
        else {
            if (this.isAttack) {
                if (this.playAnimationSingle(this.imagesAttack)) this.isAttack = false;
            } else {
                if (this.isWaitingState) this.playAnimationLoop(this.imagesAlert);
                else this.playAnimationLoop(this.imagesWalking);
            }
        }
    }

    move = () => {
        if (this.isDead || this.isAttack || this.isBlockMoving) return;

        if (this.x > this.world.character.x + this.directionOffset) {
            if (this.moveDirection != true) {
                this.moveDirection = true;
                this.doAttack();
            }
        }
        if (this.x < this.world.character.x - this.directionOffset) {
            if (this.moveDirection != false) {
                this.moveDirection = false;
                this.doAttack();
            }
        }
        if (this.moveDirection) this.moveLeft();
        else this.moveRight();
    }
     //#endregion
}
