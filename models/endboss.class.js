class Endboss extends MoveableObject {

    animations = {
        idle: { path: 'assets/img/03_enemies/endboss/Idle.png', frames: 6 },
    };

    startX;
    distance = 150;
    damage = 25;
    walkingRight = true;

    constructor(x, width, height, speed) {
        super(x, width, height, speed);
        this.x = x;
        this.startX = x;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.footOffset = -10;
        this.offset = { top: 50, bottom: 50, left: 60, right: 60 };

        this.applyGravity();
        this.playAnimation('idle');
    }

    updateState() {
        super.animate();
        this.applyGravity();
        this.patrol();
    }

    patrol() {
        if (this.walkingRight) {
            this.moveRight();
            if (this.x > this.startX + this.distance) {
                this.walkingRight = false;
            }
        } else {
            this.moveLeft();
            if (this.x < this.startX - this.distance) {
                this.walkingRight = true;
            }
        }
    }
}