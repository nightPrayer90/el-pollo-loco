class Obstacle extends DrawableObject {
    x;
    y;
    width;
    height;
    
    constructor(imagePath, x, y, width, height) {
        super();
        this.loadImage(imagePath);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}
