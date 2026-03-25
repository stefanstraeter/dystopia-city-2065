import { MoveableObject } from '../base/moveable-object.class.js';

/**
 * Base class for all projectiles and throwable objects. 
 * Uses static blueprints to define shared properties like damage, speed, and visuals.
 * @extends MoveableObject
 */
export class ThrowableObject extends MoveableObject {

    /** * Central configuration for different types of projectiles.
     * @static 
     */
    static BLUEPRINTS = {
        MELEE: { damage: 10, cooldown: 0.8, type: 'melee' },
        PLAYER_PLASMA: { damage: 10, speed: 15, cooldown: 0.05, type: 'plasma', img: '02_character_bud/Plasma.png', width: 120, height: 40, frames: 4, isEnemy: false },
        ENEMY_PLASMA: { damage: 10, speed: 8, cooldown: 0.7, type: 'plasma', img: '03_enemies/sentry_drone/Plasma.png', width: 60, height: 20, frames: 3, isEnemy: true },
        BOMB: { damage: 40, speed: 0, cooldown: 2.0, type: 'bomb', img: '03_enemies/endboss/Bomb.png', width: 150, height: 150, frames: 1, isEnemy: true },
    };

    hasHit = false;
    damageApplied = false;

    /**
     * @param {number} x - Horizontal starting position.
     * @param {number} y - Vertical starting position.
     * @param {boolean} isMirrored - Direction of flight (true for left, false for right).
     * @param {Object} plan - A blueprint from ThrowableObject.BLUEPRINTS.
     */
    constructor(x, y, isMirrored, plan) {
        super();
        this.x = x;
        this.y = y;
        this.isMirrored = isMirrored;

        if (plan) {
            this.loadImage(`assets/img/${plan.img}`);
            this.damage = plan.damage;
            this.damageType = plan.type;
            this.speed = plan.speed;
            this.width = plan.width;
            this.height = plan.height;
            this.frameCount = plan.frames;
            this.isEnemy = plan.isEnemy;
            this.frameSpeed = 5;
        }
    }

    /**
     * Updates animation and handles linear movement.
     */
    updateState() {
        this.animate();
        this.move();
    }

    /**
     * Moves the object horizontally based on its speed and direction.
     */
    move() {
        this.x += this.isMirrored ? -this.speed : this.speed;
    }
}

/**
 * Projectile fired by the player character.
 * @extends ThrowableObject
 */
export class PlayerPlasma extends ThrowableObject {
    constructor(x, y, isMirrored) {
        super(x, y, isMirrored, ThrowableObject.BLUEPRINTS.PLAYER_PLASMA);
    }
}

/**
 * Projectile fired by enemy units like the Sentry Drone.
 * @extends ThrowableObject
 */
export class EnemyPlasma extends ThrowableObject {
    constructor(x, y, isMirrored) {
        super(x, y, isMirrored, ThrowableObject.BLUEPRINTS.ENEMY_PLASMA);
    }
}

/**
 * Heavy explosive projectile used by the Endboss. 
 * Features gravity, ground collision, and screen-shake effects on explosion.
 * @extends ThrowableObject
 */
export class BossBomb extends ThrowableObject {
    /**
     * @param {number} x - Target X coordinate.
     * @param {number} y - Vertical spawn height.
     * @param {Object} world - Reference to the game world.
     */
    constructor(x, y, world) {
        super(x, y, false, ThrowableObject.BLUEPRINTS.BOMB);
        this.world = world;
        this.speedY = -5;
        this.acceleration = 1.5;
        this.hasExploded = false;
        this.hasHit = false;
        this.offset = { top: 10, bottom: 10, left: 10, right: 10 };
    }

    /**
     * Handles falling logic until ground contact, then manages explosion sequence.
     */
    updateState() {
        this.animate();

        // Wenn bereits explodiert, markieren wir das Objekt sofort als "Hit",
        // damit es aus dem throwableObjects-Array gelöscht wird.
        if (this.hasExploded) {
            this.hasHit = true;
            return;
        }
        this.applyGravity();
        if (this.y >= this.world.groundLevel - this.height) {
            this.y = this.world.groundLevel - this.height;
            this.explode();
        }
    }

    /**
     * Triggers the explosion logic: stops movement, expands hitboxes for 
     * damage calculation, plays audio, and activates camera shake.
     */
    explode() {
        if (this.hasExploded) return;
        this.hasExploded = true;
        this.speedY = 0;
        this.acceleration = 0;
        this.speed = 0;
        let oldW = this.width;
        this.width = 250;
        this.height = 250;
        this.x -= (this.width - oldW) / 2;
        this.y = this.world.groundLevel - this.height + 20;
        if (this.world && this.world.camera) {
            this.world.camera.activateShake(600, 30);
        }
        this.world.audioManager.play('explosion');
        this.world.spawnEffect(this.x, this.y, this.width, this.height, 'BOMB');
    }
}