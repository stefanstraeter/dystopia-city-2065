class ThrowableObject extends MoveableObject {
    damage = 10;

    constructor(x, y, isMirrored) {
        super();
        this.x = x;
        this.y = y;
        this.isMirrored = isMirrored;
    }

    move() {
        if (this.isMirrored) {
            this.x -= this.speed;
        } else {
            this.x += this.speed;
        }
    }
}