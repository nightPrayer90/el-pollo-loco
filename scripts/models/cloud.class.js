import { ImageHub } from "../manager-classes/image-hub.js";
import { IntervalHub } from "../manager-classes/interval-hub.js";
import { MovableObject } from "./movable-object.class.js";

/**
 * @class
 * Represents a cloud object used for the parallax background.
 */
export class Cloud extends MovableObject {
    //#region Properties
    width = 500;
    height = 280;
    world_width;
    imagesCloud = ImageHub.CLOUDS.cloud;
    //#endregion

    /**
     * Creates a cloud instance.
     * @param {number} world_width - Width of the world used for spawning.
     * @param {number} layer - Cloud layer identifier.
     * @param {boolean} generateRandomX - Determines if the cloud spawns randomly inside the world.
     */
    constructor(world_width, layer, generateRandomX) {
        super();
        this.world_width = world_width;
        this.initCloud(layer, generateRandomX);

        IntervalHub.startInterval(this.fly, 16);
    }

    //#region Methods
    /**
     * Initializes the cloud with randomized properties.
     */
    initCloud(layer, generateRandomX) {
        let variant = Math.random() < 0.5 ? 0 : 1;
        this.x = (generateRandomX == true) ? Math.random() * this.world_width : Math.random() * 20 + this.world_width;

        this.loadImage(this.imagesCloud[variant]);
        layer == 0 ? this.cloudLayer2() : this.cloudLayer3();
    }

    /**
     * Reinitializes the cloud after it leaves the screen.
     */
    poolCloud() {
        let layer = Math.random() < 0.5 ? 0 : 1;
        this.initCloud(layer, false);
    }

    /**
     * Configuration for far background clouds.
     */
    cloudLayer3() {
        this.width = Math.random() * 100 + 620;
        this.height = Math.random() * 56 + 349;
        this.speed = Math.random() * 0.05 + 0.3;
        this.y = Math.random() * 20 - 10;
    }

    /**
     * Configuration for mid background clouds.
     */
    cloudLayer2() {
        this.width = Math.random() * 20 + 280;
        this.height = Math.random() * 12 + 158;
        this.speed = Math.random() * 0.05 + 0.05;
        this.y = Math.random() * 100 + 100;
    }

    fly = () => {
        this.moveLeft();

        if (this.x < -1000) {
            this.poolCloud();
        }
    };
    //#endregion
}
