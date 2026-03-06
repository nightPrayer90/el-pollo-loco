class Level {
    enemies;
    staticBackground;
    backgroundObjects_L1;
    backgroundObjects_L2;
    backgroundObjects_L3;
    level_end_x = 2200; //TODO
    level_size;

    constructor(enemies, staticBackground, backgroundObjects_L1, backgroundObjects_L2, backgroundObjects_L3, level_size) {
        this.enemies = enemies;
        this.staticBackground = staticBackground;
        this.backgroundObjects_L1 = backgroundObjects_L1;
        this.backgroundObjects_L2 = backgroundObjects_L2;
        this.backgroundObjects_L3 = backgroundObjects_L3;
        this.level_size = level_size;
    }
}