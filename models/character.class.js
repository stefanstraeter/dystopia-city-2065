class Character extends MoveableObject {

    animations = {
        idle: { path: 'img/02_character_bud/Idle.png', frames: 5, speed: 4 },
        walk: { path: 'img/02_character_bud/Walk.png', frames: 4, speed: 3 },
        attack: { path: 'img/02_character_bud/Attack.png', frames: 6, speed: 6 },
        jump: { path: 'img/02_character_bud/Jump.png', frames: 7, speed: 3 },
        hurt: { path: 'img/02_character_bud/Hurt.png', frames: 2, speed: 4 },
        death: { path: 'img/02_character_bud/Death.png', frames: 7, speed: 2 }
    };

    constructor(x, width, height, speed) {
        super();
        this.x = x;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.footOffset = 0;
        this.offset = { top: 40, bottom: 80, left: 80, right: 80 };
        this.energy = 100;
        this.applyGravity();
        this.playAnimation('idle');
    }

    updateState() {
        this.applyGravity();
        super.animate();
        this.handleMovement();
    }

    handleMovement() {
        if (this.isDead()) {
            this.playAnimation('death');
            return;
        }
        this.updatePosition();
        this.updateAnimation();
    }

    updatePosition() {
        if (!this.world || !this.world.keyboard) return;

        if (this.world.keyboard.KEY_RIGHT && this.x < (this.world.level.level_end_x - this.width)) {
            this.moveRight();
        }

        if (this.world.keyboard.KEY_LEFT && this.x > 0) {
            this.moveLeft();
        }

        if (this.world.keyboard.KEY_SPACE && !this.isAboveGround()) {
            this.jump();
        }
    }

    updateAnimation() {
        if (!this.world || !this.world.keyboard) return;

        if (this.isHurt()) {
            this.playAnimation('hurt');
        } else if (this.isAboveGround()) {
            this.playAnimation('jump');
        } else if (this.world.keyboard.KEY_RIGHT || this.world.keyboard.KEY_LEFT) {
            this.playAnimation('walk');
        } else if (this.world.keyboard.KEY_UP) {
            this.playAnimation('attack');
        } else {
            this.playAnimation('idle');
        }
    }


}