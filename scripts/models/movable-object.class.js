class MovableObject extends DrawableObject {    
    speed = 0.15;
    speedY = 0;
    acceleration = 1;
    
    lastImages =[];
    animationFlag = false;

    health = 100;
    damage = 2;

    // collision
    cX;
    cY;
    cW;
    cH;

    collisionOffset = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    };

    moveRight() {
        this.x += this.speed;
    }

    moveLeft = () => {
        this.x -= this.speed;
    };

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
        if (images != this.lastImages) {
            this.currentImage = 0;
            this.animationFlag = false;
            this.lastImages = images;
        }
        if (this.animationFlag == true) return;

        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];  
        this.currentImage++;

        if(i == images.length -1) {
            this.animationFlag = true;
        }
    }

    applyGravity = () => {
        if (this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
        }
    };

    isAboveGround() {
        return this.y < 180;
    }

    jump() {
        this.speedY = 18;
        this.lastImages = [];
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
        mo.updateCollisionRect(); // das geht doch sicher effizienter!!!

        return this.cX + this.cW > mo.cX &&
        this.cY + this.cH > mo.cY &&
        this.cX < mo.cX  + mo.cW &&
        this.cY < mo.cY + mo.cH;
    }
}
