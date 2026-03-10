let levelBkLength = 6;
let imageWidth = 720;
let chickenArry = [];
let maxEnemies = 20;

// Chicken 0 -> Normal Chicken   1 -> small chicken
// Collectables -> 0 for 1 for bottle

function levelInit() {
    const level1 = new Level(
    chickenGenerator(15), 
    [new BackgroundObject("./assets/img/5_background/layers/air.png", 0)],
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

function getWorldWitdh() {
    return imageWidth * levelBkLength;
}

function chickenGenerator(chickenQuantity) {
    let xSpawnPos = 800;
    let chickens = []; 
    let stepWide = getWorldWitdh() / chickenQuantity;
    let turnXPosition = getWorldWitdh() - 1000;

    for (let i = 0; i < chickenQuantity; i++) {
        let type =  (Math.random() < 0.35) ? 1 : 0;
        xSpawnPos += (Math.random()*stepWide);
        xSpawnPos = Math.min(xSpawnPos, getWorldWitdh());
        chickens.push(new Chicken(xSpawnPos, type, turnXPosition));
    }

    return chickens;
}

function getCollectables() {
    return [
        // coins
        new Collectable(-470,75,0),
        new Collectable((getWorldWitdh() - 1000)/2,75,0),
        new Collectable(3000,75,0),
        new Collectable((getWorldWitdh() - 1000),150,0),

        // bottles
        new Collectable(-500,381,1),
        new Collectable(-440,381,1),
        new Collectable(-370,381,1),
        new Collectable(-200,381,1),
        new Collectable(-120,381,1),

        new Collectable(850,381,1), 
        new Collectable(1080,382,1), 
        new Collectable(1260,379,1), 
        new Collectable(1500,380,1), 
        new Collectable(1800,377,1), 
        new Collectable(2100,382,1)
    ];
}

function getObstacles() {
    return [
        new Obstacle(ImageHub.OBSTACLES.mast, -640, 180, 250, 250),
        new Obstacle(ImageHub.OBSTACLES.barrel1, -330, 330, 90, 120),
        new Obstacle(ImageHub.OBSTACLES.barrel1, (getWorldWitdh() - 980), 330, 90, 120),
        new Obstacle(ImageHub.OBSTACLES.barrel2, (getWorldWitdh() - 1000)/2, 330, 140, 120)
    ];
}
//, new Endboss(
