class PlasmaCore extends CollectableObject {
    value = 25;
    constructor(x, y) {
        super('img/08_collectables/plasma_core.png', x, y, 50, 50, 4, 8);
    }
}

class PowerCell extends CollectableObject {
    value = 25;
    constructor(x, y) {
        super('img/08_collectables/power_cell.png', x, y, 50, 50, 4, 8);
    }
}


class RocketAmmo extends CollectableObject {
    value = 25;
    constructor(x, y) {
        super('img/08_collectables/rocket_ammo.png', x, y, 50, 50, 4, 8);
    }
}
