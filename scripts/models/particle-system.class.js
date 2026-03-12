class ParticleSystem extends MovableObject {
    x;
    y;
    images_set;
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
        this.images_set = images;
        this.world = world;
        this.loadImage(this.images_set[0]);
        this.loadImages(this.images_set);
        this.animate_id = IntervalHub.startInterval(this.animate, 25);
    }

    animate = () => {
        if (this.playAnimationSingle(this.images_set)) {
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
