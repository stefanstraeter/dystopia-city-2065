class FlyingVehicle extends MoveableObject {

    constructor(imagePath, x = 800, y = 50, speed = 0.5, width = 60, height = 25, direction = -1) {
        super();
        this.loadImage(imagePath);
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.width = width;
        this.height = height;
        this.direction = direction;
    }

    move() {
        this.x += this.speed * this.direction;
        this.isMirrored = this.direction === 1;
        this.handleRespawn();
    }

    handleRespawn() {
        if (this.direction === -1 && this.x < -this.width) {
            this.x = 900;
        }
        if (this.direction === 1 && this.x > 900) {
            this.x = -this.width;
        }
    }

    updateState() {
        this.move();
        if (this.frameCount > 1) {
            super.animate();
        }
    }
} 1