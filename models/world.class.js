class World {
    groundLevel = 450;
    character = new Character(100, 200, 250, 250, 3);
    enemies = [
        new Spider(900, this.groundLevel, 130, 130, 0.2),
        new Spider(1200, this.groundLevel, 90, 90, 0.5),
        new Spider(1350, this.groundLevel, 100, 100, 0.8),
        new Spider(1950, this.groundLevel, 150, 150, 0.4)
    ];

    flyingVehicles = {
        background: [
            new FlyingVehicle('img/04_vehicles/drone.png', 400, 40, 2.5, 40, 20, -1, this, 0.3),
            new FlyingVehicle('img/04_vehicles/police.png', 1200, 60, 2.0, 40, 20, -1, this, 0.3),
            new FlyingVehicle('img/04_vehicles/drone.png', 2000, 30, 3.0, 40, 20, -1, this, 0.3)
        ],
        midground: [
            new FlyingVehicle('img/04_vehicles/police.png', 800, 180, 1.2, 60, 30, -1, this, 1),
            new FlyingVehicle('img/04_vehicles/truck.png', 1800, 100, 1.1, 150, 60, 1, this, 1)
        ]
    };
    backgroundLayers = {
        back: [
            new BackgroundObject('img/01_background/far-buildings.png', 0, 0, 350, 350),
            new BackgroundObject('img/01_background/far-buildings.png', 350, 0, 350, 350),
            new BackgroundObject('img/01_background/far-buildings.png', 700, 0, 350, 350),
            new BackgroundObject('img/01_background/far-buildings.png', 1050, 0, 350, 350),
            new BackgroundObject('img/01_background/far-buildings.png', 1400, 0, 350, 350),
            new BackgroundObject('img/01_background/far-buildings.png', 1750, 0, 350, 350),
            new BackgroundObject('img/01_background/far-buildings.png', 2100, 0, 350, 350),
            new BackgroundObject('img/01_background/far-buildings.png', 2450, 0, 350, 350),
            new BackgroundObject('img/01_background/far-buildings.png', 2800, 0, 350, 350),
            new BackgroundObject('img/01_background/far-buildings.png', 3150, 0, 350, 350)
        ],
        middle: [
            new BackgroundObject('img/01_background/back-buildings.png', -200, -30, 580, 400),
            new BackgroundObject('img/01_background/back-buildings.png', 380, -30, 580, 400),
            new BackgroundObject('img/01_background/back-buildings.png', 960, -30, 580, 400),
            new BackgroundObject('img/01_background/back-buildings.png', 1540, -30, 580, 400),
            new BackgroundObject('img/01_background/back-buildings.png', 2120, -30, 580, 400),
            new BackgroundObject('img/01_background/back-buildings.png', 2700, -30, 580, 400)
        ],
        foreground: [
            new BackgroundObject('img/01_background/foreground 2.png', -1200, -280, 1200, 750),
            new BackgroundObject('img/01_background/foreground 2.png', 0, -280, 1200, 750),
            new BackgroundObject('img/01_background/foreground 2.png', 1200, -280, 1200, 750),
            new BackgroundObject('img/01_background/foreground 2.png', 2400, -280, 1200, 750)
        ]
    };
    canvas
    ctx;
    keyboard;
    camera_x;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.setWorld();
        this.draw();

    };

    setWorld() {
        this.character.world = this;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.updateAllObjects();

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
        this.addObjectsToMap(this.enemies);
        this.addToMap(this.character);

        this.ctx.restore();

        requestAnimationFrame(() => this.draw());
    }

    updateAllObjects() {
        this.character.updateState();
        this.camera_x = -this.character.x + 60;
        this.enemies.forEach(enemy => enemy.updateState());

        this.flyingVehicles.background.forEach(vehicle => vehicle.updateState());
        this.flyingVehicles.midground.forEach(vehicle => vehicle.updateState());
    }

    addToMap(moveableObject) {
        moveableObject.draw(this.ctx);
    }

    addObjectsToMap(objects) {
        objects.forEach(object => {
            this.addToMap(object);
        });
    }
}