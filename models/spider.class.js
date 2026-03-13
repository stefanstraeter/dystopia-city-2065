class Spider extends MoveableObject {

    animations = {
        idle: { path: 'img/03_enemies/spider/Idle.png', frames: 4 },
        walk: { path: 'img/03_enemies/spider/Walk.png', frames: 10 },
        attack: { path: 'img/03_enemies/spider/Attack.png', frames: 12 }
    };

    constructor(x = (400 + Math.random() * 500), y = (330 + Math.random() * 50)) {
        super();
        this.x = x;
        this.y = y;
        this.speed = 0.1 + Math.random() * 0.4;
        this.playAnimation('walk');
    }

    updateState() {
        super.animate();
        this.moveLeft();

        if (this.x < -this.width) {
            this.x = 1000 + Math.random() * 1000;
        }
    }
}

