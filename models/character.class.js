class Character extends MoveableObject {

    animations = {
        idle: { path: 'img/02_character_bud/Idle.png', frames: 5, speed: 12 },
        walk: { path: 'img/02_character_bud/Walk.png', frames: 4, speed: 6 },
        attack: { path: 'img/02_character_bud/Attack.png', frames: 6, speed: 6 },
        jump: { path: 'img/02_character_bud/Jump.png', frames: 7, speed: 8 },
        hurt: { path: 'img/02_character_bud/Hurt.png', frames: 2, speed: 4 },
        death: { path: 'img/02_character_bud/Death.png', frames: 7, speed: 2 }
    };
    world;

    constructor(x, width, height, speed) {
        super();
        this.x = x;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.applyGravity();
        this.playAnimation('idle');

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

        if (this.world.keyboard.KEY_RIGHT && this.x < 2500) {
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


}