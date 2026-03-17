class CollectableObject extends MoveableObject {

    constructor(path, x, y, width, height, frames, speed) {
        super();
        this.loadImage(path);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.frameCount = frames;
        this.frameSpeed = speed;
    }

    updateState() {
        if (this.frameCount > 1) {
            this.animate();
        }
    }
}