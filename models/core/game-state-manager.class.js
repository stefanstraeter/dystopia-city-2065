class GameStateManager {

    constructor(world) {
        this.world = world;
        this.introStage = 0;
        this.gameStarted = false;
        this.showMission = false;
        this.showControls = false;
    }

    checkStartKey() {
        const isGameOver = (this.world.character && this.world.character.energy <= 0) || this.world.bossIsDead();
        if (isGameOver && (this.world.keyboard.KEY_ENTER || this.world.keyboard.LEFT_CLICK)) {
            location.reload();
            return;
        }
        if (!this.gameStarted) {
            if (this.world.keyboard.KEY_ENTER || this.world.keyboard.LEFT_CLICK) {
                this.handleIntroProgression();
                this.world.keyboard.KEY_ENTER = false;
                this.world.keyboard.LEFT_CLICK = false;
            }
        }
    }

    handleIntroProgression() {
        if (this.world.audioManager) {
            this.world.audioManager.unlockAudio();
        }
        if (this.introStage === 0) {
            this.introStage = 1;
        } else if (this.introStage === 1) {
            this.introStage = 2;
        } else if (this.introStage === 2) {
            this.introStage = 3;
            this.gameStarted = true;
            if (MobileControls) {
                MobileControls.showButtonsOnGameStart();
            }
            if (this.world.audioManager) {
                this.world.audioManager.play('background');
            }
        }
    }

    checkUIToggles() {
        if (this.world.keyboard.KEY_M && !this.world.mKeyPressed) {
            this.showMission = !this.showMission;
            if (this.showMission) this.showControls = false;
            this.world.mKeyPressed = true;
        } else if (!this.world.keyboard.KEY_M) {
            this.world.mKeyPressed = false;
        }
        if (this.world.keyboard.KEY_C && !this.world.cKeyPressed) {
            this.showControls = !this.showControls;
            if (this.showControls) this.showMission = false;
            this.world.cKeyPressed = true;
        } else if (!this.world.keyboard.KEY_C) {
            this.world.cKeyPressed = false;
        }
    }
}