class World {

    canvas
    ctx;
    keyboard;
    camera_x = 0;
    groundLevel = 490;
    character;
    level;
    enemies;
    flyingVehicles;
    backgroundLayers;
    neonSigns;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.level = level1;
        this.collectedItems = 0;
        this.collectedRockets = 0;
        this.character = new Character(100, 250, 250, 5);
        this.enemies = this.level.enemies;
        this.flyingVehicles = this.level.vehicles;
        this.backgroundLayers = this.level.backgrounds;
        this.neonSigns = this.level.neonSigns;
        this.throwableObjects = [];
        this.setWorld();
        this.draw();
        this.run();
    }

    setWorld() {
        this.character.world = this;
        this.character.y = this.groundLevel - this.character.height;
        this.enemies.forEach(enemy => {
            enemy.world = this;
            enemy.y = this.groundLevel - enemy.height;
        });
        this.neonSigns.forEach(sign => {
            sign.world = this;
        });
        this.flyingVehicles.background.forEach(v => v.world = this);
        this.flyingVehicles.midground.forEach(v => v.world = this);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawParallaxLayer(0.2, this.backgroundLayers.back);
        this.drawParallaxLayer(0.3, this.flyingVehicles.background);
        this.drawParallaxLayer(0.6, this.backgroundLayers.middle);

        this.ctx.save();
        this.ctx.translate(this.camera_x, 0);
        this.drawGameObjects();
        this.ctx.restore();

        this.addObjectsToMap(this.level.UIElements);
        this.addObjectsToMap(this.level.statusIcons);

        requestAnimationFrame(() => this.draw());
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
        this.addObjectsToMap(this.throwableObjects);
        this.addToMap(this.character);
        this.addObjectsToMap(this.enemies);
    }

    updateAllObjects() {
        this.updateGameElements();
        this.filterProjectiles();
        this.filterEnemies();
        this.updateCamera();
    }

    updateGameElements() {
        const allObjects = [
            this.character,
            ...this.level.enemies,
            ...this.level.collectableItems,
            ...this.flyingVehicles.background,
            ...this.flyingVehicles.midground,
            ...this.neonSigns,
            ...this.throwableObjects
        ];

        allObjects.forEach(obj => {
            if (obj && typeof obj.updateState === 'function') {
                obj.updateState();
            }
        });
    }

    filterProjectiles() {
        this.throwableObjects = this.throwableObjects.filter(obj => {
            let isInsideX = obj.x > this.character.x - 1000 && obj.x < this.character.x + 1000;
            return isInsideX && !obj.hasHit;
        });
    }

    filterEnemies() {
        this.level.enemies = this.level.enemies.filter(enemy => !enemy.isFinished);
        this.enemies = this.level.enemies;
    }

    updateCamera() {
        this.camera_x = -this.character.x + 100;
        if (this.camera_x > 0) {
            this.camera_x = 0;
        }
        let max_camera_x = -(this.level.level_end_x - this.canvas.width);
        if (this.camera_x < max_camera_x) {
            this.camera_x = max_camera_x;
        }
    }

    addToMap(moveableObject) {
        moveableObject.draw(this.ctx);

    }

    addObjectsToMap(objects) {
        objects.forEach(object => {
            this.addToMap(object);
        });
    }

    run() {
        setInterval(() => {
            this.updateAllObjects();
            this.checkCollisions();
        }, 1000 / 60);
    }

    checkCollisions() {
        this.checkEnemyCollisions();
        this.checkProjectileCollisions();
        this.checkItemCollisions();
    }


    checkEnemyCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (!enemy.isDead() && this.character.isColliding(enemy)) {
                this.character.hit(10, 'melee');
                this.level.UIElements[0].setPercentage(this.character.energy);
            }
        });
    }

    checkProjectileCollisions() {
        for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
            let projectile = this.throwableObjects[i];
            if (projectile.hasHit) continue;
            this.level.enemies.forEach((enemy) => {
                if (!projectile.hasHit && !enemy.isDead() && projectile.isColliding(enemy)) {
                    projectile.hasHit = true;
                    enemy.hit(projectile.damage, projectile.damageType);
                    this.throwableObjects.splice(i, 1);
                }
            });
        }
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
            this.collectedItems += item.value;
            if (this.collectedItems > 100) {
                this.collectedItems = 100;
            }
            this.level.UIElements[1].setPercentage(this.collectedItems);
        }
        if (item instanceof RocketAmmo) {
            this.collectedRockets += item.value;
            this.level.UIElements[2].setPercentage(this.collectedRockets);
        }
        this.level.collectableItems.splice(index, 1);
    }

}