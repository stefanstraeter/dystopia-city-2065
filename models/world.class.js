class World {
    character = new Character();
    enemies = [
        new Spider(),
        new Spider(),
        new Spider()
    ];

    backgroundObjects = [
        new BackgroundObject('img/01_background/back.png', 0, 0, 200, 450),
        new BackgroundObject('img/01_background/back.png', 200, 0, 200, 450),
        new BackgroundObject('img/01_background/back.png', 400, 0, 200, 450),
        new BackgroundObject('img/01_background/back.png', 600, 0, 200, 450),

        new BackgroundObject('img/01_background/middle.png', 0, 0, 384, 408),
        new BackgroundObject('img/01_background/middle.png', 384, 0, 384, 408),

        new BackgroundObject('img/01_background/foreground.png', 0, 0, 950, 450)
    ];
    canvas;
    ctx;

    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.draw();
    };

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.addObjectsToMap(this.backgroundObjects);
        this.character.updateAnimation();
        this.character.draw(this.ctx);
        this.addObjectsToMap(this.enemies);

        requestAnimationFrame(() => this.draw());
    }

    addToMap(moveableObject) {
        moveableObject.draw(this.ctx);
    }

    addObjectsToMap(objects) {
        objects.forEach(object => {
            object.updateAnimation();
            this.addToMap(object);
        });
    }
}