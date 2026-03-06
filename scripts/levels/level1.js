let levelBkLengh = 4;

const level1 = new Level(
    [new Chicken(), new Chicken(), new Chicken(), new Endboss()], 
    [new Cloud()], 
    [new BackgroundObject("../assets/img/5_background/layers/air.png", 0)],
    buildBackgrounds(ImageHub.BACKGROUNDSETS_L1),
    buildBackgrounds(ImageHub.BACKGROUNDSETS_L2),
    buildBackgrounds(ImageHub.BACKGROUNDSETS_L3),
);

function buildBackgrounds(imageSet) {
    let backgroundObjects = [];

    for (let i = -1; i < levelBkLengh; i++) {
        let currentImageSet = i % 2 == 0 ? imageSet.set1 : imageSet.set2;

        for (let j = 0; j < currentImageSet.length; j++) {
            backgroundObjects.push(new BackgroundObject(currentImageSet[j], i * 719));
        }
    }
    return backgroundObjects;
}
