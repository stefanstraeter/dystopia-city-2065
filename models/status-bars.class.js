class Health extends UIElement {
    constructor() {
        super('img/06_status_bar/health.png', 30, 30, 190, 30, 18);
    }
}

class Collectable extends UIElement {
    constructor() {
        super('img/06_status_bar/collectables.png', 30, 60, 190, 30, 18);
        this.setPercentage(0);
    }
}

class Rocket extends UIElement {
    constructor() {
        super('img/06_status_bar/rockets.png', 30, 90, 190, 30, 18);
        this.setPercentage(0);
    }
}