class World {
    character = new Character();
    enemies = [
        new Spider(),
        new Spider(),
        new Spider()
    ];
    flyingVehicles = [
        new FlyingVehicle('img/04_vehicles/police.png', 290, 40, 0.1, 60, 30),
        new FlyingVehicle('img/04_vehicles/drone.png', 900, 20, 0.16, 50, 30),
        new FlyingVehicle('img/04_vehicles/truck.png', 500, 50, 0.2, 150, 60),
    ];
    backgroundLayers = {
        back: [
            new BackgroundObject('img/01_background/far-buildings.png', 0, 0, 350, 350),
            new BackgroundObject('img/01_background/far-buildings.png', 350, 0, 350, 350),
            new BackgroundObject('img/01_background/far-buildings.png', 700, 0, 350, 350)

        ],
        middle: [
            new BackgroundObject('img/01_background/back-buildings.png', 0, 0, 500, 400),
            new BackgroundObject('img/01_background/back-buildings.png', 500, 0, 500, 400)
        ],
        foreground: [
            new BackgroundObject('img/01_background/foreground 2.png', 0, 0, 850, 450),




        ]
    };
    canvas;
    ctx;
    keyboard;

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

        this.addObjectsToMap(this.backgroundLayers.back);
        this.addObjectsToMap(this.flyingVehicles);
        this.addObjectsToMap(this.backgroundLayers.middle);
        this.addObjectsToMap(this.backgroundLayers.foreground);

        this.addObjectsToMap(this.enemies);
        this.addToMap(this.character);

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