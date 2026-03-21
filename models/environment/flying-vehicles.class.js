class FlyingVehicle extends MoveableObject {

    constructor(imagePath, x, y, speed, width, height, direction, world, parallaxFactor = 1) {
        super();
        this.loadImage(imagePath);
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.width = width;
        this.height = height;
        this.direction = direction;
        this.world = world;
        this.parallaxFactor = parallaxFactor;
        this.isMirrored = (this.direction === 1);
    }

    move() {

        this.x += this.speed * this.direction;
        let leftBoundary = -500;
        let rightBoundary = this.world.level.level_end_x + 500;
        if (this.direction === -1 && this.x < leftBoundary) {
            this.x = rightBoundary;
            this.y = 20 + Math.random() * 200;
        }
        if (this.direction === 1 && this.x > rightBoundary) {
            this.x = leftBoundary;
            this.y = 20 + Math.random() * 200;
        }
    }

    updateState() {
        this.move();
        if (this.frameCount > 1) {
            super.animate();
        }
    }
}

class Police extends FlyingVehicle {
    constructor(x, y, speed, direction, world, parallaxFactor) {
        super('assets/img/04_vehicles/police.png', x, y, speed, 60, 30, direction, world, parallaxFactor);
    }
}

class Truck extends FlyingVehicle {
    constructor(x, y, speed, direction, world, parallaxFactor) {
        super('assets/img/04_vehicles/truck.png', x, y, speed, 120, 50, direction, world, parallaxFactor);
    }
}

class Drone extends FlyingVehicle {
    constructor(x, y, speed, direction, world, parallaxFactor) {
        super('assets/img/04_vehicles/drone.png', x, y, speed, 40, 20, direction, world, parallaxFactor);
    }
}