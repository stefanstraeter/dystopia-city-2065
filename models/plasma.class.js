class Plasma extends ThrowableObject {

    constructor(x, y, isMirrored) {
        super(x, y, isMirrored);
        this.loadImage('assets/img/02_character_bud/Plasma.png');
        this.width = 120;
        this.height = 40;
        this.speed = 15;
        this.frameCount = 4;
        this.frameSpeed = 5;
        this.damage = 20;
    }

    updateState() {
        this.animate();
        this.move();
    }
}