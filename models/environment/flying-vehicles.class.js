import { MoveableObject } from '../base/moveable-object.class.js';

/**
 * Represents ambient flying vehicles in the background or midground.
 * Includes logic for automatic movement and screen-wrapping to simulate continuous traffic.
 * @extends MoveableObject
 */
export class FlyingVehicle extends MoveableObject {

    /**
     * @param {string} imagePath - Path to the vehicle sprite.
     * @param {number} x - Initial horizontal position.
     * @param {number} y - Initial vertical position.
     * @param {number} speed - Movement speed of the vehicle.
     * @param {number} width - Display width.
     * @param {number} height - Display height.
     * @param {number} direction - Direction of travel (-1 for left, 1 for right).
     * @param {Object} world - Reference to the game world for boundary checks.
     * @param {number} [parallaxFactor=1] - Speed multiplier for parallax scrolling.
     */
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

    /**
     * Handles the continuous movement of the vehicle.
     * Resets position to the opposite side of the level when boundaries are exceeded.
     */
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

    /**
     * Updates the vehicle's position and triggers animation if the sprite is a spritesheet.
     */
    updateState() {
        this.move();
        if (this.frameCount > 1) {
            super.animate();
        }
    }
}

/**
 * Police vehicle subtype with specific dimensions.
 * @extends FlyingVehicle
 */
export class Police extends FlyingVehicle {
    constructor(x, y, speed, direction, world, parallaxFactor) {
        super('assets/img/04_vehicles/police.png', x, y, speed, 60, 30, direction, world, parallaxFactor);
    }
}

/**
 * Large truck vehicle subtype with specific dimensions.
 * @extends FlyingVehicle
 */
export class Truck extends FlyingVehicle {
    constructor(x, y, speed, direction, world, parallaxFactor) {
        super('assets/img/04_vehicles/truck.png', x, y, speed, 120, 50, direction, world, parallaxFactor);
    }
}

/**
 * Small drone vehicle subtype with specific dimensions.
 * @extends FlyingVehicle
 */
export class Drone extends FlyingVehicle {
    constructor(x, y, speed, direction, world, parallaxFactor) {
        super('assets/img/04_vehicles/drone.png', x, y, speed, 40, 20, direction, world, parallaxFactor);
    }
}