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
        hurt: { path: 'assets/img/08_explosions/plasma_explosion.png', frames: 6, speed: 2 }
    };

    constructor(x, width, height, speed) {
        super();
        this.x = x;
        this.spawnX = x;
        this.patrolRange = 150;
        this.patrolDirection = -1;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.footOffset = -50;
        this.offset = { top: 5, bottom: 30, left: 20, right: 20 };
        this.energy = 50;
        this.applyGravity();
        this.playAnimation('walk');
    }

    updateState() {
        if (this.isDead()) {
            this.handleDeath();
            return;
        }
        this.updateBehavior();
        super.animate();
        this.applyGravity();
    }

    handleDeath() {
        this.playAnimation('death');
        super.animate();
        this.y += 0.5;

        if (this.currentFrame >= this.frameCount - 1) {
            this.isFinished = true;
        }
    }

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
        } else if (distance > 2) {
            this.pursueCharacter(diff, distance);
        } else {
            this.playAnimation('idle');
        }
    }

    pursueCharacter(diff, distance) {
        this.speed = (distance < this.AGGRO_RANGE) ? this.CHASE_SPEED : this.NORMAL_SPEED;

        if (diff > 0) {
            this.moveLeft();
        } else {
            this.moveRight();
        }
        this.playAnimation('walk');
    }

    patrol() {
        this.speed = this.NORMAL_SPEED;
        this.playAnimation('walk');

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
    }
}