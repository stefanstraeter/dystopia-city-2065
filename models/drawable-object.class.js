class DrawableObject {

    x = 140;
    y = 100;
    height = 100;
    width = 100;
    offset = { top: 0, bottom: 0, left: 0, right: 0 };
    img;
    currentFrame = 0;
    frameCount = 1;
    frameCounter = 0;
    frameSpeed = 10;
    visible = true;
    world;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    animate() {
        this.frameCounter++;
        if (this.frameCounter > this.frameSpeed) {
            this.frameCounter = 0;
            this.currentFrame = (this.currentFrame + 1) % this.frameCount;
        }
    }

    draw(ctx) {
        if (!this.visible || !this.img || !this.img.complete) return;
        this.drawImage(ctx);
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
}