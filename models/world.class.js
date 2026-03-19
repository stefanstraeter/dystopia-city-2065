class World {
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    isShaking = false;
    groundLevel = 490;
    character;
    level;
    enemies;
    flyingVehicles;
    backgroundLayers;
    neonSigns;
    throwableObjects = [];
    healthBar;
    plasmaBar;
    rocketBar;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;

        this.uiManager = new UIManager(this.ctx, this.canvas);
        this.gameStarted = false;

        this.level = level1;

        this.healthBar = this.level.UIElements[0];
        this.plasmaBar = this.level.UIElements[1];
        this.ammoBar = this.level.UIElements[2];

        this.character = new Character(100, 250, 250, 5);
        this.character.world = this;

        this.ammoBar.setPercentage(this.character.ammo);
        this.plasmaBar.setPercentage(this.character.plasma);

        this.enemies = this.level.enemies;
        this.flyingVehicles = this.level.vehicles;
        this.backgroundLayers = this.level.backgrounds;
        this.neonSigns = this.level.neonSigns;

        this.setWorld();
        this.draw();
        this.run();
    }

    setWorld() {
        this.character.world = this;
        this.character.y = this.groundLevel - this.character.height;
        this.enemies.forEach(enemy => {
            enemy.world = this;
            if (!(enemy instanceof SentryDrone)) {
                enemy.y = this.groundLevel - enemy.height;
            }
        });
        this.neonSigns.forEach(sign => sign.world = this);
        this.flyingVehicles.background.forEach(vehicle => vehicle.world = this);
        this.flyingVehicles.midground.forEach(vehicle => vehicle.world = this);
    }


    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (!this.gameStarted) {
            this.uiManager.drawStartScreen();
            this.checkStartKey();
            // Wir müssen den Loop trotzdem am Leben erhalten!
            requestAnimationFrame(() => this.draw());
            return;
        }

        // --- Ab hier: Der eigentliche Spiel-Code ---
        this.drawParallaxLayer(0.2, this.backgroundLayers.back);
        this.drawParallaxLayer(0.3, this.flyingVehicles.background);
        this.drawParallaxLayer(0.6, this.backgroundLayers.middle);

        this.ctx.save();
        this.ctx.translate(this.camera_x, 0);
        this.drawGameObjects();
        this.ctx.restore();

        this.addObjectsToMap(this.level.UIElements);
        this.addObjectsToMap(this.level.statusIcons);

        // Endbildschirme prüfen
        if (this.character.energy <= 0) {
            this.uiManager.drawMessage('TERMINATED. Better luck in the next clone, Bud.', '#ff0055');
        } else if (this.bossIsDead()) {
            this.uiManager.drawMessage('MISSION COMPLETE', 'Neon city is secured!', '#00f2ff');
        }

        requestAnimationFrame(() => this.draw());
    }

    checkStartKey() {
        if (this.keyboard.KEY_ENTER || this.keyboard.LEFT_CLICK) {
            this.gameStarted = true;
        }
    }

    drawParallaxLayer(speed, objects) {
        this.ctx.save();
        this.ctx.translate(this.camera_x * speed, 0);
        this.addObjectsToMap(objects);
        this.ctx.restore();
    }

    drawGameObjects() {
        this.addObjectsToMap(this.flyingVehicles.midground);
        this.addObjectsToMap(this.backgroundLayers.foreground);
        this.addObjectsToMap(this.level.collectableItems);
        this.addObjectsToMap(this.neonSigns);
        this.addToMap(this.character);
        this.addObjectsToMap(this.enemies);
        this.addObjectsToMap(this.throwableObjects);
    }

    run() {
        setInterval(() => {
            this.updateAllObjects();
            this.checkCollisions();
        }, 1000 / 60);
    }

    updateAllObjects() {
        this.updateGameElements();
        this.filterProjectiles();
        this.filterEnemies();
        this.updateCamera();

        if (this.character.isDead()) {
            this.resetBossBehavior();
        }
    }

    updateGameElements() {
        this.character.updateState();
        this.enemies.forEach(enemy => enemy.updateState());
        this.throwableObjects.forEach(objects => objects.updateState());
        this.neonSigns.forEach(sign => sign.updateState());
        this.flyingVehicles.background.forEach(vehicle => vehicle.updateState());
        this.flyingVehicles.midground.forEach(vehicle => vehicle.updateState());
        this.level.collectableItems.forEach(item => item.updateState());
    }

    checkCollisions() {
        this.checkEnemyCollisions();
        this.checkProjectileCollisions();
        this.checkItemCollisions();
    }

    checkEnemyCollisions() {
        const meleeDamage = ThrowableObject.BLUEPRINTS.MELEE.damage;
        const meleeType = ThrowableObject.BLUEPRINTS.MELEE.type;

        this.enemies.forEach((enemy) => {
            if (!enemy.isDead() && this.character.isColliding(enemy)) {
                this.character.hit(meleeDamage, meleeType);
                this.healthBar.setPercentage(this.character.energy);
            }
        });
    }

    checkProjectileCollisions() {
        this.throwableObjects.forEach((projectile) => {
            if (projectile.hasHit) return;

            if (projectile.isEnemy) {
                this.checkHit(projectile, this.character);
            } else {
                this.enemies.forEach(enemy => {
                    this.checkHit(projectile, enemy);
                });
            }
        });
    }

    checkHit(projectile, target) {
        if (projectile.isEnemy && target !== this.character) return;
        if (!projectile.isEnemy && target === this.character) return;

        if (!projectile.hasHit && !target.isDead() && projectile.isColliding(target)) {
            if (projectile instanceof BossBomb) {
                if (!projectile.hasExploded) {
                    target.hit(projectile.damage, projectile.damageType);
                    this.healthBar.setPercentage(this.character.energy);
                    projectile.explode();
                }
            } else {
                projectile.hasHit = true;
                target.hit(projectile.damage, projectile.damageType);
                if (target === this.character) {
                    this.healthBar.setPercentage(this.character.energy);
                }
            }
        }
    }

    checkEnemyProjectileHitPlayer(projectile) {
        if (this.character.isColliding(projectile)) {
            projectile.hasHit = true;
            this.character.hit(projectile.damage, projectile.damageType);
            this.healthBar.setPercentage(this.character.energy);

            if (projectile instanceof BossBomb && !projectile.hasExploded) {
                projectile.explode();
            }
        }
    }

    checkBossBombCollision(bomb) {
        if (this.character.isColliding(bomb)) {
            this.character.hit(bomb.damage, bomb.damageType);
            this.healthBar.setPercentage(this.character.energy);
            if (typeof bomb.explode === 'function' && !bomb.hasExploded) {
                bomb.explode();
            }
        }
    }

    checkPlayerProjectileHitEnemy(projectile) {
        this.enemies.forEach((enemy) => {
            if (!projectile.hasHit && !enemy.isDead() && projectile.isColliding(enemy)) {
                projectile.hasHit = true;
                enemy.hit(projectile.damage, projectile.damageType);
            }
        });
    }

    checkItemCollisions() {
        this.level.collectableItems.forEach((item, index) => {
            if (this.character.isColliding(item)) {
                this.handleItemPickup(item, index);
            }
        });
    }

    handleItemPickup(item, index) {
        if (item instanceof PlasmaCore || item instanceof PowerCell) {
            this.character.plasma = Math.min(100, this.character.plasma + 40);
            this.plasmaBar.setPercentage(this.character.plasma);
        }
        if (item instanceof Mediapack) {
            this.character.energy = Math.min(100, this.character.energy + 40);
            this.healthBar.setPercentage(this.character.energy);
        }

        this.level.collectableItems.splice(index, 1);
    }

    filterProjectiles() {
        this.throwableObjects = this.throwableObjects.filter(obj => {
            let isInsideX = obj.x > this.character.x - 600 && obj.x < this.character.x + 600;
            return isInsideX && !obj.hasHit;
        });
    }

    filterEnemies() {
        this.level.enemies = this.level.enemies.filter(enemy => !enemy.isFinished);
        this.enemies = this.level.enemies;
    }

    triggerCameraShake() {
        if (this.isShaking) return;
        this.isShaking = true;
        setTimeout(() => {
            this.isShaking = false;
        }, 300);
    }

    updateCamera() {
        let target_camera_x = Math.max(-(this.level.level_end_x - this.canvas.width), Math.min(0, -this.character.x + 100));

        if (this.isShaking) {
            let shakeOffset = (Math.random() - 0.5) * 20;
            this.camera_x = target_camera_x + shakeOffset;
        } else {
            this.camera_x = target_camera_x;
        }
    }

    addToMap(mo) {
        mo.draw(this.ctx);
    }

    addObjectsToMap(objects) {
        objects.forEach(obj => this.addToMap(obj));
    }

    bossIsDead() {
        let boss = this.enemies.find(e => e instanceof Endboss);
        return boss && boss.isDead();
    }

    resetBossBehavior() {
        this.enemies.forEach(enemy => {
            if (enemy instanceof Endboss) {
                if (typeof enemy.performPatrol === 'function') {
                    enemy.isAnimatingOnce = false;
                }
            }
        });
    }
}