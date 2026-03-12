class Character extends MoveableObject {

    x = 40;
    y = 200;
    height = 235;
    width = 235;

    animations = {
        idle: {
            path: 'img/02_character_bud/Idle.png',
            frames: 4
        },
        walk: {
            path: 'img/02_character_bud/Walk.png',
            frames: 6
        },
        attack: {
            path: 'img/02_character_bud/Attack.png',
            frames: 6
        }
    };

    currentAnimation = 'null';

    constructor() {
        super();
        this.setAnimation('idle');
    }

    setAnimation(name) {

        if (this.currentAnimation === name) return;

        this.currentAnimation = name;

        this.loadImage(this.animations[name].path);
        this.frameCount = this.animations[name].frames;
        this.currentFrame = 0;
    }
}







/*
if (this.keyboard.RIGHT) {
    this.character.setAnimation('walk');
}

if (this.keyboard.SPACE) {
    this.character.setAnimation('attack');
}

*/