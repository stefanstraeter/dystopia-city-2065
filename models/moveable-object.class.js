class MoveableObject extends DrawableObject {

    speed = 0.15;
    speedY = 0;
    acceleration = 1;
    energy = 100;
    lastHit = 0;
    animations = {};
    currentAnimation = null;
    isMirrored = false;
    offset = { top: 0, bottom: 0, left: 0, right: 0 };
    footOffset = 0;
    damage = 10;

    draw(ctx) {
        if (!this.visible || !this.img || !this.img.complete) return;
        this.flipImage(ctx);
        this.drawImage(ctx);
        this.drawHitbox(ctx);
        this.flipImageBack(ctx);
    }

    animate() {
        this.frameCounter++;
        if (this.frameCounter > this.frameSpeed) {
            this.frameCounter = 0;
            let isDeathAnim = this.currentAnimation === 'death';
            let isAtLastFrame = this.currentFrame >= this.frameCount - 1;

            if (isDeathAnim && isAtLastFrame) {
                this.currentFrame = this.frameCount - 1;
            } else {
                this.currentFrame = (this.currentFrame + 1) % this.frameCount;
            }
        }
    }

    playAnimation(name) {
        if (this.currentAnimation === name) return;

        let animation = this.animations[name];
        if (!animation) return;

        this.currentAnimation = name;
        this.loadImage(animation.path);
        this.frameCount = animation.frames;
        this.frameSpeed = animation.speed ? animation.speed : 10;
        this.currentFrame = 0;
        this.frameCounter = 0;
    }

    applyGravity() {
        if (this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
        } else {
            if (this.world) {
                this.y = this.world.groundLevel - this.height + this.footOffset;
            }
            this.speedY = 0;
        }
    }

    isAboveGround() {
        if (!this.world) return false;
        return this.y < (this.world.groundLevel - this.height + this.footOffset);
    }

    moveLeft() {
        this.x -= this.speed;
        this.isMirrored = true;
    }

    moveRight() {
        this.x += this.speed;
        this.isMirrored = false;
    }

    jump() {
        this.speedY = 21;
    }

    flipImage(ctx) {
        if (this.isMirrored) {
            ctx.save();
            ctx.translate(this.width, 0);
            ctx.scale(-1, 1);
            this.x = this.x * -1;
        }
    }

    flipImageBack(ctx) {
        if (this.isMirrored) {
            this.x = this.x * -1;
            ctx.restore();
        }
    }

    isColliding(mo) {
        return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
            this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
            this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
            this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
    }

    hit(damageReceived, damageType = 'default') {
        if (this.isInvulnerable(damageType)) return;
        this.energy -= damageReceived ?? this.damage;
        let now = new Date().getTime();
        this.setLastHit(damageType);
        this.lastHit = now;
        if (this.energy < 0) this.energy = 0;
    }

    setLastHit(damageType) {
        if (!this.lastHits) this.lastHits = {};
        this.lastHits[damageType] = new Date().getTime();
    }

    isInvulnerable(damageType) {
        if (!this.lastHits) return false;
        let lastHitTime = this.lastHits[damageType];
        if (!lastHitTime) return false;
        let timePassed = (new Date().getTime() - lastHitTime) / 1000;
        if (damageType === 'melee') {
            return timePassed < 0.8;
        }
        if (damageType === 'plasma') {
            return timePassed < 0.05;
        }
        if (damageType === 'rocket') {
            return timePassed < 0.2; // optional
        }
        return false;
    }

    isHurt() {
        let timepassed = (new Date().getTime() - this.lastHit) / 1000;
        return timepassed < 0.2;
    }


    isDead() {
        return this.energy == 0;
    }
}


