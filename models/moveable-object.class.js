class MoveableObject extends DrawableObject {

    speed = 0.15;
    speedY = 0;
    acceleration = 1;
    energy = 100;
    lastHit = 0;
    animations = {};
    currentAnimation = null;
    frameCounter = 0;
    frameSpeed = 11;
    isMirrored = false;
    offset = { top: 0, bottom: 0, left: 0, right: 0 };
    footOffset = 0;
    damage = 10;

    draw(ctx) {
        if (!this.img || !this.img.complete) return;
        this.flipImage(ctx);
        this.drawImage(ctx);
        this.drawHitbox(ctx);
        this.flipImageBack(ctx);
    }

    animate() {
        this.frameCounter++;

        if (this.frameCounter > this.frameSpeed) {
            this.frameCounter = 0;

            let isDeathEnd = this.currentAnimation === 'death' && this.currentFrame >= this.frameCount - 1;

            if (isDeathEnd) {
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

    hit() {
        if (this.isHurt()) return;

        this.energy -= this.damage;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    isHurt() {
        let timepassed = (new Date().getTime() - this.lastHit) / 1000;
        return timepassed < 0.8;
    }

    isDead() {
        return this.energy == 0;
    }
}


