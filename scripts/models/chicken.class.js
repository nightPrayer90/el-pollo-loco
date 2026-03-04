class Chicken extends MovableObject {
    x;
    y = 330;
    height = 100;
    width = 70;
    speed = 1 + Math.random() * 1;

    IMAGES_WALKING = ImageHub.CHICKEN_NORMAL.walk;

    constructor() {
        super();
        this.loadImage("../assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
        this.x = Math.random() * 500 + 200;

        this.loadImages(this.IMAGES_WALKING);
        IntervalHub.startInterval(this.animate, 100); // wir sagen hier das die Hüher animation zusammen mit der geschwindigkeit animiert werden! das fühlt sich falsch an!!!
        IntervalHub.startInterval(this.moveLeft, 60); 
    }


    animate = () => {
        let i = this.currentImage % this.IMAGES_WALKING.length;
        let path = this.IMAGES_WALKING[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    };
}
