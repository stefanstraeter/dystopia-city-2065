import { MoveableObject } from '../base/moveable-object.class.js';
import { EnemyPlasma } from './throwable-object.class.js';

/**
 * Represents a flying sentry drone enemy with autonomous AI behavior including 
 * hovering, tracking the player, and firing plasma projectiles.
 * @extends MoveableObject
 */
export class SentryDrone extends MoveableObject {

    AGGRO_RANGE = 400;
    FIRE_RANGE = 450;
    SPEED = 1;

    animations = {
        idle: { path: 'assets/img/03_enemies/sentry_drone/Idle.png', frames: 4, speed: 6 },
        forward: { path: 'assets/img/03_enemies/sentry_drone/Forward.png', frames: 4, speed: 4 },
        fire: { path: 'assets/img/03_enemies/sentry_drone/Fire.png', frames: 16, speed: 5 },
        death: { path: 'assets/img/03_enemies/sentry_drone/Death.png', frames: 9, speed: 6 },
        hurt: { path: 'assets/img/03_enemies/sentry_drone/Hurt.png', frames: 2, speed: 2 }
    };

    /**
     * Initializes the SentryDrone at a specific location.
     * @param {number} x - Starting horizontal position.
     * @param {number} y - Starting vertical position (altitude).
     */
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.width = 80;
        this.height = 80;
        this.energy = 20;
        this.speed = 2;
        this.offset = { top: 10, bottom: 10, left: 10, right: 10 };
        this.speedY = 0;
        this.acceleration = 0;
        this.lastShootTime = 0;
        this.shootCooldown = 1500;
        this.playAnimation('idle');
    }

    /**
     * Main logic loop for the drone. Handles animation, death logic, 
     * AI behavior, and the hovering effect.
     */
    updateState() {
        this.animate();

        if (this.isDead()) {
            this.handleDeath();
            return;
        }

        this.updateBehavior();
        this.floatEffect();
    }

    /**
     * Creates a subtle vertical hovering motion using a sine wave based on current time.
     */
    floatEffect() {
        this.y += Math.sin(Date.now() / 500) * 0.5;
    }

    /**
     * Evaluates the distance to the player and decides whether to 
     * shoot, pursue, or remain idle.
     */
    updateBehavior() {
        if (!this.world || !this.world.character) return;

        let diffX = this.x - this.world.character.x;
        let distance = Math.abs(diffX);

        if (distance < this.FIRE_RANGE) {
            this.playAnimation('fire');
            this.executeShooting(diffX);
        } else if (distance < this.AGGRO_RANGE) {
            this.pursueCharacter(diffX);
        } else {
            this.playAnimation('idle');
        }
    }

    /**
     * Logic for spawning an EnemyPlasma projectile. 
     * Synchronizes the spawn with a specific frame of the 'fire' animation.
     * @param {number} diffX - The horizontal distance to the character to determine firing direction.
     */
    executeShooting(diffX) {
        let currentTime = Date.now();
        if (currentTime - this.lastShootTime > this.shootCooldown) {
            if (this.currentFrame === 2) {
                let shootMirrored = diffX > 0;
                this.isMirrored = shootMirrored;
                let projectileX = shootMirrored ? this.x : this.x + this.width - 20;
                let projectileY = this.y + 40;

                this.world.throwableObjects.push(new EnemyPlasma(projectileX, projectileY, shootMirrored));
                this.lastShootTime = currentTime;
            }
        }
    }

    /**
     * Moves the drone towards the player character's position.
     * @param {number} diffX - Horizontal difference to the player.
     */
    pursueCharacter(diffX) {
        this.playAnimation('forward');
        if (diffX > 0) {
            this.moveLeft();
        } else {
            this.moveRight();
        }
    }

    /**
     * Handles the death sequence, including playing the death animation 
     * and slowly sinking before being removed from the world.
     */
    handleDeath() {
        this.playAnimation('death');
        this.y += 2;
        if (this.currentFrame >= this.frameCount - 1) {
            this.isFinished = true;
        }
    }
}