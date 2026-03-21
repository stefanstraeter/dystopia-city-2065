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


    decideNextAction() {
        const characterIsAlive = !this.world.character.isDead();
        const distanceToCharacter = Math.abs(this.x - this.world.character.x);

        if (characterIsAlive && distanceToCharacter < 500) {
            this.checkAttack();
        } else {
            this.performPatrol();
        }
    }

    handleDeath() {
        this.playAnimation('death');
        super.animate();
    }

    performPatrol() {
        this.patrol();
        this.playAnimation('idle');
    }

    patrol() {
        if (this.walkingRight) {
            this.moveRight();
            if (this.x > this.startX + this.distance) this.walkingRight = false;
        } else {
            this.moveLeft();
            if (this.x < this.startX - this.distance) this.walkingRight = true;
        }
    }

    checkAttack() {
        let now = new Date().getTime();
        if (now - this.lastAttack > this.attackCooldown) {
            this.attack();
        } else {
            this.playAnimation('idle');
        }
    }

    attack() {
        this.lastAttack = new Date().getTime();
        this.playAnimation('attack');

        setTimeout(() => {
            if (!this.isDead()) {
                this.spawnBomb();
            }
        }, 600);
    }

    spawnBomb() {
        this.world.throwableObjects.push(
            new BossBomb(this.world.character.x, -100, this.world)
        );
    }

    checkAnimationEnd() {
        if (this.currentAnimation === 'attack' && this.currentFrame >= this.frameCount - 1) {
            this.isAnimatingOnce = false;
            this.currentAnimation = null;
        }
    }
}