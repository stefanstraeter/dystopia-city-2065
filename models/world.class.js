class World {
    character = new Character();
    enemies = [
        new Spider(),
        new Spider(),
        new Spider()
    ];
    flyingVehicles = [
        new FlyingVehicle('img/04_vehicles/police.png', 400, 30, 0.3, 60, 30),
        new FlyingVehicle('img/04_vehicles/drone.png', 500, 70, 0.6, 40, 30),
        new FlyingVehicle('img/04_vehicles/truck.png', 900, 50, 0.4, 150, 60),
    ];
    backgroundLayers = {
        back: [
            new BackgroundObject('img/01_background/back.png', 0, 0, 200, 450),
            new BackgroundObject('img/01_background/back.png', 200, 0, 200, 450),
            new BackgroundObject('img/01_background/back.png', 400, 0, 200, 450),
            new BackgroundObject('img/01_background/back.png', 600, 0, 200, 450)
        ],
        middle: [
            new BackgroundObject('img/01_background/middle.png', 0, 0, 384, 408),
            new BackgroundObject('img/01_background/middle.png', 384, 0, 384, 408)
        ],
        foreground: [
            new BackgroundObject('img/01_background/foreground.png', 0, 0, 950, 450)
        ]
    };
    canvas;
    ctx;

    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.draw();
    };

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.addObjectsToMap(this.backgroundLayers.back);
        this.addObjectsToMap(this.flyingVehicles);
        this.addObjectsToMap(this.backgroundLayers.middle);
        this.addObjectsToMap(this.backgroundLayers.foreground);

        this.addToMap(this.character);
        this.addObjectsToMap(this.enemies);

        this.updateAllObjects();

        requestAnimationFrame(() => this.draw());
    }

    updateAllObjects() {
        this.character.updateState();
        this.enemies.forEach(enemy => enemy.updateState());
        this.flyingVehicles.forEach(vehicle => {
            vehicle.animate();
            vehicle.move();
        });
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