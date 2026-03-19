class SentryDrone extends MoveableObject {
    AGGRO_RANGE = 400;
    FIRE_RANGE = 250;
    SPEED = 1;

    animations = {
        idle: { path: 'assets/img/03_enemies/drone/Idle.png', frames: 4, speed: 6 },
        forward: { path: 'assets/img/03_enemies/drone/Forward.png', frames: 4, speed: 4 },
        fire: { path: 'assets/img/03_enemies/drone/Fire.png', frames: 16, speed: 5 },
        death: { path: 'assets/img/03_enemies/drone/Death.png', frames: 8, speed: 6 },
        hurt: { path: 'assets/img/09_explosions/plasma_explosion.png', frames: 6, speed: 2 }
    };

    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.width = 80;
        this.height = 80;
        this.energy = 20;
        this.speed = 2;
        this.offset = { top: 10, bottom: 10, left: 10, right: 10 };
        this.speedY = 0;
        this.acceleration = 0;
        this.lastShootTime = 0;
        this.shootCooldown = 2000;
        this.playAnimation('idle');
    }

    updateState() {
        if (this.isDead()) {
            this.handleDeath();
            return;
        }
        this.updateBehavior();
        this.floatEffect();
        super.animate();
    }

    floatEffect() {
        this.y += Math.sin(Date.now() / 500) * 0.5;
    }

    updateBehavior() {
        if (!this.world || !this.world.character) return;

        let diffX = this.x - this.world.character.x;
        let distance = Math.abs(diffX);

        if (distance < this.FIRE_RANGE) {
            this.playAnimation('fire');
            this.executeShooting(diffX); // Hier wird geschossen
        } else if (distance < this.AGGRO_RANGE) {
            this.pursueCharacter(diffX);
        } else {
            this.playAnimation('idle');
        }
    }

    executeShooting(diffX) {
        let currentTime = Date.now();

        // Check 1: Ist der Cooldown abgelaufen?
        if (currentTime - this.lastShootTime > this.shootCooldown) {

            // Check 2: Wir schießen erst, wenn die Animation ein paar Frames gelaufen ist (Realismus!)
            if (this.currentFrame === 2) {
                // Richtung bestimmen: Wenn diffX > 0, ist Bud links von der Drohne
                let shootMirrored = diffX > 0;
                this.isMirrored = shootMirrored;

                // Projektil erstellen
                let projectileX = shootMirrored ? this.x : this.x + this.width;
                let projectileY = this.y + 40; // Höhe anpassen, damit es aus der Mitte kommt

                let shot = new EnemyPlasma(projectileX, projectileY, shootMirrored);
                this.world.throwableObjects.push(shot);

                this.lastShootTime = currentTime;
            }
        }
    }

    pursueCharacter(diffX) {
        this.playAnimation('forward');
        if (diffX > 0) {
            this.moveLeft();
        } else {
            this.moveRight();
        }
    }

    handleDeath() {
        this.playAnimation('death');
        this.y += 3; // Sinkt langsam zu Boden beim Absturz
        if (this.currentFrame >= this.frameCount - 1) {
            this.isFinished = true;
        }
    }
}