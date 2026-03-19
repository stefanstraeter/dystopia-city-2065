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
        super('assets/img/06_status_bar/health_status.png', 30, 30, 190, 30, 18, 100);
    }
}

class PlasmaBar extends UIElement {
    constructor() {
        super('assets/img/06_status_bar/plasma_status.png', 30, 60, 190, 30, 18, 0);
    }
}

class AmmoBar extends UIElement {
    constructor() {
        super('assets/img/06_status_bar/gun_status.png', 30, 90, 190, 30, 18, 0);
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
    constructor() { super('assets/img/06_status_bar/health_icon.png', 19, 20, 40, 40); }
}

class PlasmaIcon extends StatusIcon {
    constructor() { super('assets/img/06_status_bar/plasma_icon.png', 22, 57, 40, 40); }
}

class AmmoIcon extends StatusIcon {
    constructor() { super('assets/img/06_status_bar/gun_icon.png', 12, 97, 50, 25); }
}