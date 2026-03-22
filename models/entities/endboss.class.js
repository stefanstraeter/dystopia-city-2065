/**
 * Represents the final boss enemy with advanced AI behavior including 
 * patrolling, targeted attacks, and gravity-based physics.
 * @extends MoveableObject
 */
class Endboss extends MoveableObject {
    animations = {
        idle: { path: 'assets/img/03_enemies/endboss/Idle.png', frames: 6, speed: 10 },
        attack: { path: 'assets/img/03_enemies/endboss/Attack.png', frames: 6, speed: 8 },
        hurt: { path: 'assets/img/03_enemies/endboss/Hurt.png', frames: 2, speed: 2 },
        death: { path: 'assets/img/03_enemies/endboss/Death.png', frames: 7, speed: 5 },
        bomb: { path: 'assets/img/03_enemies/endboss/Bomb.png', frames: 1, speed: 8 }
    };

    startX;
    distance = 150;
    damage = 25;
    walkingRight = true;
    lastAttack = 0;
    attackCooldown = 3000;

    /**
     * Initializes the Endboss with its starting position and physical dimensions.
     * @param {number} x - The initial horizontal position.
     * @param {number} width - The width of the boss sprite.
     * @param {number} height - The height of the boss sprite.
     * @param {number} speed - The base movement speed.
     */
    constructor(x, width, height, speed) {
        super(x, width, height, speed);
        this.x = x;
        this.startX = x;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.footOffset = -50;
        this.offset = { top: 50, bottom: 50, left: 60, right: 60 };

        this.applyGravity();
        this.playAnimation('idle');
    }

    /**
     * Main update cycle for the boss. Handles death, gravity, 
     * animation states, and AI decision making.
     */
    updateState() {
        if (this.isDead()) {
            return this.handleDeath();
        }

        super.animate();
        this.applyGravity();

        if (this.isAnimatingOnce) {
            this.checkAnimationEnd();
            return;
        }

        this.decideNextAction();
    }

    /**
     * AI logic to choose between attacking the player or performing a patrol routine.
     */
    decideNextAction() {
        const characterIsAlive = !this.world.character.isDead();
        const distanceToCharacter = Math.abs(this.x - this.world.character.x);

        if (characterIsAlive && distanceToCharacter < 500) {
            this.checkAttack();
        } else {
            this.performPatrol();
        }
    }

    /**
     * Triggers the final death animation.
     */
    handleDeath() {
        this.playAnimation('death');
        super.animate();
    }

    /**
     * Executes the patrol movement and ensures the idle animation is active.
     */
    performPatrol() {
        this.patrol();
        this.playAnimation('idle');
    }

    /**
     * Moves the boss back and forth within a specific range from its starting point.
     */
    patrol() {
        if (this.walkingRight) {
            this.moveRight();
            if (this.x > this.startX + this.distance) this.walkingRight = false;
        } else {
            this.moveLeft();
            if (this.x < this.startX - this.distance) this.walkingRight = true;
        }
    }

    /**
     * Checks if the attack cooldown has passed to initiate a new attack sequence.
     */
    checkAttack() {
        let now = new Date().getTime();
        if (now - this.lastAttack > this.attackCooldown) {
            this.attack();
        } else {
            this.playAnimation('idle');
        }
    }

    /**
     * Initiates the attack animation and schedules a bomb spawn.
     */
    attack() {
        this.lastAttack = new Date().getTime();
        this.playAnimation('attack');

        setTimeout(() => {
            if (!this.isDead()) {
                this.spawnBomb();
            }
        }, 600);
    }

    /**
     * Instantiates a new BossBomb targeting the player's current x-coordinate.
     */
    spawnBomb() {
        this.world.throwableObjects.push(
            new BossBomb(this.world.character.x, -100, this.world)
        );
    }

    /**
     * Resets the one-time animation flag once the current sequence is complete.
     */
    checkAnimationEnd() {
        if (this.currentAnimation === 'attack' && this.currentFrame >= this.frameCount - 1) {
            this.isAnimatingOnce = false;
            this.currentAnimation = null;
        }
    }
}