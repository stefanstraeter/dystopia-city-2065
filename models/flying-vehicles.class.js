class FlyingVehicle extends MoveableObject {

    constructor(imagePath, x, y, speed, width, height, direction, world, parallaxFactor = 1) {
        super();
        this.loadImage(imagePath);
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.width = width;
        this.height = height;
        this.direction = direction;
        this.world = world;
        this.parallaxFactor = parallaxFactor;
        this.isMirrored = (this.direction === 1);
    }

    move() {
        this.x += this.speed * this.direction;

        let currentCameraX = (-this.world.camera_x) * this.parallaxFactor;
        let screenWidth = 800;

        if (this.direction === -1 && this.x < currentCameraX - this.width) {
            this.x = currentCameraX + screenWidth + Math.random() * 500;
            this.y = 20 + Math.random() * 200;
        }

        if (this.direction === 1 && this.x > currentCameraX + screenWidth + this.width) {
            this.x = currentCameraX - this.width - Math.random() * 500;
            this.y = 20 + Math.random() * 200;
        }
    }

    updateState() {
        this.move();
        if (this.frameCount > 1) {
            super.animate();
        }
    }
}