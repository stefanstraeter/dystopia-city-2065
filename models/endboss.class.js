class Endboss extends MoveableObject { // Mit d

    animations = {
        idle: { path: 'img/03_enemies/endboss/Idle.png', frames: 6 },
    };

    constructor(x, width, height, speed) {
        super();
        this.x = x;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.offset.bottom = -20;
        this.isMirrored = true;
        this.applyGravity();
        this.playAnimation('idle'); // Kleingeschrieben wie oben in animations!
    }

    updateState() {
        super.animate();
    }
}