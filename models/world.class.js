class World {
    character = new Character();
    enemies = [
        new Spider(),
        new Spider(),
        new Spider()
    ];
    flyingVehicles = {
        background: [
            new FlyingVehicle('img/04_vehicles/drone.png', 900, 40, 0.5, 40, 20, -1)
        ],
        midground: [
            new FlyingVehicle('img/04_vehicles/police.png', 550, 200, 0.3, 60, 30, -1),
            new FlyingVehicle('img/04_vehicles/truck.png', 0, 100, 0.3, 150, 60, 1)
        ]
    };
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
        this.addObjectsToMap(this.flyingVehicles.background);
        this.addObjectsToMap(this.backgroundLayers.middle);
        this.addObjectsToMap(this.flyingVehicles.midground);
        this.addObjectsToMap(this.backgroundLayers.foreground);

        this.addObjectsToMap(this.enemies);
        this.addToMap(this.character);

        this.updateAllObjects();
        requestAnimationFrame(() => this.draw());
    }

    updateAllObjects() {
        this.character.updateState();
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