class NeonSign extends MoveableObject {

    constructor(path, x, y, width, height, frames, speed) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.frameCount = frames;
        this.frameSpeed = speed;
        this.loadImage(path);
    }

    updateState() {
        this.animate();
    }
}