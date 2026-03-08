class Collectable extends MovableObject {
    x;
    y;
    width;
    height;

    IMAGES_SET = [];
    IMAGES_VFX = ImageHub.VFX.coin;

    animate_id;
    isCollect = false;

    constructor(x, y, type) {
        super();
        this.type = type;
        this.x = x;
        this.y = y;
        this.init(type);
        this.setCollisionRect();
    }

    animate = () => {
        if (this.isCollect == false) {
            this.playAnimationLoop(this.IMAGES_SET);
        }
    };

    init(type) {
        switch (type) {
            case 0:
                this.initCoin();
                break;
            case 1:
                this.initBottle();
                break;
        }
        this.loadImage(this.IMAGES_SET[0]);
        this.loadImages(this.IMAGES_SET);
        if (this.IMAGES_SET.length > 1) this.animate_id = IntervalHub.startInterval(this.animate, 250);
    }

    initCoin() {
        this.width = 120;
        this.height = 120;
        this.collisionOffset = {
            top: 40,
            right: 40,
            bottom: 40,
            left: 40,
        };
        this.IMAGES_SET = ImageHub.COLLECTABLES.coin;
    }

    initBottle() {
        this.width = 60;
        this.height = 60;
        this.collisionOffset = {
            top: 5,
            right: 5,
            bottom: 5,
            left: 5,
        };
        this.IMAGES_SET = Math.random() < 0.5 ? ImageHub.COLLECTABLES.bottle_v1 : ImageHub.COLLECTABLES.bottle_v2;
    }

    collect(world) {
        switch (this.type) {
            case 0:
                world.character.coins++;
                console.log("COINS: " + world.character.coins);
                break;
            case 1:
                world.character.bottles++;
                console.log("BOTTLES: " + world.character.bottles);
                break;
        }

        if (this.IMAGES_SET.length > 1) this.removeCollectableFormInverval();
        this.removeCollectableFromCollision(world);
    }

    // TODO: könnte man in die superclass verschieben
    removeCollectableFromCollision(world) {
        // INTERVAL Läuft noch aber sonst tut sich nichts mehr
        if (this.isCollect == false) {
            // -> wir wechseln das array, somit fällt die Flasche aus der Collisionsabfrage raus
            const index = world.level.collectables.indexOf(this);
            if (index != -1) {
                world.level.collectables.splice(index, 1);
            }
            this.isCollect = true;
        }
    }

    // TODO: Könnte man in die superclass verschieben
    removeCollectableFormInverval() {
        IntervalHub.stopInterval(this.animate_id);
    }
}
