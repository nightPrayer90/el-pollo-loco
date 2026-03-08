class Level {
    enemies = [];
    staticBackground;
    backgroundObjects_L1 = [];
    backgroundObjects_L2 = [];
    backgroundObjects_L3 = [];
    obstacles = [];
    collectables = [];
    level_size;
    maxEnemies;

    constructor(enemies, staticBackground, backgroundObjects_L1, backgroundObjects_L2, backgroundObjects_L3, collectables ,obstacles, level_size, maxEnemies) {
        this.enemies = enemies;
        this.staticBackground = staticBackground;
        this.backgroundObjects_L1 = backgroundObjects_L1;
        this.backgroundObjects_L2 = backgroundObjects_L2;
        this.backgroundObjects_L3 = backgroundObjects_L3;
        this.collectables = collectables;
        this.obstacles = obstacles;
        
        this.level_size = level_size;
        this.maxEnemies = maxEnemies;
    }
}