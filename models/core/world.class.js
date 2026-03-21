class World {
    groundLevel = 490;
    throwableObjects = [];
    mKeyPressed = false;
    cKeyPressed = false;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;

        this.gameState = new GameStateManager(this);
        this.uiManager = new UIManager(this.ctx, this.canvas);
        this.collisionManager = new CollisionManager(this);
        this.levelPopulator = new LevelPopulator(this);
        this.level = level1;
        this.audioManager = new AudioManager();
        this.camera = new Camera();

        this.initLevel();
        this.draw();
        this.run();

    }

    initLevel() {
        this.healthBar = this.level.StatusBar[0];
        this.plasmaBar = this.level.StatusBar[1];
        this.ammoBar = this.level.StatusBar[2];
        this.character = new Character(100, 250, 250, 5);
        this.character.world = this;
        this.character.y = this.groundLevel - this.character.height;
        this.levelPopulator.spawnTraffic(15);
        this.levelPopulator.applyWorldToObjects();
    }

    run() {
        setInterval(() => {
            const characterIsDying = this.character.energy <= 0 && !this.character.isDeadAnimationFinished();
            const gameIsPaused = this.gameState.showMission || this.gameState.showControls;
            const canUpdate = this.gameState.gameStarted && !gameIsPaused && (this.character.energy > 0 || characterIsDying);

            if (canUpdate) {
                this.updateAllObjects();
                this.collisionManager.checkAll();
            }
        }, 1000 / 60);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (!this.gameState.gameStarted) {
            if (this.gameState.introStage === 0) this.uiManager.drawStartScreen();
            else if (this.gameState.introStage === 1) this.uiManager.drawMissionOverlay(true);
            else if (this.gameState.introStage === 2) this.uiManager.drawControlsOverlay(true);
            this.gameState.checkStartKey();
        } else {
            this.updateBossBar();
            this.renderGame();
            this.renderUI();
            this.gameState.update();
        }
        requestAnimationFrame(() => this.draw());
    }

    renderUI() {
        for (let i = 0; i < 3; i++) {
            this.addToMap(this.level.StatusBar[i]);
        }
        this.addObjectsToMap(this.level.statusIcons);

        this.gameState.checkUIToggles();

        if (this.gameState.gameStarted) {
            this.uiManager.drawOverlays(this.gameState.showMission, this.gameState.showControls);
        }
    }

    updateBossBar() {
        let boss = this.level.enemies.find(e => e instanceof Endboss);
        let bossBar = this.level.StatusBar[3];
        if (boss && bossBar) bossBar.updatePosition(boss);
    }

    renderGame() {
        this.drawParallaxLayer(0.2, this.level.backgrounds.back);
        this.drawParallaxLayer(0.3, this.level.vehicles.background);
        this.drawParallaxLayer(0.6, this.level.backgrounds.middle);
        this.ctx.save();
        this.ctx.translate(this.camera.x, 0);
        this.drawWorldEntities();
        this.ctx.restore();
    }

    drawWorldEntities() {
        this.addObjectsToMap(this.level.vehicles.midground);
        this.addObjectsToMap(this.level.backgrounds.foreground);
        this.addObjectsToMap(this.level.collectableItems);
        this.addObjectsToMap(this.level.neonSigns);
        this.character.drawShadow(this.ctx, this.groundLevel);
        this.level.enemies.forEach(enemy => {
            if (!(enemy instanceof SentryDrone) && !(enemy instanceof FlyingVehicle)) {
                enemy.drawShadow(this.ctx, this.groundLevel);
            }
        });
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        if (this.level.StatusBar[3]) this.addToMap(this.level.StatusBar[3]);
    }

    drawParallaxLayer(speed, objects) {
        this.ctx.save();
        this.ctx.translate(this.camera.x * speed, 0);
        this.addObjectsToMap(objects);
        this.ctx.restore();
    }

    updateCamera() {
        this.camera.update(this.character, this.level, this.canvas);
    }

    filterProjectiles() {
        this.throwableObjects = this.throwableObjects.filter(obj =>
            Math.abs(obj.x - this.character.x) < 600 && !obj.hasHit);
    }

    filterEnemies() {
        this.level.enemies = this.level.enemies.filter(enemy =>
            !enemy.isFinished); this.enemies = this.level.enemies;
    }

    bossIsDead() {
        let boss = this.level.enemies.find(enemy =>
            enemy instanceof Endboss); return boss && boss.isDead();
    }

    resetBossBehavior() {
        this.level.enemies.forEach(e => {
            if (e instanceof Endboss) e.isAnimatingOnce = false;

        });
    }

    addToMap(mo) {
        mo.draw(this.ctx);
    }
    addObjectsToMap(objs) {
        objs.forEach(obj =>
            this.addToMap(obj));
    }

    getAllObjects() {
        return [this.character,
        ...this.level.enemies,
        ...this.throwableObjects,
        ...this.level.neonSigns,
        ...this.level.vehicles.background,
        ...this.level.vehicles.midground,
        ...this.level.collectableItems];

    }
    updateAllObjects() {
        this.getAllObjects().forEach(object => {
            if (object) object.updateState();

        });
        this.filterProjectiles();
        this.filterEnemies();
        this.level.collectableItems = this.level.collectableItems.filter(item =>
            !item.isCollected); this.updateCamera();
        if (this.character.isDead()) this.resetBossBehavior();
    }
}