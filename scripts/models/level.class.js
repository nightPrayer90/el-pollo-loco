/**
 * @class
 * Represents the level configuration including enemies,
 * backgrounds, obstacles and collectable objects.
 */
export class Level {

    //#region Properties
    enemies = [];
    staticBackground;
    backgroundObjects_L1 = [];
    backgroundObjects_L2 = [];
    backgroundObjects_L3 = [];
    obstacles = [];
    collectables = [];
    level_size;
    maxEnemies;
    //#endregion

    /**
     * Creates a level instance.
     * @param {Array} enemies
     * @param {Array} staticBackground
     * @param {Array} backgroundObjects_L1
     * @param {Array} backgroundObjects_L2
     * @param {Array} backgroundObjects_L3
     * @param {Array} collectables
     * @param {Array} obstacles
     * @param {number} level_size
     * @param {number} maxEnemies
     */
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