/**
 * @class
 * Represents a particle animation system used for visual effects.
 */
class ParticleSystem extends MovableObject {
    
    //#region Properties
    x;
    y;
    imagesSet;
    animate_id;
    width = 125;
    height = 125;
    world;
    //#endregion

    /**
     * Creates a particle system instance.
     * @param {string[]} images - Array of particle animation images.
     * @param {number} x - Spawn X position.
     * @param {number} y - Spawn Y position.
     * @param {number} width - Particle width.
     * @param {number} height - Particle height.
     * @param {World} world - Reference to the world.
     */
    constructor(images, x, y, width, height, world) {
        super();
        this.height = height;
        this.width = width;
        this.x = x - width/2;
        this.y = y - height/2;
        this.imagesSet = images;
        this.world = world;
        this.loadImage(this.imagesSet[0]);
        this.loadImages(this.imagesSet);
        this.animate_id = IntervalHub.startInterval(this.animate, 25);
    }

    //#region Methods
    /**
     * Removes the particle system from the world.
     */
    removeParticle() {
        const index = this.world.particleSystems.indexOf(this);
        if (index != -1) {
            this.world.particleSystems.splice(index, 1);
        }
    }

    /**
     * Plays the particle animation and removes it after completion.
     */
    animate = () => {
        if (this.playAnimationSingle(this.imagesSet)) {
            IntervalHub.stopInterval(this.animate_id);
            this.removeParticle();
        }
    };
    //#endregion
}
