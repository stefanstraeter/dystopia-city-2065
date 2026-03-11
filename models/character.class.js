class Character extends MoveableObject {

    x = 140;
    y = 200;
    height = 250;
    width = 250;

    constructor() {
        super();
        this.loadImage('img/02_character_bud/Idle.png');
    }
}