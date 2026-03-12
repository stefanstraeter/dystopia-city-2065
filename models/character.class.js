class Character extends MoveableObject {

    currentAnimation = null;
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

    constructor(x = 40, y = 230, w = 200, h = 200) {
        super();
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.playAnimation('idle');
    }

    updateState() {
        super.animate();
        this.handleMovement();
    }

    handleMovement() {
        // Hier kommt bald dein: 
        // if (this.world.keyboard.RIGHT) { this.moveRight(); }
    }
}