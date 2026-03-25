import { MoveableObject } from '../base/moveable-object.class.js';

/**
 * Base class for all items that can be picked up by the player.
 * Supports both static images and animated spritesheets.
 * @extends MoveableObject
 */
export class CollectableObject extends MoveableObject {

    /**
     * @param {string} path - Path to the item's image or spritesheet.
     * @param {number} x - Horizontal position.
     * @param {number} y - Vertical position.
     * @param {number} [width=50] - Display width.
     * @param {number} [height=50] - Display height.
     * @param {number} [frames=4] - Number of animation frames.
     * @param {number} [speed=8] - Animation playback speed.
     */
    constructor(path, x, y, width = 50, height = 50, frames = 4, speed = 8) {
        super();
        this.loadImage(path);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.frameCount = frames;
        this.frameSpeed = speed;
        this.currentFrame = 0;
        this.frameCounter = 0;

        this.offset = { top: 5, bottom: 5, left: 5, right: 5 };
    }

    /**
     * Updates the object's visual state. 
     * Triggers animation only if the object has multiple frames.
     */
    updateState() {
        if (this.frameCount > 1) {
            this.animate();
        }
    }
}

/**
 * A collectable core that typically recharges the player's plasma resources.
 * @extends CollectableObject
 */
export class PlasmaCore extends CollectableObject {
    value = 25;
    constructor(x, y) {
        super('assets/img/07_collectables/plasma_core.png', x, y);
    }
}

/**
 * A power cell item, used for ammunition or energy replenishment.
 * @extends CollectableObject
 */
export class PowerCell extends CollectableObject {
    value = 25;
    constructor(x, y) {
        super('assets/img/07_collectables/power_cell.png', x, y);
    }
}

/**
 * A medical pack used to restore the player character's health (energy).
 * @extends CollectableObject
 */
export class Mediapack extends CollectableObject {
    value = 5;
    constructor(x, y) {
        super('assets/img/07_collectables/medipack.png', x, y, 60, 60);
    }
}