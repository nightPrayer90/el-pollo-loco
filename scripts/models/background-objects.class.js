import { DrawableObject } from "./drawable-object.class.js";

/**
 * @class
 * Represents a background element placed in the game world.
 * Used to build repeating level backgrounds.
 */
export class BackgroundObject extends DrawableObject {
    x;
    y;
    width = 720;
    height = 480;
    
    /**
     * Creates a new background object.
     * @param {string} imagePath - Path to the background image.
     * @param {number} x - Horizontal world position.
     */
    constructor(imagePath, x) {
        super();
        this.loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height;
    }
}
