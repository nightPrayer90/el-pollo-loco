
/**
 * @class
 * Represents a static obstacle object placed in the level.
 */
class Obstacle extends DrawableObject {
    
    //#region Properties
    x;
    y;
    width;
    height;
    //#endregion
    
    /**
     * Creates a new obstacle object.
     * @param {string} imagePath - Path to the obstacle image.
     * @param {number} x - X position in the world.
     * @param {number} y - Y position in the world.
     * @param {number} width - Width of the obstacle.
     * @param {number} height - Height of the obstacle.
     */
    constructor(imagePath, x, y, width, height) {
        super();
        this.loadImage(imagePath);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}
