class MoveableObject {

    x = 140;
    y = 100;
    img;
    height = 100;
    width = 100;
    speed = 0.15;

    animations = {};
    currentAnimation = null;
    frameCount = 1;
    currentFrame = 0;
    frameSpeed = 11;
    frameCounter = 0;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    playAnimation(name) {
        if (this.currentAnimation === name || !this.animations[name]) return;

        this.currentAnimation = name;
        this.loadImage(this.animations[name].path);
        this.frameCount = this.animations[name].frames;
        this.currentFrame = 0;
    }

    animate() {
        this.frameCounter++;
        if (this.frameCounter > this.frameSpeed) {
            this.frameCounter = 0;
            this.currentFrame = (this.currentFrame + 1) % this.frameCount;
        }
    }

    draw(ctx) {
        if (!this.img || !this.img.complete) return;
        const frameWidth = this.img.width / this.frameCount;
        ctx.drawImage(
            this.img,
            this.currentFrame * frameWidth,
            0,
            frameWidth,
            this.img.height,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }

    moveLeft() {
        this.x -= this.speed;
    }

    moveRight() {
        this.x += this.speed;
    }

    /* NEU: Kollisionsprüfung (Allgemeine Formel)
    isColliding(obj) {
        return this.x + this.width > obj.x &&
            this.y + this.height > obj.y &&
            this.x < obj.x + obj.width &&
            this.y < obj.y + obj.height;
    }
    */
}