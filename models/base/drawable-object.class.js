/**
 * Base class for all objects that can be drawn on the canvas.
 * Handles positioning, image loading, and frame-based animation.
 */
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

    /**
     * Loads an image from the cache or a URL.
     * @param {string} path - The file path to the image.
     */
    loadImage(path) {
        if (window.IMAGE_CACHE && window.IMAGE_CACHE[path]) {
            this.img = window.IMAGE_CACHE[path];
        } else {
            const tempImg = new Image();
            tempImg.src = path;
            tempImg.onload = async () => {
                try {
                    await tempImg.decode();
                } catch (e) { }

                if (window.IMAGE_CACHE) {
                    window.IMAGE_CACHE[path] = tempImg;
                }
                this.img = tempImg;
            };
        }
    }

    /**
     * Updates the animation frame based on the defined frame speed.
     */
    animate() {
        this.frameCounter++;
        if (this.frameCounter > this.frameSpeed) {
            this.frameCounter = 0;
            this.currentFrame = (this.currentFrame + 1) % this.frameCount;
        }
    }

    /**
     * Validates if the object can be drawn and initiates the drawing process.
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
     */
    draw(ctx) {
        if (!this.visible || !this.img || !this.img.naturalWidth) return;
        this.drawImage(ctx);
    }

    /**
     * Performs the actual drawing of the image (or current frame) on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
     */
    drawImage(ctx) {
        if (!this.img.width) return;

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