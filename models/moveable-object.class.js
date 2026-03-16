class MoveableObject {

    x = 140;
    y = 100;
    height = 100;
    width = 100;
    offset = { top: 0, bottom: 0, left: 0, right: 0 };
    speed = 0.15;
    speedY = 0;
    acceleration = 2;
    img;
    animations = {};
    currentAnimation = null;
    currentFrame = 0;
    frameCount = 1;
    frameCounter = 0;
    frameSpeed = 11;
    isMirrored = false;
    world;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    animate() {
        this.frameCounter++;

        if (this.frameCounter > this.frameSpeed) {
            this.frameCounter = 0;
            let isJumpEnd = this.currentAnimation === 'jump' && this.currentFrame >= this.frameCount - 1;
            this.currentFrame = isJumpEnd ? this.currentFrame : (this.currentFrame + 1) % this.frameCount;
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
        this.speedY = 23;
    }

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } else {
                if (this.world) {
                    this.y = this.world.groundLevel - this.height + this.offset.bottom;
                }
                this.speedY = 0;
            }
        }, 1000 / 25);
    }

    isAboveGround() {
        if (!this.world) return false;
        return this.y < (this.world.groundLevel - this.height + this.offset.bottom);
    }

    draw(ctx) {
        if (!this.img || !this.img.complete) return;

        this.flipImage(ctx);
        this.drawImage(ctx);
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
}


