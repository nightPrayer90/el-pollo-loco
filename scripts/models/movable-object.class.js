class MovableObject extends DrawableObject {
    speed = 0.15;
    speedY = 0;
    acceleration = 1;

    lastImages = [];
    animationFlag = false;

    health;
    damage;

    isLanding = false;
    drawCollisionFrame = false;

    // collision
    cX;
    cY;
    cW;
    cH;

    collisionOffset = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    };

    moveRight() {
        this.x += this.speed;
        this.otherDirection = (this instanceof Chicken)  ? true :  false;
    }

    moveLeft() {
        this.x -= this.speed;
        this.otherDirection = (this instanceof Chicken)  ? false :  true;
    }

    jump() {
        this.speedY = 18;
        this.lastImages = [];
    }

    playAnimationLoop(images) {
        if (images != this.lastImages) {
            this.currentImage = 0;
            this.lastImages = images;
        }

        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    playAnimationSingle(images) {
        // animationsreset
        // du speicherst immer das letzte imageset und vergleichst, kommen neue images rein, wird die animation resettet
        
        if (images != this.lastImages) { 
            this.currentImage = 0;// durch den reset beginnst du immer beim ersten bild der animation
            this.animationFlag = false; // das flag ist dazu da die animation zu beenden
            this.lastImages = images; // für den nächsten durchlauf um das reset zu triggern
        }
        // Sorgt dafür, das die animation nur einmal abgespielt wird
        if (this.animationFlag == true) return;


        // das hier kennst du
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;

        // Beim letzten bild setzt du das flag-> damit weiß die funktion ich bin fertig und das return oben greift
        if (i == images.length - 1) {
            this.animationFlag = true;
            return true;
        }

        // zusatz-> damit kannst du das ding in einen ifblock packen (if (playAnimationSingle(images) {beende das spiel}))
        return false;
    }

    applyGravity = () => {
        if (this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
            this.isLanding = false;
        }

        if (!this.isAboveGround() && this.isLanding == false) {
            this.jumpEndFrame();
        }
    };

    isAboveGround() {
        return this.y < 180;
    }

    jumpEndFrame(){
        this.isLanding = true;
    }

    // constructor
    setCollisionRect() {
        this.cX = this.x + this.collisionOffset.left;
        this.cY = this.y + this.collisionOffset.top;
        this.cW = this.width - this.collisionOffset.left - this.collisionOffset.right;
        this.cH = this.height - this.collisionOffset.top - this.collisionOffset.bottom;
    }

    // collision update
    updateCollisionRect() {
        this.cX = this.x + this.collisionOffset.left;
        this.cY = this.y + this.collisionOffset.top;
    }

    isColliding(mo) {
        this.updateCollisionRect();
        mo.updateCollisionRect();

        return this.cX + this.cW > mo.cX && 
        this.cY + this.cH > mo.cY && 
        this.cX < mo.cX + mo.cW && 
        this.cY < mo.cY + mo.cH;
    }

    isCollidingFromTop(mo) {
        const playerBottomPrev = this.cY + this.cH + this.speedY;
        const enemyTop = mo.cY;
        return playerBottomPrev < enemyTop;
    }
}
