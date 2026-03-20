class MoveableObject extends DrawableObject {

    speed = 0.15;
    speedY = 0;
    acceleration = 1;
    energy = 100;
    lastHit = 0;
    lastHits = {};
    animations = {};
    currentAnimation = null;
    isMirrored = false;
    offset = { top: 0, bottom: 0, left: 0, right: 0 };
    footOffset = 0;
    damage = 10;
    isAnimatingOnce = false;

    draw(ctx) {
        if (!this.visible || !this.img || !this.img.complete) return;
        this.flipImage(ctx);
        this.drawImage(ctx);
        this.flipImageBack(ctx);
    }

    animate() {
        this.frameCounter++;
        if (this.frameCounter <= this.frameSpeed) return;

        this.frameCounter = 0;
        const isLastFrame = this.currentFrame >= this.frameCount - 1;

        if (this.currentAnimation === 'death' && isLastFrame) {
            this.currentFrame = this.frameCount - 1;
        } else if (this.isAnimatingOnce && isLastFrame) {
            this.isAnimatingOnce = false;
            this.currentFrame = 0;
        } else {
            this.currentFrame = (this.currentFrame + 1) % this.frameCount;
        }
    }

    playAnimation(name) {
        if (this.currentAnimation === 'death') return;
        if (this.isAnimatingOnce && name !== 'death') return;
        if (this.currentAnimation === name) return;

        let animation = this.animations[name];
        if (!animation) return;

        const oneTimeAnimations = ['hurt', 'hit', 'attack', 'attackGun', 'attackRocket'];
        if (oneTimeAnimations.includes(name)) {
            this.isAnimatingOnce = true;
        }

        this.currentAnimation = name;
        this.loadImage(animation.path);
        this.frameCount = animation.frames;
        this.frameSpeed = animation.speed || 10;
        this.currentFrame = 0;
        this.frameCounter = 0;
    }

    applyGravity() {
        if (this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
        } else {
            this.speedY = 0;
            if (this.world) {
                this.y = this.world.groundLevel - this.height + this.footOffset;
            }
        }
    }

    isAboveGround() {
        if (this instanceof ThrowableObject) return true;
        let ground = this.world ? this.world.groundLevel : 490;
        return this.y < (ground - this.height + this.footOffset);
    }

    moveLeft() {
        if (this.isDead()) return;
        this.x -= this.speed;
        this.isMirrored = true;
    }

    moveRight() {
        if (this.isDead()) return;
        this.x += this.speed;
        this.isMirrored = false;
    }

    jump() {
        if (this.isDead()) return;
        this.speedY = 21;
    }

    flipImage(ctx) {
        if (this.isMirrored) {
            ctx.save();
            ctx.translate(this.width, 0);
            ctx.scale(-1, 1);
            this.x = this.x * -1;
        }
    }

    flipImageBack(ctx) {
        if (this.isMirrored) {
            this.x = this.x * -1;
            ctx.restore();
        }
    }

    isColliding(mo) {
        return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
            this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
            this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
            this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
    }

    hit(damageReceived, damageType = 'default') {
        if (this.isInvulnerable(damageType)) return;

        this.energy -= damageReceived ?? this.damage;
        this.setLastHit(damageType);
        this.lastHit = Date.now();

        if (this.energy > 0) {
            this.playAnimation('hurt');
            this.retroHitEffect();
        } else {
            this.energy = 0;
            this.playAnimation('death');
        }
    }

    retroHitEffect() {
        this.visible = false;
        setTimeout(() => {
            this.visible = true;
        }, 50);
    }

    setLastHit(damageType) {
        this.lastHits[damageType] = Date.now();
    }

    isInvulnerable(damageType) {
        let lastHitTime = this.lastHits[damageType];
        if (!lastHitTime) return false;

        let timePassed = (Date.now() - lastHitTime) / 1000;
        const thresholds = {
            'melee': 1.0,
            'plasma': 0.05,
            'bomb': 1.0,
            'default': 0.2
        };
        return timePassed < (thresholds[damageType] || thresholds.default);
    }

    isHurt() {
        let timepassed = (Date.now() - this.lastHit) / 1000;
        return timepassed < 0.2;
    }

    isDead() {
        return this.energy <= 0;
    }

    drawShadow(ctx, groundLevel) {
        const isCharacter = this.constructor.name === 'Character';
        const shadowYOffset = isCharacter ? 50 : 70;
        const baseWidth = isCharacter ? 90 : (this.width * 0.7);
        const baseHeight = isCharacter ? 10 : 12;
        const opacity = isCharacter ? 0.3 : 0.2;
        const centerX = this.x + this.width / 2;
        const shadowY = groundLevel - shadowYOffset;
        const footPoint = this.y + this.height - (isCharacter ? 80 : Math.abs(this.footOffset));
        const distanceFromGround = Math.max(0, groundLevel - shadowYOffset - footPoint);
        const scale = Math.max(0.3, 1 - (distanceFromGround / 400));

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(centerX, shadowY, (baseWidth / 2) * scale, (baseHeight / 2) * scale, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 0, 0, ${opacity * scale})`;
        ctx.fill();
        ctx.restore();
    }
}


