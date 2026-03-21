class StatusBar extends DrawableObject {
    percentage = 100;

    constructor(path, x, y, width, height, frameCount, startPercentage = 100) {
        super();
        this.loadImage(path);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.frameCount = frameCount;
        this.setPercentage(startPercentage);
    }

    setPercentage(percentage) {
        this.percentage = percentage;
        let frame = (this.frameCount - 1) - Math.round((this.percentage / 100) * (this.frameCount - 1));
        this.currentFrame = Math.max(0, Math.min(frame, this.frameCount - 1));
    }

    draw(ctx) {
        if (this.img && this.img.complete) {
            let spriteWidth = this.img.width / this.frameCount;
            let sourceX = this.currentFrame * spriteWidth;

            ctx.drawImage(
                this.img,
                sourceX, 0,
                spriteWidth, this.img.height,
                this.x, this.y,
                this.width, this.height
            );
        }
    }
}

class HealthBar extends StatusBar {
    constructor() {
        super('assets/img/06_status_bar/health_status.png', 30, 30, 190, 30, 18, 100);
    }
}

class PlasmaBar extends StatusBar {
    constructor() {
        super('assets/img/06_status_bar/plasma_status.png', 30, 60, 190, 30, 18, 0);
    }
}

class AmmoBar extends StatusBar {
    constructor() {
        super('assets/img/06_status_bar/gun_status.png', 30, 90, 190, 30, 18, 0);
    }
}

class BossBar extends StatusBar {
    constructor() {
        super('assets/img/06_status_bar/health_status_endboss.png', 0, 0, 150, 20, 18, 100);
    }
    updatePosition(boss) {
        this.x = boss.x + (boss.width / 2) - (this.width / 2);
        this.y = boss.y + 30;
    }
}

class StatusIcon extends DrawableObject {
    constructor(path, x, y, width, height) {
        super();
        this.loadImage(path);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

class HealthIcon extends StatusIcon {
    constructor() { super('assets/img/06_status_bar/health_icon.png', 19, 20, 40, 40); }
}

class PlasmaIcon extends StatusIcon {
    constructor() { super('assets/img/06_status_bar/plasma_icon.png', 22, 57, 40, 40); }
}

class AmmoIcon extends StatusIcon {
    constructor() { super('assets/img/06_status_bar/gun_icon.png', 12, 97, 50, 25); }
}