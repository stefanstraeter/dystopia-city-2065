/**
 * Handles all collision-related logic within the game world.
 * Detects interactions between the character, enemies, projectiles, and collectable items.
 */
class CollisionManager {

    /**
     * @param {Object} world - Reference to the main game world instance.
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Executes all collision checks in a single cycle.
     */
    checkAll() {
        this.checkEnemyCollisions();
        this.checkProjectileCollisions();
        this.checkItemCollisions();
    }

    /**
     * Checks for direct contact between the player character and enemies.
     * Triggers melee damage, updates the health bar, and initiates a subtle camera shake.
     */
    checkEnemyCollisions() {
        const meleeDamage = ThrowableObject.BLUEPRINTS.MELEE.damage;
        this.world.level.enemies.forEach((enemy) => {
            if (!enemy.isDead() && this.world.character.isColliding(enemy)) {
                this.world.character.hit(meleeDamage, 'melee');
                this.world.healthBar.setPercentage(this.world.character.energy);
                this.world.camera.activateShake(100, 5);
            }
        });
    }

    /**
     * Iterates through all active projectiles to determine if they hit a valid target.
     * Distinguishes between enemy projectiles (targeting the player) and player projectiles (targeting enemies).
     */
    checkProjectileCollisions() {
        this.world.throwableObjects.forEach((projectile) => {
            if (projectile.hasHit) return;

            if (projectile.isEnemy) {
                this.handleHit(projectile, this.world.character);
            } else {
                this.world.level.enemies.forEach(enemy => this.handleHit(projectile, enemy));
            }
        });
    }

    /**
     * Processes a successful hit between a projectile and a target.
     * Manages damage application, triggers specific projectile behaviors (like BossBomb explosions),
     * and updates UI/effects if the player is hit.
     * @param {ThrowableObject} projectile - The projectile in motion.
     * @param {MoveableObject} target - The character or enemy being hit.
     */
    handleHit(projectile, target) {
        if (target.isDead() || !projectile.isColliding(target)) return;

        if (!projectile.damageApplied) {
            target.hit(projectile.damage, projectile.damageType, projectile.isMirrored);
            projectile.damageApplied = true;

            let effectType = (projectile instanceof BossBomb) ? 'BOMB' : 'PLASMA';
            this.world.spawnEffect(target.x, target.y, target.width, target.height, effectType);

            if (projectile instanceof BossBomb) {
                projectile.explode();
            } else {
                projectile.hasHit = true;
            }

            if (target === this.world.character) {
                this.world.healthBar.setPercentage(this.world.character.energy);
                this.world.camera.activateShake(200, 10);
            }
        }
    }

    /**
     * Checks if the character overlaps with any uncollected items in the level.
     */
    checkItemCollisions() {
        this.world.level.collectableItems.forEach((item) => {
            if (!item.isCollected && this.world.character.isColliding(item)) {
                this.handleItemPickup(item);
            }
        });
    }

    /**
     * Resolves the pickup of an item, updating character resources and playing sound effects.
     * @param {CollectableObject} item - The item being picked up.
     */
    handleItemPickup(item) {
        item.isCollected = true;

        if (item instanceof PlasmaCore || item instanceof PowerCell) {
            this.world.character.plasma = Math.min(100, this.world.character.plasma + 20);
            this.world.plasmaBar.setPercentage(this.world.character.plasma);
        } else if (item instanceof Mediapack) {
            this.world.character.energy = Math.min(100, this.world.character.energy + 20);
            this.world.healthBar.setPercentage(this.world.character.energy);
        }
        this.world.audioManager.play('collect');
    }
}