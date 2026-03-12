class Spider extends MoveableObject {

    y = 350;
    height = 100;
    width = 100;
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
            path: 'img/03_enemies/spider/Attack.png',
            frames: 12
        }
    };
    currentAnimation = 'null';


    constructor() {
        super();
        this.setAnimation('attack');
        this.x = 200 + Math.random() * 500;
    }

    setAnimation(name) {
        if (this.currentAnimation === name) return;

        this.currentAnimation = name;
        this.loadImage(this.animations[name].path);
        this.frameCount = this.animations[name].frames;
        this.currentFrame = 0;
    }

}



