class Spider extends MoveableObject {

    AGGRO_RANGE = 200;
    CHASE_SPEED = 2;
    NORMAL_SPEED = 1;

    animations = {
        idle: { path: 'assets/img/03_enemies/spider/Idle.png', frames: 4, speed: 6 },
        walk: { path: 'assets/img/03_enemies/spider/Walk.png', frames: 12, speed: 2 },
        attack: { path: 'assets/img/03_enemies/spider/Attack.png', frames: 12, speed: 6 },
        death: { path: 'assets/img/03_enemies/spider/Death.png', frames: 9, speed: 6 }
    };

    constructor(x, width, height, speed) {
        super();
        this.x = x;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.footOffset = -50;
        this.offset = { top: 5, bottom: 30, left: 40, right: 40 };
        this.energy = 50;
        this.applyGravity();
        this.playAnimation('walk');
    }

    updateState() {
        if (this.isDead()) {
            this.handleDeath();
            return;
        }

        this.handleAI();
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

    handleAI() {
        if (!this.world || !this.world.character) return;

        let distance = Math.abs(this.x - this.world.character.x);

        if (this.isColliding(this.world.character)) {
            this.playAnimation('attack');
        } else {
            this.pursueCharacter(distance);
        }
    }

    pursueCharacter(distance) {
        if (distance < this.AGGRO_RANGE) {
            this.speed = this.CHASE_SPEED;
        } else {
            this.speed = this.NORMAL_SPEED;
        }

        this.moveLeft();
        this.playAnimation('walk');
    }
}