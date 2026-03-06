class Cloud extends MovableObject {
    x;
    y;
    width = 500;
    height = 280;

    world_width;

    IMAGES_CLOUD = ImageHub.CLOUDS.cloud;

    constructor(world_width, layer, generateRandomX) {
        super();
        this.world_width = world_width
        this.initCloud(layer, generateRandomX);

        IntervalHub.startInterval(this.fly, 16);
    }

    fly = () => {
        this.moveLeft();

        if (this.x < -1000) {
            this.poolCloud();
        }
    };

    initCloud(layer, generateRandomX) {
        let variant = Math.random() < 0.5 ? 0 : 1;
        this.x = generateRandomX == true ? Math.random() * this.world_width : Math.random() *20 + this.world_width;

        this.loadImage(this.IMAGES_CLOUD[variant]);
        (layer == 0) ?  this.cloudLayer2() : this.cloudLayer3();
    }

    poolCloud() {
        let layer = Math.random() < 0.5 ? 0 : 1;
        this.initCloud(layer, false);
    }

    cloudLayer3() {
        this.width = Math.random()*100 + 620;
        this.height =  Math.random()*56 + 349;
        this.speed = Math.random()*0.05 + 0.3;
        this.y = Math.random()* 20 - 10;
    }

    cloudLayer2() {
        this.width = Math.random()*20 + 280;
        this.height = Math.random()*12 + 158;
        this.speed = Math.random()*0.05 + 0.05;
        this.y = Math.random()*100 + 100;
    }
}
