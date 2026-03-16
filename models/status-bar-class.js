class StatusBar extends DrawableObject {

    percentage = 100;

    constructor(path, x, y, width, height) {
        super();
        this.loadImage(path);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.frameCount = 18;
        this.setPercentage(100);
    }

    setPercentage(percentage) {
        this.percentage = percentage;
        let frame = (this.frameCount - 1) - Math.round((this.percentage / 100) * (this.frameCount - 1));
    }

}