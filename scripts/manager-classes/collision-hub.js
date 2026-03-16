/**
 * @class
 * Central static utility responsible for all collision detection and
 * collision related gameplay logic in the game.
 *
 * The CollisionHub checks interactions between the player, enemies,
 * throwable objects and collectables and triggers the appropriate
 * game reactions such as damage, enemy defeat, particle effects,
 * screen shake or item collection.
 *
 * All methods are static and the class acts purely as a logic hub
 * without maintaining its own state.
 */
export class CollisionHub {
    /**
     * Checks all collisions between enemies, collectables and projectiles.
     * @param {Array} enemies
     * @param {Array} collectables
     * @param {Array} throwableObjects
     * @param {Character} character
     * @param {World} world
     */
    static checkCollisions(enemies, collectables, throwableObjects, character, world) {
        enemies.forEach((enemy) => {
            // character -> enemy
            if (character.isColliding(enemy)) {
                CollisionHub.handleCollisionPlayerEnemy(enemy, character, world);
            }
            // bottle -> enemy
            if (throwableObjects.length > 0) {
                throwableObjects.forEach((bottle) => {
                    CollisionHub.handleCollisionEnemyBottle(bottle, enemy, world);
                });
            }
        });
        // character -> collectable
        collectables.forEach((collectable) => {
            if (character.isColliding(collectable) && collectable.isCollect == false) {
                CollisionHub.handleCollisionPlayerCollectable(collectable, world);
            }
        });
    }

    /**
     * Handles collision between the player and an enemy.
     */
    static handleCollisionPlayerEnemy(enemy, character, world) {
        if (character.isCollidingFromTop(enemy) && character.speedY < 0) {
            CollisionHub.handleCollisionFromTop(enemy, character, world);
            return;
        } else {
            CollisionHub.handleCollisionCharacterGetHit(enemy, character, world);
        }
    }

    /**
     * Handles collision when the player hits an enemy from above.
     */
    static handleCollisionFromTop(enemy, character, world) {
        enemy.hit(world, 0);
        character.speedY = 8;
        character.collisionTimeout();
        world.createParticleSystem(enemy.imagesVFXHit, enemy.cX + enemy.cW / 2, enemy.cY + enemy.cH / 2, 126, 126);
    }

    /**
     * Handles collision when the player takes damage from an enemy.
     */
    static handleCollisionCharacterGetHit(enemy, character, world) {
        if (!enemy.isDead) {
            character.hit(enemy.damage);
            world.triggerScreenShake(250);
        }
    }

    /**
     * Handles collision between a bottle and an enemy.
     */
    static handleCollisionEnemyBottle(bottle, enemy, world) {
        if (bottle.isColliding(enemy)) {
            bottle.splash();
            enemy.hit(world, 1);
            world.triggerScreenShake(150);
        }
    }

    /**
     * Handles collision between the player and a collectable.
     */
    static handleCollisionPlayerCollectable(collectable, world) {
        collectable.collect(world);
        world.createParticleSystem(collectable.imagesVfx, collectable.cX + collectable.cW / 2, collectable.cY + collectable.cH / 2, 200, 200);
    }
}
