class Cloud extends MovableObject {
    y = 20;
    width = 500;
    height = 300;
    speed = 0.15;

    constructor() {
        super();
        this.loadImage("../assets/img/5_background/layers/4_clouds/1.png");

        this.x = Math.random() * 500;
        IntervalHub.startInterval(this.animate, 1000 / 60);
    }

    animate = () => {
        this.moveLeft();
    };
}
