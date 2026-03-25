import { DrawableObject } from './drawable-object.class.js';


/**
 * Extension of DrawableObject that adds movement, gravity, collision detection, and combat logic.
 * @extends DrawableObject
 */
export class MoveableObject extends DrawableObject {

    speed = 0.15;
    speedY = 0;
    acceleration = 1;
    energy = 100;
    lastHit = 0;
    lastHits = {};
    animations = {};
    currentAnimation = null;
    isMirrored = false;
    offset = { top: 0, bottom: 0, left: 0, right: 0 };
    footOffset = 0;
    damage = 10;
    isAnimatingOnce = false;

    /**
     * Renders the object while handling horizontal flipping (mirroring).
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        if (!this.visible || !this.img || !this.img.complete) return;
        this.flipImage(ctx);
        this.drawImage(ctx);
        this.flipImageBack(ctx);
    }

    /**
     * Handles advanced animation logic, including one-time animations and death states.
     */
    animate() {
        this.frameCounter++;
        if (this.frameCounter <= this.frameSpeed) return;

        this.frameCounter = 0;
        const isLastFrame = this.currentFrame >= this.frameCount - 1;

        if (this.currentAnimation === 'death' && isLastFrame) {
            this.currentFrame = this.frameCount - 1;
        } else if (this.isAnimatingOnce && isLastFrame) {
            this.isAnimatingOnce = false;
            this.currentFrame = 0;
        } else {
            this.currentFrame = (this.currentFrame + 1) % this.frameCount;
        }
    }

    /**
     * Switches to a specific animation by name and updates frame properties.
     * @param {string} name - The key of the animation to play.
     */
    playAnimation(name) {
        if (this.currentAnimation === 'death') return;
        if (this.isAnimatingOnce && name !== 'death') return;
        if (this.currentAnimation === name) return;

        let animation = this.animations[name];
        if (!animation) return;

        const oneTimeAnimations = ['hurt', 'hit', 'attack', 'attackGun', 'attackRocket'];
        if (oneTimeAnimations.includes(name)) {
            this.isAnimatingOnce = true;
        }

        this.currentAnimation = name;
        this.loadImage(animation.path);
        this.frameCount = animation.frames;
        this.frameSpeed = animation.speed || 10;
        this.currentFrame = 0;
        this.frameCounter = 0;
    }

    /**
     * Applies downward acceleration to the object if it is above the ground.
     */
    applyGravity() {
        if (this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
        } else {
            this.speedY = 0;
            if (this.world) {
                this.y = this.world.groundLevel - this.height + this.footOffset;
            }
        }
    }

    /**
     * Checks if the object is currently in the air.
     * @returns {boolean} True if above ground level.
     */
    isAboveGround() {
        if (this.constructor.name === 'ThrowableObject' ||
            this.constructor.name === 'PlayerPlasma' ||
            this.constructor.name === 'EnemyPlasma' ||
            this.constructor.name === 'BossBomb') {
            return true;
        }
        let ground = this.world ? this.world.groundLevel : 490;
        return this.y < (ground - this.height + this.footOffset);
    }

    /**
     * Moves the object to the left and mirrors the sprite.
     */
    moveLeft() {
        if (this.isDead()) return;
        this.x -= this.speed;
        this.isMirrored = true;
    }

    /**
     * Moves the object to the right and resets mirroring.
     */
    moveRight() {
        if (this.isDead()) return;
        this.x += this.speed;
        this.isMirrored = false;
    }

    /**
     * Initiates a jump by setting upward vertical speed.
     */
    jump() {
        if (this.isDead()) return;
        this.speedY = 21;
    }

    /**
     * Flips the canvas context horizontally if the object is mirrored.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    flipImage(ctx) {
        if (this.isMirrored) {
            ctx.save();
            ctx.translate(this.width, 0);
            ctx.scale(-1, 1);
            this.x = this.x * -1;
        }
    }

    /**
     * Restores the canvas context after a mirrored draw.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    flipImageBack(ctx) {
        if (this.isMirrored) {
            this.x = this.x * -1;
            ctx.restore();
        }
    }

    /**
     * Detects collision with another MoveableObject using offsets (hitboxes).
     * @param {MoveableObject} mo - The object to check collision against.
     * @returns {boolean} True if objects are overlapping.
     */
    isColliding(mo) {
        return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
            this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
            this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
            this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
    }

    /**
     * Reduces object energy, handles invulnerability frames and death state.
     * @param {number} [damageReceived] - Amount of damage (defaults to this.damage).
     * @param {string} [damageType='default'] - Type of damage for invulnerability checks.
     */
    hit(damageReceived, damageType = 'default', isMirroredHit = false) {
        if (this.isInvulnerable(damageType)) return;

        this.energy -= damageReceived ?? this.damage;
        this.setLastHit(damageType);
        this.lastHit = Date.now();

        if (damageType !== 'melee') {
            const force = (damageType === 'plasma') ? 20 : 0;
            this.x += isMirroredHit ? -force : force;
        }
        if (this.energy > 0) {
            this.playAnimation('hurt');
            this.retroHitEffect();
        } else {
            this.energy = 0;
            this.playAnimation('death');
        }
    }

    /**
     * Creates a brief flickering effect when taking damage.
     */
    retroHitEffect() {
        this.visible = false;
        setTimeout(() => {
            this.visible = true;
        }, 50);
    }

    /**
     * Updates the timestamp for a specific damage type.
     * @param {string} damageType - The source of the damage.
     */
    setLastHit(damageType) {
        this.lastHits[damageType] = Date.now();
    }

    /**
     * Checks if the object is currently invulnerable to a specific damage type.
     * @param {string} damageType - The type of damage to check.
     * @returns {boolean} True if still in the invulnerability threshold.
     */
    isInvulnerable(damageType) {
        let lastHitTime = this.lastHits[damageType];
        if (!lastHitTime) return false;

        let timePassed = (Date.now() - lastHitTime) / 1000;
        const thresholds = {
            'melee': 1.0,
            'plasma': 0.05,
            'bomb': 1.0,
            'default': 0.2
        };
        return timePassed < (thresholds[damageType] || thresholds.default);
    }

    /**
     * Checks if the object was recently hit.
     * @returns {boolean} True if hit within the last 0.2 seconds.
     */
    isHurt() {
        let timepassed = (Date.now() - this.lastHit) / 1000;
        return timepassed < 0.2;
    }

    /**
     * Checks if the object has no energy left.
     * @returns {boolean} True if energy is 0 or less.
     */
    isDead() {
        return this.energy <= 0;
    }

    /**
     * Renders a dynamic elliptical shadow on the ground based on height.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     * @param {number} groundLevel - The Y-coordinate of the ground.
     */
    drawShadow(ctx, groundLevel) {
        const isCharacter = this.constructor.name === 'Character';
        const shadowYOffset = isCharacter ? 50 : 70;
        const baseWidth = isCharacter ? 90 : (this.width * 0.7);
        const baseHeight = isCharacter ? 10 : 12;
        const opacity = isCharacter ? 0.3 : 0.2;
        const centerX = this.x + this.width / 2;
        const shadowY = groundLevel - shadowYOffset;
        const footPoint = this.y + this.height - (isCharacter ? 80 : Math.abs(this.footOffset));
        const distanceFromGround = Math.max(0, groundLevel - shadowYOffset - footPoint);
        const scale = Math.max(0.3, 1 - (distanceFromGround / 400));

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(centerX, shadowY, (baseWidth / 2) * scale, (baseHeight / 2) * scale, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 0, 0, ${opacity * scale})`;
        ctx.fill();
        ctx.restore();
    }
}