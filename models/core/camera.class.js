class Camera {
    x = 0;
    isShaking = false;
    shakeIntensity = 20;

    constructor() {
    }

    update(character, level, canvas) {
        let target_x = Math.max(-(level.level_end_x - canvas.width), Math.min(0, -character.x + 100));
        let shake = this.isShaking ? (Math.random() - 0.5) * this.shakeIntensity : 0;
        this.x = target_x + shake;
    }

    activateShake(duration = 500, intensity = 20) {
        this.isShaking = true;
        this.shakeIntensity = intensity;
        setTimeout(() => {
            this.isShaking = false;
        }, duration);
    }
}