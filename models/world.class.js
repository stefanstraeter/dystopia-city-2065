class World {

    canvas
    ctx;
    keyboard;
    camera_x = 0;
    groundLevel = 490;
    character = new Character(100, 250, 250, 3);
    level = level1;
    enemies = this.level.enemies;
    flyingVehicles = this.level.vehicles;
    backgroundLayers = this.level.backgrounds;
    neonSigns = this.level.neonSigns;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.setWorld();
        this.draw();
    }

    setWorld() {
        this.character.world = this;
        this.character.y = this.groundLevel - this.character.height;

        this.level.enemies.forEach(enemy => {
            enemy.world = this;
            enemy.y = this.groundLevel - enemy.height;
        });

        this.flyingVehicles.background.forEach(vehicle =>
            vehicle.world = this);
        this.flyingVehicles.midground.forEach(vehicle =>
            vehicle.world = this);
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

        this.addObjectsToMap(this.neonSigns);

        this.ctx.restore();

        requestAnimationFrame(() => this.draw());
    }

    updateAllObjects() {
        this.character.updateState();
        this.camera_x = -this.character.x + 60;
        this.enemies.forEach(enemy => enemy.updateState());

        this.flyingVehicles.background.forEach(vehicle => vehicle.updateState());
        this.flyingVehicles.midground.forEach(vehicle => vehicle.updateState());

        this.neonSigns.forEach(sign => sign.updateState());
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