class Collectable extends MovableObject  {
    x;
    y;
    width = 120;
    height = 120;

    IMAGES_SET = ImageHub.COLLECTABLES.coin;
    IMAGES_VFX = ImageHub.VFX.coin;
    
    animate_id;
    isCollect = false;

    collisionOffset = {
        top: 40,
        right: 40,
        bottom: 40,
        left: 40,
    };


    constructor(x, y) {
        super();
        this.loadImage(this.IMAGES_SET[0]);
        this.loadImages(this.IMAGES_SET);
        this.x = x;
        this.y = y;

        this.setCollisionRect();
        this.animate_id = IntervalHub.startInterval(this.animate, 250);
    }

    animate = () => {
        if (this.isCollect == false) {
            this.playAnimationLoop(this.IMAGES_SET);
        }
    };

    collect(world) {
        this.removeCollectableFormInverval();
        this.removeCollectableFromCollision(world);
        console.log("collect");
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
