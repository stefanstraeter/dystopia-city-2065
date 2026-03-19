class CollisionManager {
    constructor(world) {
        this.world = world;
    }

    checkAll() {
        this.checkEnemyCollisions();
        this.checkProjectileCollisions();
        this.checkItemCollisions();
    }

    checkEnemyCollisions() {
        const meleeDamage = ThrowableObject.BLUEPRINTS.MELEE.damage;
        const meleeType = ThrowableObject.BLUEPRINTS.MELEE.type;

        this.world.enemies.forEach((enemy) => {
            if (!enemy.isDead() && this.world.character.isColliding(enemy)) {
                this.world.character.hit(meleeDamage, meleeType);
                this.world.healthBar.setPercentage(this.world.character.energy);
            }
        });
    }

    checkProjectileCollisions() {
        this.world.throwableObjects.forEach((projectile) => {
            if (projectile.hasHit) return;

            if (projectile.isEnemy) {
                this.handleHit(projectile, this.world.character);
            } else {
                this.world.enemies.forEach(enemy => this.handleHit(projectile, enemy));
            }
        });
    }

    handleHit(projectile, target) {
        if (target.isDead() || !projectile.isColliding(target)) return;
        if (!(projectile instanceof BossBomb)) {
            projectile.hasHit = true;
        }

        target.hit(projectile.damage, projectile.damageType);

        if (target === this.world.character) {
            this.world.healthBar.setPercentage(this.world.character.energy);
        }

        if (projectile instanceof BossBomb) {
            projectile.explode();
        }
    }

    checkItemCollisions() {
        this.world.level.collectableItems.forEach((item, index) => {
            if (this.world.character.isColliding(item)) {
                this.handleItemPickup(item, index);
            }
        });
    }

    handleItemPickup(item, index) {
        if (item instanceof PlasmaCore || item instanceof PowerCell) {
            this.world.character.plasma = Math.min(100, this.world.character.plasma + 40);
            this.world.plasmaBar.setPercentage(this.world.character.plasma);
        } else if (item instanceof Mediapack) {
            this.world.character.energy = Math.min(100, this.world.character.energy + 40);
            this.world.healthBar.setPercentage(this.world.character.energy);
        }
        this.world.level.collectableItems.splice(index, 1);
    }
}