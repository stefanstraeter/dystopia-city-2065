class Plasma extends MoveableObject {

    constructor(x, y, isMirrored) {
        super();
        this.loadImage('img/02_character_bud/Plasma.png');
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 60;
        this.isMirrored = isMirrored;
        this.speed = 15;
        this.frameCount = 4;
        this.frameSpeed = 5;
    }

    updateState() {
        this.animate();

        if (this.isMirrored) {
            this.x -= this.speed;
        } else {
            this.x += this.speed;
        }
    }
} 