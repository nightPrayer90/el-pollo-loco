/**
 * @class
 * Base class for all drawable objects in the game.
 * Handles image loading, drawing and optional debug rendering.
 */
class DrawableObject {
    
    //#region Properties
    img;
    imageCache = {};
    currentImage = 0;

    x = 120;
    y = 200;
    height = 150;
    width = 100;

    isDrawText = false;
    textAlign = "start";
    textFontStyle = "30px Boogaloo";
    textFontColor = "orange";
    showTextString = "Möhrenkult";
    textOffset = {
        x: 0,
        y: 0
    }
    //#endregion

    //#region Methods
    /**
     * Loads a single image.
     * @param {string} path - Image path.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Loads multiple images and stores them in the cache.
     * @param {string[]} arr - Array of image paths.
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Draws the object on the canvas.
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Draws the collision rectangle for debugging.
     */
    drawFrame(ctx) {
        if (!(this instanceof Character || this instanceof Chicken || this instanceof ThrowableObject|| this instanceof Collectable || this instanceof Endboss)) return;
        this.setCollisionRect();

        ctx.beginPath();
        ctx.lineWidth = "2";
        ctx.strokeStyle = "blue";
        ctx.rect(this.cX, this.cY, this.cW, this.cH);
        ctx.stroke();   
    }

    /**
     * Draws debug or UI text near the object.
     */
    drawText(ctx) {
        ctx.font = this.textFontStyle;
        ctx.fillStyle = this.textFontColor;
        ctx.textAlign = this.textAlign;
        ctx.fillText(this.showTextString,this.x + this.textOffset.x, this.y+this.textOffset.y);
    }
    //#endregion
}
