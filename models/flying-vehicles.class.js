class FlyingVehicle extends MoveableObject {

    constructor(imagePath, x = 800, y = 50, speed = 0.5, width = 60, height = 25) {
        super();
        this.loadImage(imagePath);
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.width = width;
        this.height = height;
    }

    move() {
        this.x -= this.speed;
        if (this.x < -this.width) {
            this.x = 900;
        }
    }

    updateState() {
        this.move();
        super.animate();
    }
}