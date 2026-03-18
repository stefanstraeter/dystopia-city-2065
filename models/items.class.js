class CollectableObject extends MoveableObject {

    constructor(path, x, y, width = 50, height = 50, frames = 4, speed = 8) {
        super();
        this.loadImage(path);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.frameCount = frames;
        this.frameSpeed = speed;
        this.currentFrame = 0;
        this.frameCounter = 0;

        this.offset = { top: 5, bottom: 5, left: 5, right: 5 };
    }

    updateState() {
        if (this.frameCount > 1) {
            this.animate();
        }
    }
}

class PlasmaCore extends CollectableObject {
    value = 25;
    constructor(x, y) {
        super('assets/img/08_collectables/plasma_core.png', x, y);
    }
}

class PowerCell extends CollectableObject {
    value = 25;
    constructor(x, y) {
        super('assets/img/08_collectables/power_cell.png', x, y);
    }
}

class RocketAmmo extends CollectableObject {
    value = 10;
    constructor(x, y) {
        super('assets/img/08_collectables/rocket_ammo.png', x, y);
    }
}