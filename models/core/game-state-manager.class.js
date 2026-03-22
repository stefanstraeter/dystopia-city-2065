/**
 * Manages the high-level state of the game, including intro progression,
 * game over logic, and UI toggles.
 */
class GameStateManager {

    /**
     * @param {Object} world - Reference to the main game world instance.
     */
    constructor(world) {
        this.world = world;
        this.introStage = 0;
        this.gameStarted = false;
        this.showMission = false;
        this.showControls = false;
        this.wasPressedLastFrame = false;
    }

    /**
     * Monitors input to advance the intro, start the game, or restart after game over.
     */
    checkStartKey() {
        const isGameOver = (this.world.character && this.world.character.energy <= 0) || this.world.bossIsDead();
        const isPressedNow = this.world.keyboard.KEY_ENTER || this.world.keyboard.LEFT_CLICK;

        if (isGameOver && isPressedNow) {
            this.world.keyboard.KEY_ENTER = false;
            this.world.keyboard.LEFT_CLICK = false;
            location.reload();
            return;
        }

        if (!this.gameStarted) {
            if (isPressedNow && !this.wasPressedLastFrame) {
                this.handleIntroProgression();
            }
            this.wasPressedLastFrame = isPressedNow;
        }
    }

    /**
     * Advances the game through intro stages and triggers the game start.
     */
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
            if (typeof MobileControls !== 'undefined') {
                MobileControls.showButtonsOnGameStart();
            }
            if (this.world.audioManager) {
                this.world.audioManager.play('background');
            }
        }
    }

    /**
     * Handles toggling of Mission and Control overlays based on keyboard input.
     */
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

    /**
     * Checks for win/loss conditions and triggers the corresponding end screens.
     */
    update() {
        const isDead = this.world.character && this.world.character.isDeadAnimationFinished();
        const isWin = this.world.bossIsDead();

        if (isDead || isWin) {
            const type = isWin ? 'WIN' : 'LOSE';
            this.world.uiManager.drawEndScreen(type);
            this.hideMobileControls();
            this.checkStartKey();
        }
    }

    /**
     * Removes mobile control overlays from the DOM on mobile devices.
     */
    hideMobileControls() {
        if (/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            document.querySelector('.mobile-controls-overlay')?.classList.remove('show-mobile-controls');
            document.querySelector('.system-btns')?.classList.remove('show-system-buttons');
        }
    }
}