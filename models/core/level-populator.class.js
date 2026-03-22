/**
 * Responsible for initializing level objects, aligning them to the ground,
 * and spawning dynamic background elements like traffic.
 */
class LevelPopulator {

    /**
     * @param {Object} world - Reference to the main game world instance.
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Iterates through all level object groups to assign world references 
     * and align ground-based entities to the correct Y-coordinate.
     */
    applyWorldToObjects() {
        const level = this.world.level;
        const groups = [
            level.enemies || [],
            level.neonSigns || [],
            level.collectableItems || [],
            level.vehicles?.background || [],
            level.vehicles?.midground || []
        ];

        groups.forEach(group => {
            group.forEach(obj => {
                if (!obj) return;

                obj.world = this.world;
                const isFlying = obj instanceof FlyingVehicle || obj instanceof SentryDrone;
                const isItem = obj instanceof CollectableObject;
                const isSign = obj instanceof NeonSign;
                if (obj instanceof MoveableObject && !isFlying && !isItem && !isSign) {
                    this.alignToGround(obj);
                }
            });
        });
    }

    /**
     * Sets an object's vertical position based on the world's ground level and object height.
     * @param {MoveableObject} obj - The object to be positioned on the ground.
     */
    alignToGround(obj) {
        const offset = obj.offset?.bottom || 0;
        obj.y = this.world.groundLevel - obj.height + offset;
    }

    /**
     * Generates a specified number of randomized background vehicles across the level width.
     * @param {number} count - The number of vehicles to spawn.
     */
    spawnTraffic(count) {
        const levelWidth = this.world.level.level_end_x;
        for (let i = 0; i < count; i++) {
            const config = {
                x: Math.random() * levelWidth,
                y: 20 + Math.random() * 180,
                speed: 0.5 + Math.random() * 2,
                direction: Math.random() > 0.5 ? 1 : -1
            };

            const vehicle = this.getRandomVehicle(config);
            this.world.level.vehicles.background.push(vehicle);
        }
    }

    /**
     * Randomly selects and instantiates a vehicle type (Police, Drone, or Truck).
     * @param {Object} c - Configuration object containing x, y, speed, and direction.
     * @returns {Police|Drone|Truck} A new vehicle instance.
     */
    getRandomVehicle(c) {
        const type = Math.random();
        if (type < 0.3) return new Police(c.x, c.y, c.speed, c.direction, this.world, 0.3);
        if (type < 0.6) return new Drone(c.x, c.y, c.speed, c.direction, this.world, 0.3);
        return new Truck(c.x, c.y, c.speed, c.direction, this.world, 0.3);
    }
}