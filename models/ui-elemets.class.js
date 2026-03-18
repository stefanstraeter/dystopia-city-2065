class UIElement extends DrawableObject {
    percentage = 100;

    constructor(path, x, y, width, height, frameCount, startPercentage = 100) {
        super();
        this.loadImage(path);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.frameCount = frameCount;
        this.setPercentage(startPercentage);
    }

    setPercentage(percentage) {
        this.percentage = percentage;

        let frame = (this.frameCount - 1) - Math.round((this.percentage / 100) * (this.frameCount - 1));
        this.currentFrame = Math.max(0, Math.min(frame, this.frameCount - 1));
    }
}

class HealthBar extends UIElement {
    constructor() {
        super('assets/img/06_status_bar/health.png', 30, 30, 190, 30, 18, 100);
    }
}

class CollectableBar extends UIElement {
    constructor() {
        super('assets/img/06_status_bar/collectables.png', 30, 60, 190, 30, 18, 0);
    }
}

class RocketBar extends UIElement {
    constructor() {
        super('assets/img/06_status_bar/rockets.png', 30, 90, 190, 30, 18, 0);
    }
}

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
    constructor() { super('assets/img/07_status_icons/health.png', 25, 20, 35, 35); }
}

class CollectableIcon extends StatusIcon {
    constructor() { super('assets/img/07_status_icons/collectables.png', 25, 55, 35, 35); }
}

class RocketIcon extends StatusIcon {
    constructor() { super('assets/img/07_status_icons/rocket.png', 25, 95, 40, 20); }
}