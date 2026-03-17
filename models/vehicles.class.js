class Police extends FlyingVehicle {
    constructor(x, y, speed, direction, world, parallaxFactor) {
        super('img/04_vehicles/police.png', x, y, speed, 60, 30, direction, world, parallaxFactor);
    }
}

class Truck extends FlyingVehicle {
    constructor(x, y, speed, direction, world, parallaxFactor) {
        super('img/04_vehicles/truck.png', x, y, speed, 150, 60, direction, world, parallaxFactor);
    }
}

class Drone extends FlyingVehicle {
    constructor(x, y, speed, direction, world, parallaxFactor) {
        super('img/04_vehicles/drone.png', x, y, speed, 40, 20, direction, world, parallaxFactor);
    }
}