class Character extends MovableObject {
    x = 120;
    y = 180;
    height = 250;
    width = 150;
    speed = 4;
    otherDirection = false;

    IMAGES_WALKING = ImageHub.CHARACTER.walk;

    IMAGES_WALKING = [
            "../assets/img/2_character_pepe/2_walk/W-21.png",
            "../assets/img/2_character_pepe/2_walk/W-22.png",
            "../assets/img/2_character_pepe/2_walk/W-23.png",
            "../assets/img/2_character_pepe/2_walk/W-24.png",
            "../assets/img/2_character_pepe/2_walk/W-25.png",
            "../assets/img/2_character_pepe/2_walk/W-26.png",
        ]
        
    world;

    constructor() {
        super();
        this.loadImage("../assets/img/2_character_pepe/1_idle/idle/I-1.png");
        this.loadImages(this.IMAGES_WALKING);
        IntervalHub.startInterval(this.animate, 100);
        IntervalHub.startInterval(this.move, 1000/60);
    }

    move = () => {
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.x += this.speed;
            this.otherDirection = false;
        }
        else if (this.world.keyboard.LEFT && this.x > 0) { 
            this.x -= this.speed;
            this.otherDirection = true;
        }
        this.world.camera_x = -this.x +100;
    };

    animate = () => {
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            // Walk animation
            let i = this.currentImage % this.IMAGES_WALKING.length;
            let path = this.IMAGES_WALKING[i];
            this.img = this.imageCache[path];
            this.currentImage++;
        }
    };

    jump() {}
}
