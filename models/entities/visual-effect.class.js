/**
 * Represents a one-time visual effect like explosions or hits.
 * @extends MoveableObject
 */
class VisualEffect extends MoveableObject {
    static BLUEPRINTS = {
        PLASMA: { path: 'assets/img/08_explosions/plasma_explosion.png', frames: 6, speed: 2 },
        BOMB: { path: 'assets/img/08_explosions/rocket_explosion.png', frames: 8, speed: 4 }
    };

    /**
     * @param {number} x - Horizontal position.
     * @param {number} y - Vertical position.
     * @param {number} width - Effect width.
     * @param {number} height - Effect height.
     * @param {string} type - Key from VisualEffect.BLUEPRINTS.
     */
    constructor(x, y, width, height, type) {
        super();
        const blueprint = VisualEffect.BLUEPRINTS[type];
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isFinished = false;
        this.animations = { 'play': blueprint };
        this.playAnimation('play');
        this.isAnimatingOnce = true;
    }

    /**
     * Updates the effect animation and marks it for removal when finished.
     */
    updateState() {
        this.animate();
        // Check if the one-time animation has reached its end
        if (this.currentFrame >= this.frameCount - 1) {
            this.isFinished = true;
        }
    }
}