class ThrowableObject extends MoveableObject {

    static BLUEPRINTS = {
        MELEE: { damage: 10, cooldown: 0.8, type: 'melee' },
        PLAYER_PLASMA: { damage: 10, speed: 15, cooldown: 0.05, type: 'plasma', img: '02_character_bud/Plasma.png', width: 120, height: 40, frames: 4, isEnemy: false },
        ENEMY_PLASMA: { damage: 10, speed: 8, cooldown: 0.7, type: 'plasma', img: '03_enemies/drone/Plasma.png', width: 60, height: 20, frames: 4, isEnemy: true },
        BOMB: { damage: 50, speed: 0, cooldown: 2.0, type: 'bomb', img: '03_enemies/endboss/Bomb.png', width: 150, height: 150, frames: 1, isEnemy: true },

    };

    hasHit = false;

    constructor(x, y, isMirrored, plan) {
        super();
        this.x = x;
        this.y = y;
        this.isMirrored = isMirrored;

        if (plan) {
            this.loadImage(`assets/img/${plan.img}`);
            this.damage = plan.damage;
            this.damageType = plan.type;
            this.speed = plan.speed;
            this.width = plan.width;
            this.height = plan.height;
            this.frameCount = plan.frames;
            this.isEnemy = plan.isEnemy;
            this.frameSpeed = 5;
        }
    }

    updateState() {
        this.animate();
        this.move();
    }

    move() {
        this.x += this.isMirrored ? -this.speed : this.speed;
    }
}

class PlayerPlasma extends ThrowableObject {
    constructor(x, y, isMirrored) {
        super(x, y, isMirrored, ThrowableObject.BLUEPRINTS.PLAYER_PLASMA);
    }
}

class EnemyPlasma extends ThrowableObject {
    constructor(x, y, isMirrored) {
        super(x, y, isMirrored, ThrowableObject.BLUEPRINTS.ENEMY_PLASMA);
    }
}

class Rocket extends ThrowableObject {
    constructor(x, y, isMirrored) {
        super(x, y, isMirrored, ThrowableObject.BLUEPRINTS.ROCKET);
    }
}

class BossBomb extends ThrowableObject {
    constructor(x, y, world) {
        super(x, y, false, ThrowableObject.BLUEPRINTS.BOMB);
        this.world = world;
        this.speedY = -5;
        this.acceleration = 1.5;
        this.hasExploded = false;
        this.offset = { top: 10, bottom: 10, left: 10, right: 10 };
        this.animations = {
            explosion: { path: 'assets/img/08_explosions/rocket_explosion.png', frames: 8, speed: 4 }
        };
    }

    updateState() {
        if (this.hasExploded) {
            this.animate();
            return;
        }
        this.applyGravity();
        if (this.y >= this.world.groundLevel - this.height) {
            this.y = this.world.groundLevel - this.height;
            this.explode();
        }
    }

    explode() {
        if (this.hasExploded) return;
        this.hasExploded = true;
        this.speedY = 0;
        this.acceleration = 0;

        let oldW = this.width;
        this.width = 250;
        this.height = 250;
        this.x -= (this.width - oldW) / 2;
        this.y = this.world.groundLevel - this.height + 20;

        if (this.world && typeof this.world.triggerCameraShake === 'function') {
            this.world.triggerCameraShake();
        }

        this.playAnimation('explosion');
        setTimeout(() => this.hasHit = true, 500);
    }
}