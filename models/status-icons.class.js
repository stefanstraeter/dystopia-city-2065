class StatusIcon extends DrawableObject {

    constructor(path, x, y, width, height) {
        super();
        this.loadImage(path);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

class HealthIcon extends StatusIcon {
    constructor() {
        super('img/07_status_icons/health.png', 25, 20, 35, 35);
    }
}

class CollectableIcon extends StatusIcon {
    constructor() {
        super('img/07_status_icons/collectables.png', 25, 55, 35, 35);
    }
}

class RocketIcon extends StatusIcon {
    constructor() {
        super('img/07_status_icons/rocket.png', 25, 93, 40, 25);
    }
}