import { MoveableObject } from '../base/moveable-object.class.js';

/**
 * Represents a static or moving background layer in the game world.
 * Used for parallax effects and environmental scenery.
 * @extends MoveableObject
 */
export class BackgroundObject extends MoveableObject {

    /**
     * Initializes a background layer with a specific image and dimensions.
     * @param {string} imagePath - The file path to the background texture.
     * @param {number} x - The initial horizontal position.
     * @param {number} y - The initial vertical position.
     * @param {number} width - The width of the background segment.
     * @param {number} height - The height of the background segment.
     */
    constructor(imagePath, x, y, width, height) {
        super();
        this.loadImage(imagePath);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

}