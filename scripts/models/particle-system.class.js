class ParticleSystem extends MovableObject {
    x;
    y;
    IMAGES;
    animate_id;
    width = 125;
    height = 125;
    world;

    constructor(images, x, y, width, height, world) {
        super();
        this.height = height;
        this.width = width;
        this.x = x - width/2;
        this.y = y - height/2;
        this.IMAGES = images;
        this.world = world;
        this.loadImage(this.IMAGES[0]);
        this.loadImages(this.IMAGES);
        this.animate_id = IntervalHub.startInterval(this.animate, 33);
    }

    animate = () => {
        console.log("HALLO PARTICLE? " + this.x + " " + this.y);
        if (this.playAnimationSingle(this.IMAGES)) {
            IntervalHub.stopInterval(this.animate_id);
            this.removeParticle();
        }
    };

    removeParticle() {
        const index = this.world.particleSystems.indexOf(this);
        if (index != -1) {
            this.world.particleSystems.splice(index, 1);
        }
    }
}
