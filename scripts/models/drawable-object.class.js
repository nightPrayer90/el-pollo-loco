class DrawableObject {
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

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    drawFrame(ctx) {
        if (!(this instanceof Character || this instanceof Chicken || this instanceof ThrowableObject|| this instanceof Collectable)) return;
        this.setCollisionRect();

        ctx.beginPath();
        ctx.lineWidth = "2";
        ctx.strokeStyle = "blue";
        ctx.rect(this.cX, this.cY, this.cW, this.cH);
        ctx.stroke();   
    }

    drawText(ctx) {
        ctx.font = this.textFontStyle;
        ctx.fillStyle = this.textFontColor;
        ctx.textAlign = this.textAlign;
        ctx.fillText(this.showTextString,this.x + this.textOffset.x, this.y+this.textOffset.y);
    }
}
