class Collectable extends MovableObject {
    x;
    y;
    width;
    height;

    images_set = [];
    images_vfx = ImageHub.VFX.coin;

    animate_id;
    isCollect = false;

    strArray = [
        "Nice, only 3 coins left!",
        "Pepe does a great job! You are ok too!",
        "Only one Coin left! Can you get the last one?",
        "You're ready to roast the rooster! (Now Spice the chicken!)"
    ]

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
            this.playAnimationLoop(this.images_set);
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
        this.loadImage(this.images_set[0]);
        this.loadImages(this.images_set);
        if (this.images_set.length > 1) this.animate_id = IntervalHub.startInterval(this.animate, 250);
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
        this.images_set = ImageHub.COLLECTABLES.coin;
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
        this.images_set = Math.random() < 0.5 ? ImageHub.COLLECTABLES.bottle_v1 : ImageHub.COLLECTABLES.bottle_v2;
    }

    collect(world) {
        switch (this.type) {
            case 0:
                world.statusTextObject.updateText(this.strArray[world.character.coins]);
                world.character.coins++;
                world.level.maxEnemies = Math.max(world.level.maxEnemies - 5, 0);
                world.coinUI.updateText(world.character.coins);
                world.triggerScreenShake(66);
                if(world.character.coins != 4) AudioHub.playOne(AudioHub.COLL_COIN);
                else AudioHub.playOne(AudioHub.COLL_COIN_4);
                break;
            case 1:
                world.character.bottles++;
                world.bottleUI.updateText(world.character.bottles);
                AudioHub.playOne(AudioHub.COLL_BOTTLE);
                break;
        }

        if (this.images_set.length > 1) this.removeCollectableFormInverval();
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
