class Spider extends MoveableObject {

    animations = {
        idle: { path: 'img/03_enemies/spider/Idle.png', frames: 4 },
        walk: { path: 'img/03_enemies/spider/Walk.png', frames: 10 },
        attack: { path: 'img/03_enemies/spider/Attack.png', frames: 12 }
    };

    constructor(x, width, height, speed) {
        super();
        this.x = x;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.offset.bottom = -30;

        this.applyGravity();
        this.playAnimation('walk');
    }


    updateState() {
        super.animate();
        this.moveLeft();
    }
}

