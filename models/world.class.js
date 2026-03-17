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

        this.ctx.save();
        this.ctx.translate(this.camera_x * 0.2, 0);
        this.addObjectsToMap(this.backgroundLayers.back);
        this.ctx.restore();

        this.ctx.save();
        this.ctx.translate(this.camera_x * 0.3, 0);
        this.addObjectsToMap(this.flyingVehicles.background);
        this.ctx.restore();

        this.ctx.save();
        this.ctx.translate(this.camera_x * 0.6, 0);
        this.addObjectsToMap(this.backgroundLayers.middle);
        this.ctx.restore();

        this.ctx.save();
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.flyingVehicles.midground);
        this.addObjectsToMap(this.backgroundLayers.foreground);
        this.addObjectsToMap(this.level.items);
        this.addObjectsToMap(this.enemies);
        this.addObjectsToMap(this.neonSigns);
        this.addToMap(this.character);
        this.ctx.restore();

        this.addObjectsToMap(this.level.UIElement);
        this.addObjectsToMap(this.level.statusIcons);

        requestAnimationFrame(() => this.draw());
    }

    updateAllObjects() {
        this.character.updateState();
        this.enemies.forEach(enemy => enemy.updateState());
        this.level.items.forEach(item => item.updateState());
        this.flyingVehicles.background.forEach(vehicle => vehicle.updateState());
        this.flyingVehicles.midground.forEach(vehicle => vehicle.updateState());
        this.neonSigns.forEach(sign => sign.updateState());
        this.updateCamera();
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
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy)) {
                this.character.hit();

                this.level.UIElement[0].setPercentage(this.character.energy);
            }
        });

        this.level.items.forEach((item, index) => {
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
            this.level.UIElement[1].setPercentage(this.collectedItems);
        }
        if (item instanceof RocketAmmo) {
            this.collectedRockets += item.value;
            this.level.UIElement[2].setPercentage(this.collectedRockets);
        }
        this.level.items.splice(index, 1);
    }

}