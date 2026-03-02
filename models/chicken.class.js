class Chicken extends MovableObject {


    constructor() {
        super();
        this.loadImage("../assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");

        this.x = Math.random()*500 + 200;
    }
}