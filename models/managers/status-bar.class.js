/**
 * A dynamic UI element that represents a percentage-based value (health, ammo, etc.) 
 * using a specific frame from a spritesheet.
 * @extends DrawableObject
 */
class StatusBar extends DrawableObject {
    percentage = 100;

    /**
     * @param {string} path - Path to the status bar spritesheet.
     * @param {number} x - Horizontal screen position.
     * @param {number} y - Vertical screen position.
     * @param {number} width - Display width.
     * @param {number} height - Display height.
     * @param {number} frameCount - Total number of states (frames) in the spritesheet.
     * @param {number} [startPercentage=100] - Initial value of the bar.
     */
    constructor(path, x, y, width, height, frameCount, startPercentage = 100) {
        super();
        this.loadImage(path);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.frameCount = frameCount;
        this.setPercentage(startPercentage);
    }

    /**
     * Updates the current frame based on the provided percentage.
     * Maps 0-100% to the available frames in the spritesheet.
     * @param {number} percentage - The new value (0 to 100).
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let frame = (this.frameCount - 1) - Math.round((this.percentage / 100) * (this.frameCount - 1));
        this.currentFrame = Math.max(0, Math.min(frame, this.frameCount - 1));
    }

    /**
     * Draws the specific sub-rectangle (frame) of the spritesheet to the canvas.
     * @param {CanvasRenderingContext2D} ctx - The render context.
     */
    draw(ctx) {
        if (this.img && this.img.complete) {
            let spriteWidth = this.img.width / this.frameCount;
            let sourceX = this.currentFrame * spriteWidth;

            ctx.drawImage(
                this.img,
                sourceX, 0,
                spriteWidth, this.img.height,
                this.x, this.y,
                this.width, this.height
            );
        }
    }
}

/**
 * HUD element for the player's health.
 * @extends StatusBar
 */
class HealthBar extends StatusBar {
    constructor() {
        super('assets/img/06_status_bar/health_status.png', 30, 30, 190, 30, 18, 100);
    }
}

/**
 * HUD element for the player's plasma energy.
 * @extends StatusBar
 */
class PlasmaBar extends StatusBar {
    constructor() {
        super('assets/img/06_status_bar/plasma_status.png', 30, 60, 190, 30, 18, 0);
    }
}

/**
 * HUD element for the player's ammunition level.
 * @extends StatusBar
 */
class AmmoBar extends StatusBar {
    constructor() {
        super('assets/img/06_status_bar/gun_status.png', 30, 90, 190, 30, 18, 0);
    }
}

/**
 * A world-space status bar that follows the Endboss to show its remaining health.
 * @extends StatusBar
 */
class BossBar extends StatusBar {
    constructor() {
        super('assets/img/06_status_bar/health_status_endboss.png', 0, 0, 150, 20, 18, 100);
    }

    /**
     * Positions the bar relative to the boss's current world coordinates.
     * @param {MoveableObject} boss - The boss entity to track.
     */
    updatePosition(boss) {
        this.x = boss.x + (boss.width / 2) - (this.width / 2);
        this.y = boss.y + 30;
    }
}

/**
 * Static icon displayed next to status bars for visual identification.
 * @extends DrawableObject
 */
class StatusIcon extends DrawableObject {
    /**
     * @param {string} path - Path to the icon image.
     * @param {number} x - Horizontal screen position.
     * @param {number} y - Vertical screen position.
     * @param {number} width - Display width.
     * @param {number} height - Display height.
     */
    constructor(path, x, y, width, height) {
        super();
        this.loadImage(path);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

/** Icon for the health bar. @extends StatusIcon */
class HealthIcon extends StatusIcon {
    constructor() { super('assets/img/06_status_bar/health_icon.png', 19, 20, 40, 40); }
}

/** Icon for the plasma bar. @extends StatusIcon */
class PlasmaIcon extends StatusIcon {
    constructor() { super('assets/img/06_status_bar/plasma_icon.png', 22, 57, 40, 40); }
}

/** Icon for the ammunition bar. @extends StatusIcon */
class AmmoIcon extends StatusIcon {
    constructor() { super('assets/img/06_status_bar/gun_icon.png', 12, 97, 50, 25); }
}