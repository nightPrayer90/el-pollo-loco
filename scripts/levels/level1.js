let levelBkLength = 4;
let imageWidth = 720;

const level1 = new Level(
    [new Chicken(450, 0), new Chicken(550, 1), new Chicken(700, 0), new Endboss()], 
    [new BackgroundObject("../assets/img/5_background/layers/air.png", 0)],
    buildBackgrounds(ImageHub.BACKGROUNDSETS_L1),
    buildBackgrounds(ImageHub.BACKGROUNDSETS_L2),
    buildBackgrounds(ImageHub.BACKGROUNDSETS_L3),
    [new Collectable(800,150,0), new Collectable(800,380,1)],
    [new Obstacle(ImageHub.OBSTACLES.mast, -140, 200, 250, 250)],
    imageWidth*levelBkLength
);

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
