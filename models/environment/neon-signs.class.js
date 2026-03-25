import { DrawableObject } from '../base/drawable-object.class.js';

/**
 * Represents animated decorative elements in the environment, such as flickering neon signs.
 * Inherits directly from DrawableObject as it requires animation but no movement or physics.
 * @extends DrawableObject
 */
export class NeonSign extends DrawableObject {

    /**
     * @param {string} path - Path to the neon sign's spritesheet.
     * @param {number} x - Horizontal position in the game world.
     * @param {number} y - Vertical position in the game world.
     * @param {number} width - Display width of the sign.
     * @param {number} height - Display height of the sign.
     * @param {number} frames - Number of frames in the animation sequence.
     * @param {number} speed - Playback speed of the animation.
     */
    constructor(path, x, y, width, height, frames, speed) {
        super();
        this.loadImage(path);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.frameCount = frames;
        this.frameSpeed = speed;
    }

    /**
     * Updates the visual state of the sign by advancing the animation frame.
     */
    updateState() {
        this.animate();
    }
}