class Spider extends MoveableObject {

    animations = {
        idle: { path: 'img/03_enemies/spider/Idle.png', frames: 4, speed: 6 },
        walk: { path: 'img/03_enemies/spider/Walk.png', frames: 12, speed: 2 },
        attack: { path: 'img/03_enemies/spider/Attack.png', frames: 12, speed: 6 }
    };

    constructor(x, width, height, speed) {
        super();
        this.x = x;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.footOffset = -30;
        this.offset = { top: 5, bottom: 30, left: 20, right: 20 };
        this.applyGravity();
        this.playAnimation('walk');
    }


    updateState() {
        super.animate();
        this.moveLeft();
        this.applyGravity();
    }
}

