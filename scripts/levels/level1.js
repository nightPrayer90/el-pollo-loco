import { ImageHub } from "../manager-classes/image-hub.js";
import { BackgroundObject } from "../models/background-objects.class.js";
import { Chicken } from "../models/chicken.class.js";
import { Collectable } from "../models/collectables.class.js";
import { Endboss } from "../models/endboss.class.js";
import { Level } from "../models/level.class.js";
import { Obstacle } from "../models/obstacle.class.js";

//#region Config
let levelBkLength = 6;
let imageWidth = 720;
let maxEnemies = 20;
//#endregion

//#region Level Builder
/**
 * Creates and returns the level configuration.
 */
export function levelInit() {
    const level1 = new Level(
    chickenGenerator(15), 
    [new BackgroundObject(ImageHub.SKY.air, 0)],
    buildBackgrounds(ImageHub.BACKGROUNDSETS_L1),
    buildBackgrounds(ImageHub.BACKGROUNDSETS_L2),
    buildBackgrounds(ImageHub.BACKGROUNDSETS_L3),
    getCollectables(),
    getObstacles(),
    getWorldWitdh(),
    maxEnemies
    );

    return level1;
}

/**
 * Returns the total world width.
 */
function getWorldWitdh() {
    return imageWidth * levelBkLength;
}
//#endregion

//#region Generators
/**
 * Builds the repeating background layers.
 */
function buildBackgrounds(imageSet) {
    let backgroundObjects = [];

    for (let i = -1; i < levelBkLength; i++) {
        let currentImageSet = i % 2 == 0 ? imageSet.set1 : imageSet.set2;

        for (let j = 0; j < currentImageSet.length; j++) {
            backgroundObjects.push(new BackgroundObject(currentImageSet[j], i * 719));
        }
    }
    return backgroundObjects;
}

/**
 * Generates all enemies for the level.
 *  0 -> normal chicken   1 -> small chicken
 */
function chickenGenerator(chickenQuantity) {
    let xSpawnPos = 800;
    let chickens = []; 
    let stepWide = getWorldWitdh() / chickenQuantity;
    let turnXPosition = getWorldWitdh() - 1000;

    for (let i = 0; i < chickenQuantity; i++) {
        let type =  (Math.random() < 0.35) ? 1 : 0;
        xSpawnPos += (Math.random()*stepWide);
        xSpawnPos = Math.min(xSpawnPos, getWorldWitdh());
        chickens.push(new Chicken(xSpawnPos, type, turnXPosition, false));
    }

    chickens.push(new Endboss(getWorldWitdh() - 200));
    return chickens;
}
//#endregion

//#region Object Creation
/**
 * Creates all collectable objects in the level.
 */
function getCollectables() {
    return [
        // coins -> 0
        new Collectable(-470,75,0),
        new Collectable((getWorldWitdh() - 1000)/2,75,0),
        new Collectable(3000,75,0),
        new Collectable((getWorldWitdh() - 850),25,0),
        new Collectable((getWorldWitdh() - 650),340,0),

        // bottles -> 1
        new Collectable(-500,390,1),
        new Collectable(-440,375,1),
        new Collectable(-370,385,1),
        new Collectable(-200,370,1),
        new Collectable(-120,385,1),
        new Collectable(850,381,1), 
        new Collectable(1080,385,1), 
        new Collectable(1260,375,1), 
        new Collectable(1500,385,1), 
        new Collectable(1800,375,1), 
        new Collectable(2100,385,1)
    ];
}

/**
 * Creates all static obstacles in the level.
 */
function getObstacles() {
    return [
        new Obstacle(ImageHub.OBSTACLES.mast, -640, 180, 250, 250),
        new Obstacle(ImageHub.OBSTACLES.barrel1, -330, 330, 90, 120),
        new Obstacle(ImageHub.OBSTACLES.barrel2, (getWorldWitdh() - 1000)/2, 330, 140, 120),
        new Obstacle(ImageHub.OBSTACLES.barrel1, (getWorldWitdh() - 980), 330, 90, 120),
        new Obstacle(ImageHub.OBSTACLES.stone, (getWorldWitdh() - 650), 300, 130, 190) // 
    ];
}
//#endregion
