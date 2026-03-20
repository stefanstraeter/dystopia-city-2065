class World {
    canvas; ctx; keyboard;
    camera_x = 0;
    isShaking = false;
    groundLevel = 490;
    character; level; enemies;
    throwableObjects = [];
    gameStarted = false;
    showMission = false;
    showControls = false;
    mKeyPressed = false;
    cKeyPressed = false;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.uiManager = new UIManager(this.ctx, this.canvas);
        this.collisionManager = new CollisionManager(this);
        this.level = level1;
        this.audioManager = new AudioManager();

        this.initLevel();
        this.draw();
        this.run();
    }

    initLevel() {
        this.healthBar = this.level.UIElements[0];
        this.plasmaBar = this.level.UIElements[1];
        this.ammoBar = this.level.UIElements[2];
        this.character = new Character(100, 250, 250, 5);
        this.character.world = this;
        this.character.y = this.groundLevel - this.character.height;
        this.spawnTraffic(15);
        this.applyWorldToObjects();
    }

    applyWorldToObjects() {
        const allObjects = [
            ...this.level.enemies,
            ...this.level.neonSigns,
            ...this.level.collectableItems,
            ...this.level.vehicles.background,
            ...this.level.vehicles.midground
        ];

        allObjects.forEach(obj => {
            obj.world = this;

            const isFlying = obj instanceof FlyingVehicle || obj instanceof SentryDrone;
            const isItem = obj instanceof CollectableObject;

            if (obj instanceof MoveableObject && !isFlying && !isItem) {
                obj.y = this.groundLevel - obj.height;
            }
        });
    }

    run() {
        setInterval(() => {
            const isDying = this.character.energy <= 0 && !this.character.isDeadAnimationFinished();
            const canUpdate = this.gameStarted && !this.showMission && !this.showControls && (this.character.energy > 0 || isDying);
            if (canUpdate) {
                this.updateAllObjects();
                this.collisionManager.checkAll();
            }
        }, 1000 / 60);
    }

    updateAllObjects() {
        const objects = [
            this.character, ...this.level.enemies, ...this.throwableObjects,
            ...this.level.neonSigns, ...this.level.vehicles.background,
            ...this.level.vehicles.midground, ...this.level.collectableItems
        ];
        objects.forEach(obj => obj.updateState());

        this.filterProjectiles();
        this.filterEnemies();
        this.updateCamera();
        if (this.character.isDead()) this.resetBossBehavior();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (!this.gameStarted) {
            this.uiManager.drawStartScreen();
            this.checkStartKey();
        } else {
            this.renderGame();
            this.renderUI();
            this.checkEndStates();
        }
        requestAnimationFrame(() => this.draw());
    }

    renderGame() {
        this.drawParallaxLayer(0.2, this.level.backgrounds.back);
        this.drawParallaxLayer(0.3, this.level.vehicles.background);
        this.drawParallaxLayer(0.6, this.level.backgrounds.middle);
        this.ctx.save();
        this.ctx.translate(this.camera_x, 0);
        this.drawWorldEntities();
        this.ctx.restore();
    }

    drawWorldEntities() {
        this.addObjectsToMap(this.level.vehicles.midground);
        this.addObjectsToMap(this.level.backgrounds.foreground);
        this.addObjectsToMap(this.level.collectableItems);
        this.addObjectsToMap(this.level.neonSigns);
        this.addObjectsToMap(this.level.enemies);
        this.addToMap(this.character);
        this.addObjectsToMap(this.throwableObjects);

    }

    renderUI() {
        this.addObjectsToMap(this.level.UIElements);
        this.addObjectsToMap(this.level.statusIcons);

        this.checkUIToggles();

        if (this.showMission) {
            this.uiManager.drawMissionOverlay();
        } else if (this.showControls) {
            this.uiManager.drawControlsOverlay();
        } else {
            this.uiManager.drawHelpHint();
        }
    }

    checkEndStates() {
        if (this.character.isDeadAnimationFinished()) {
            this.uiManager.drawEndScreen('LOSE');
            this.checkStartKey();
        } else if (this.bossIsDead()) {
            this.uiManager.drawEndScreen('WIN');
            this.checkStartKey();
        }
    }

    checkStartKey() {
        const isGameOver = this.character.energy <= 0 || this.bossIsDead();
        if (isGameOver && this.keyboard.KEY_ENTER) location.reload();
        else if (!this.gameStarted && (this.keyboard.KEY_ENTER || this.keyboard.LEFT_CLICK)) this.gameStarted = true;
    }

    checkUIToggles() {
        if (this.keyboard.KEY_M && !this.mKeyPressed) {
            this.showMission = !this.showMission;
            if (this.showMission) this.showControls = false;
            this.mKeyPressed = true;
        } else if (!this.keyboard.KEY_M) {
            this.mKeyPressed = false;
        }
        if (this.keyboard.KEY_C && !this.cKeyPressed) {
            this.showControls = !this.showControls;
            if (this.showControls) this.showMission = false;
            this.cKeyPressed = true;
        } else if (!this.keyboard.KEY_C) {
            this.cKeyPressed = false;
        }
    }

    drawParallaxLayer(speed, objects) {
        this.ctx.save();
        this.ctx.translate(this.camera_x * speed, 0);
        this.addObjectsToMap(objects);
        this.ctx.restore();
    }

    updateCamera() {
        let target_x = Math.max(-(this.level.level_end_x - this.canvas.width), Math.min(0, -this.character.x + 100));
        let shake = this.isShaking ? (Math.random() - 0.5) * 20 : 0;
        this.camera_x = target_x + shake;
    }

    filterProjectiles() {
        this.throwableObjects = this.throwableObjects.filter(obj =>
            Math.abs(obj.x - this.character.x) < 600 && !obj.hasHit
        );
    }

    filterEnemies() {
        this.level.enemies = this.level.enemies.filter(enemy => !enemy.isFinished);
        this.enemies = this.level.enemies;
    }

    bossIsDead() {
        let boss = this.level.enemies.find(e => e instanceof Endboss);
        return boss && boss.isDead();
    }

    resetBossBehavior() {
        this.level.enemies.forEach(e => { if (e instanceof Endboss) e.isAnimatingOnce = false; });
    }

    addToMap(mo) { mo.draw(this.ctx); }
    addObjectsToMap(objs) { objs.forEach(obj => this.addToMap(obj)); }

    spawnTraffic(count) {
        for (let i = 0; i < count; i++) {
            let x = Math.random() * this.level.level_end_x;
            let y = 20 + Math.random() * 180;
            let speed = 0.5 + Math.random() * 2;
            let direction = Math.random() > 0.5 ? 1 : -1;

            let type = Math.random();
            let v;

            if (type < 0.3) {
                v = new Police(x, y, speed, direction, this, 0.3);
            } else if (type < 0.6) {
                v = new Drone(x, y, speed, direction, this, 0.3);
            } else {
                v = new Truck(x, y, speed, direction, this, 0.3);
            }

            this.level.vehicles.background.push(v);
        }
    }
}
