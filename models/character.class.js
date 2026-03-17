class Character extends MoveableObject {

    animations = {
        idle: { path: 'assets/img/02_character_bud/Idle.png', frames: 5, speed: 4 },
        walk: { path: 'assets/img/02_character_bud/Walk.png', frames: 4, speed: 3 },
        attackGun: { path: 'assets/img/02_character_bud/Attack_gun.png', frames: 7, speed: 6 },
        attackRocket: { path: 'assets/img/02_character_bud/Attack_rocket.png', frames: 6, speed: 4 },
        jump: { path: 'assets/img/02_character_bud/Jump.png', frames: 7, speed: 3 },
        hurt: { path: 'assets/img/02_character_bud/Hurt.png', frames: 2, speed: 4 },
        death: { path: 'assets/img/02_character_bud/Death.png', frames: 7, speed: 2 }
    };

    lastShootTime = 0;

    constructor(x, width, height, speed) {
        super();
        this.x = x;
        this.width = width;
        this.height = height;
        this.speed = speed; 6
        this.footOffset = 0;
        this.offset = { top: 40, bottom: 80, left: 100, right: 100 };
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
        if (this.world.keyboard.KEY_UP && !this.isAboveGround()) {
            this.jump();
        }
        if (this.world.keyboard.KEY_SPACE) {
            this.shoot();
        }

    }

    updateAnimation() {
        if (!this.world || !this.world.keyboard) return;

        if (this.isDead()) {
            this.playAnimation('death');
        } else if (this.isHurt()) {
            this.playAnimation('hurt');
        } else if (this.world.keyboard.KEY_SPACE) {
            this.playAnimation('attackGun');
        } else if (this.world.keyboard.KEY_X) {
            this.playAnimation('attackRocket');
        } else if (this.isAboveGround()) {
            this.playAnimation('jump');
        } else if (this.world.keyboard.KEY_RIGHT || this.world.keyboard.KEY_LEFT) {
            this.playAnimation('walk');
        } else {
            this.playAnimation('idle');
        }
    }

    shoot() {
        let currentTime = new Date().getTime();
        if (currentTime - this.lastShootTime > 400) {
            this.playAnimation('attackGun');
            let plasmaX;
            let plasmaY = this.y + 80;

            if (this.isMirrored) {
                plasmaX = this.x + 20;
            } else {
                plasmaX = this.x + 140;
            }

            let newPlasma = new Plasma(plasmaX, plasmaY, this.isMirrored);
            this.world.throwableObjects.push(newPlasma);
            this.lastShootTime = currentTime;
        }
    }

}