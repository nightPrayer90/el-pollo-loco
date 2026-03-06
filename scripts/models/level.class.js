class Level {
    enemies;
    clouds;
    staticBackground;
    backgroundObjects_L1;
    backgroundObjects_L2;
    backgroundObjects_L3;
    level_end_x = 2200;

    constructor(enemies, clouds, staticBackground, backgroundObjects_L1, backgroundObjects_L2, backgroundObjects_L3) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.staticBackground = staticBackground;
        this.backgroundObjects_L1 = backgroundObjects_L1;
        this.backgroundObjects_L2 = backgroundObjects_L2;
        this.backgroundObjects_L3 = backgroundObjects_L3;
    }
}