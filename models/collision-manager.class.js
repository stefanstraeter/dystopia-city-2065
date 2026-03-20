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

        this.world.level.enemies.forEach((enemy) => {
            if (!enemy.isDead() && this.world.character.isColliding(enemy)) {
                this.world.character.hit(meleeDamage);
                this.world.healthBar.setPercentage(this.world.character.energy);
                this.world.camera.activateShake(100, 5);
            }
        });
    }

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

    handleHit(projectile, target) {
        if (target.isDead() || !projectile.isColliding(target)) return;

        target.hit(projectile.damage);

        if (projectile instanceof BossBomb) {
            projectile.explode();
        } else {
            projectile.hasHit = true;
        }
        if (target instanceof Endboss) {
            if (this.world.level.StatusBar[3]) {
                this.world.level.StatusBar[3].setPercentage(target.energy);
            }
        }
        if (target === this.world.character) {
            this.world.healthBar.setPercentage(this.world.character.energy);
            this.world.camera.activateShake(200, 10);
        }
    }

    checkItemCollisions() {
        this.world.level.collectableItems.forEach((item) => {
            if (!item.isCollected && this.world.character.isColliding(item)) {
                this.handleItemPickup(item);
            }
        });
    }

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