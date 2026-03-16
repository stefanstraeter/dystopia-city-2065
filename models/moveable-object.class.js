class MoveableObject {

    x = 140;
    y = 100;
    height = 100;
    width = 100;
    offset = { top: 0, bottom: 0, left: 0, right: 0 };
    footOffset = 0;
    speed = 0.15;
    speedY = 0;
    acceleration = 1;
    energy = 100;
    lastHit = 0;
    img;
    animations = {};
    currentAnimation = null;
    currentFrame = 0;
    frameCount = 1;
    frameCounter = 0;
    frameSpeed = 11;
    isMirrored = false;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    animate() {
        this.frameCounter++;

        if (this.frameCounter > this.frameSpeed) {
            this.frameCounter = 0;

            let isDeathEnd = this.currentAnimation === 'death' && this.currentFrame >= this.frameCount - 1;
            let isJumpEnd = this.currentAnimation === 'jump' && this.currentFrame >= this.frameCount - 1;

            if (isDeathEnd) {
            } else if (isJumpEnd) {
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

    draw(ctx) {
        if (!this.img || !this.img.complete) return;

        this.flipImage(ctx);
        this.drawImage(ctx);
        this.drawHitbox(ctx);
        this.flipImageBack(ctx);
    }

    drawImage(ctx) {
        const frameWidth = this.img.width / this.frameCount;
        ctx.drawImage(
            this.img,
            this.currentFrame * frameWidth, 0,
            frameWidth,
            this.img.height,
            this.x,
            this.y,
            this.width,
            this.height
        );
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

        this.energy -= 10;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    isHurt() {
        let timepassed = (new Date().getTime() - this.lastHit) / 1000;
        return timepassed < 0.5;
    }

    isDead() {
        return this.energy == 0;
    }

    drawHitbox(ctx) {
        if (this instanceof Character || this instanceof Spider || this instanceof Endboss) {
            ctx.beginPath();
            ctx.lineWidth = "2";
            ctx.strokeStyle = "red";
            ctx.rect(
                this.x + this.offset.left,
                this.y + this.offset.top,
                this.width - this.offset.left - this.offset.right,
                this.height - this.offset.top - this.offset.bottom
            );
            ctx.stroke();
        }
    }


}


