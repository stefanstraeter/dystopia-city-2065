/**
 * Represents a spider enemy with a multi-stage AI behavior including 
 * patrolling, pursuing the player at varying speeds, and melee attacks.
 * @extends MoveableObject
 */
class Spider extends MoveableObject {

    AGGRO_RANGE = 200;
    CHASE_SPEED = 2;
    NORMAL_SPEED = 1;
    VIEW_DISTANCE = 450;

    animations = {
        idle: { path: 'assets/img/03_enemies/spider/Idle.png', frames: 4, speed: 6 },
        walk: { path: 'assets/img/03_enemies/spider/Walk.png', frames: 12, speed: 2 },
        attack: { path: 'assets/img/03_enemies/spider/Attack.png', frames: 12, speed: 6 },
        death: { path: 'assets/img/03_enemies/spider/Death.png', frames: 9, speed: 6 },
        hurt: { path: 'assets/img/03_enemies/spider/Hurt.png', frames: 2, speed: 2 },
    };

    /**
     * Initializes the spider with position, dimensions, and patrol settings.
     * @param {number} x - Starting horizontal position.
     * @param {number} width - Width of the spider sprite.
     * @param {number} height - Height of the spider sprite.
     * @param {number} speed - Initial movement speed.
     */
    constructor(x, width, height, speed) {
        super();
        this.x = x;
        this.spawnX = x;
        this.patrolRange = 150;
        this.patrolDirection = -1;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.energy = 50;
        this.footOffset = -40;
        this.offset = { top: 20, bottom: 20, left: 20, right: 20 };
        this.playAnimation('walk');
    }

    /**
     * Updates the spider's physical state (gravity, animation) and triggers AI logic.
     */
    updateState() {
        this.applyGravity();
        this.animate();

        if (this.isDead()) {
            this.handleDeath();
            return;
        }

        this.updateBehavior();
    }

    /**
     * Manages the death sequence, including animation and sinking before removal.
     */
    handleDeath() {
        this.playAnimation('death');
        this.y += 0.2;
        if (this.currentFrame >= this.frameCount - 1) {
            this.isFinished = true;
        }
    }

    /**
     * Determines the current behavior state based on the distance to the player character.
     * Decisions range from patrolling to chasing or attacking.
     */
    updateBehavior() {
        if (!this.world || !this.world.character) return;

        let diff = this.x - this.world.character.x;
        let distance = Math.abs(diff);

        if (distance > this.VIEW_DISTANCE) {
            this.patrol();
            return;
        }

        if (this.isColliding(this.world.character)) {
            this.playAnimation('attack');
        } else if (distance > 5) {
            this.pursueCharacter(diff, distance);
        } else {
            this.playAnimation('idle');
        }
    }

    /**
     * Adjusts speed and moves toward the character.
     * Increases speed if the character is within the aggro range.
     * @param {number} diff - Horizontal difference to the character.
     * @param {number} distance - Absolute distance to the character.
     */
    pursueCharacter(diff, distance) {
        this.speed = (distance < this.AGGRO_RANGE) ? this.CHASE_SPEED : this.NORMAL_SPEED;

        if (diff > 0) {
            this.moveLeft();
        } else {
            this.moveRight();
        }
        this.playAnimation('walk');
    }

    /**
     * Moves the spider back and forth within its defined patrol range relative to spawn.
     */
    patrol() {
        this.speed = this.NORMAL_SPEED;

        if (this.x < this.spawnX - this.patrolRange) {
            this.patrolDirection = 1;
        } else if (this.x > this.spawnX + this.patrolRange) {
            this.patrolDirection = -1;
        }

        if (this.patrolDirection === -1) {
            this.moveLeft();
        } else {
            this.moveRight();
        }
        this.playAnimation('walk');
    }
}