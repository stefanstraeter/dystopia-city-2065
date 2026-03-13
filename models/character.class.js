class Character extends MoveableObject {
    animations = {
        idle: { path: 'img/02_character_bud/Idle.png', frames: 5, speed: 12 },
        walk: { path: 'img/02_character_bud/Walk.png', frames: 4, speed: 6 },
        attack: { path: 'img/02_character_bud/Attack.png', frames: 6, speed: 4 },
        jump: { path: 'img/02_character_bud/Jump.png', frames: 7, speed: 8 }
    };
    world;

    constructor(x = 40, y = 270, width = 200, height = 200, speed = 3) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.playAnimation('idle');
        this.applyGravity();
    }

    updateState() {
        super.animate();
        this.handleMovement();
    }

    jump() {
        this.speedY = 23;
    }

    handleMovement() {
        let isMoving = false;

        if (this.world.keyboard.KEY_RIGHT && this.x < 700) {
            this.moveRight();
            isMoving = true;
        }

        if (this.world.keyboard.KEY_LEFT && this.x > 0) {
            this.moveLeft();
            isMoving = true;
        }

        if (this.world.keyboard.KEY_UP && !this.isAboveGround()) {
            this.jump();
        }

        if (this.isAboveGround()) {
            this.playAnimation('jump');
        } else if (isMoving) {
            this.playAnimation('walk');
        } else {
            this.playAnimation('idle');
        }
    }

    isAboveGround() {
        return this.y < 270;
    }
}