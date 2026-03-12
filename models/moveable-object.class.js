class MoveableObject {

    x = 140;
    y = 100;
    img;
    height = 100;
    width = 100;

    frameCount = 1;
    currentFrame = 0;
    frameSpeed = 11;
    frameCounter = 0;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    updateAnimation() {
        this.frameCounter++;
        if (this.frameCounter > this.frameSpeed) {
            this.frameCounter = 0;
            this.currentFrame = (this.currentFrame + 1) % this.frameCount;
        }
    }

    draw(ctx) {
        if (!this.img.width) return;
        if (!this.img.width) return;

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

    moveRight() {

    }

    moveLeft() {

    }
}