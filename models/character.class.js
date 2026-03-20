class Character extends MoveableObject {
    animations = {
        idle: { path: 'assets/img/02_character_bud/Idle.png', frames: 5, speed: 4 },
        walk: { path: 'assets/img/02_character_bud/Walk.png', frames: 4, speed: 3 },
        attack: { path: 'assets/img/02_character_bud/Attack.png', frames: 6, speed: 1 },
        jump: { path: 'assets/img/02_character_bud/Jump.png', frames: 7, speed: 3 },
        hurt: { path: 'assets/img/02_character_bud/Hurt.png', frames: 2, speed: 4 },
        death: { path: 'assets/img/02_character_bud/Death.png', frames: 7, speed: 2 }
    };

    lastShootTime = 0;
    ammo = 100;
    plasma = 0;

    constructor(x, width, height, speed) {
        super();
        this.x = x;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.y = 240;
        this.offset = { top: 40, bottom: 80, left: 100, right: 100 };
        this.playAnimation('idle');
    }

    updateState() {
        this.applyGravity();
        if (this.isDead()) {
            this.playAnimation('death');
        } else {
            this.handleMovement();
            this.rechargeAmmoFromPlasma();
        }
        this.animate();
    }

    handleMovement() {
        if (!this.world || !this.world.keyboard || this.isDead()) return;

        if (this.world.keyboard.KEY_RIGHT && this.x < (this.world.level.level_end_x - this.width)) this.moveRight();
        if (this.world.keyboard.KEY_LEFT && this.x > 0) this.moveLeft();
        if (this.world.keyboard.KEY_UP && !this.isAboveGround()) this.jump();
        if (this.world.keyboard.KEY_SPACE) this.shoot();

        this.updateAnimation();
    }

    updateAnimation() {
        if (this.isHurt()) {
            this.playAnimation('hurt');
        } else if (this.world.keyboard.KEY_SPACE && this.ammo >= 10) {
            this.playAnimation('attack');
        } else if (this.isAboveGround()) {
            this.playAnimation('jump');
        } else if (this.world.keyboard.KEY_RIGHT || this.world.keyboard.KEY_LEFT) {
            this.playAnimation('walk');
        } else {
            this.playAnimation('idle');
        }
    }

    shoot() {
        let currentTime = Date.now();
        if (this.ammo >= 10 && (currentTime - this.lastShootTime > 400)) {
            this.ammo -= 10;
            this.world.ammoBar.setPercentage(this.ammo);

            let plasmaX = this.isMirrored ? this.x + 20 : this.x + 140;
            let plasmaY = this.y + 80;

            this.world.throwableObjects.push(new PlayerPlasma(plasmaX, plasmaY, this.isMirrored));
            this.lastShootTime = currentTime;
        }
    }

    rechargeAmmoFromPlasma() {
        if (this.plasma > 0 && this.ammo < 100) {
            this.plasma = Math.max(0, this.plasma - 0.1);
            this.ammo = Math.min(100, this.ammo + 0.5);

            this.world.plasmaBar.setPercentage(Math.round(this.plasma));
            this.world.ammoBar.setPercentage(Math.round(this.ammo));
        }
    }

    isDeadAnimationFinished() {
        return this.energy <= 0 && this.currentFrame >= this.frameCount - 1;
    }
}