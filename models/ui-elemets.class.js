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
        this.currentFrame = frame;
    }
}

class Health extends UIElement {
    constructor() {
        super('img/06_status_bar/health.png', 30, 30, 190, 30, 18);
    }
}

class Collectable extends UIElement {
    constructor() {
        super('img/06_status_bar/collectables.png', 30, 60, 190, 30, 18, 0);
        this.setPercentage(0);
    }
}

class Rocket extends UIElement {
    constructor() {
        super('img/06_status_bar/rockets.png', 30, 90, 190, 30, 18, 0);
        this.setPercentage(0);
    }
}