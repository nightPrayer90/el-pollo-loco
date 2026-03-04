let levelBkLengh = 4;
const level1 = new Level(
    [new Chicken(), new Chicken(), new Chicken()], 
    [new Cloud()], 
    buildBackgrounds()
);

function buildBackgrounds() {
    let backgroundObjects = [];

    for (let i = -1; i < levelBkLengh; i++) {
        let currentImageSet = i % 2 == 0 ? ImageHub.BACKGROUNDSETS.set1 : ImageHub.BACKGROUNDSETS.set2;

        for (let j = 0; j < currentImageSet.length; j++) {
            backgroundObjects.push(new BackgroundObject(currentImageSet[j], i * 719));
        }
    }
    return backgroundObjects;
}
