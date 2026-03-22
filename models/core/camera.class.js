/**
 * Handles the game viewport, including character tracking, 
 * level boundaries, and screen shake effects.
 */
class Camera {

    x = 0;
    isShaking = false;
    shakeIntensity = 20;

    constructor() {
    }

    /**
     * Updates the camera position to follow the character while staying within level bounds.
     * Applies an optional random offset if screen shake is active.
     * @param {Object} character - The player character to follow.
     * @param {Object} level - The current level object containing boundaries.
     * @param {HTMLCanvasElement} canvas - The game canvas to determine viewport width.
     */
    update(character, level, canvas) {
        let target_x = Math.max(-(level.level_end_x - canvas.width), Math.min(0, -character.x + 100));
        let shake = this.isShaking ? (Math.random() - 0.5) * this.shakeIntensity : 0;
        this.x = target_x + shake;
    }

    /**
     * Activates a screen shake effect for a specified duration.
     * @param {number} [duration=500] - How long the shake lasts in milliseconds.
     * @param {number} [intensity=20] - The maximum pixel offset for the shake.
     */
    activateShake(duration = 500, intensity = 20) {
        this.isShaking = true;
        this.shakeIntensity = intensity;
        setTimeout(() => {
            this.isShaking = false;
        }, duration);
    }
}