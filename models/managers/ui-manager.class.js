/**
 * Handles the game's User Interface (UI), including menus, overlays, 
 * and post-processing visual effects like scanlines and film grain.
 */
class UIManager {
    /** * Central color palette for the Cyberpunk aesthetic.
     * @static 
     */
    static THEMES = {
        PRIMARY: '#b72299', SECONDARY: '#00ffff', WIN: '#00f2ff', LOSE: '#ff0055', TEXT: '#e3e3e3'
    };

    /** * Static text collections for mission briefings and control instructions.
     * @static 
     */
    static TEXTS = {
        MISSION: [
            'STATUS: OPERATIVE BUD DETECTED',
            'LOCATION: NEON CITY SECTOR 7', '',
            'OBJECTIVE: NEUTRALIZE INFESTATION',
            'CLEAR SPIDERS & SENTRY DRONES',
            'ELIMINATE: V0ID-CRUSHER (PRIME)', '',
            '--- WARNING ---',
            'HEALTH-KITS: REPAIR CHASSIS',
            'PLASMA: RECHARGE WEAPONS'
        ],
        CONTROLS: [
            { k: '[ LEFT / RIGHT ]', a: 'MOVE CHARACTER' },
            { k: '[ UP ]', a: 'ACTIVATE JETPACK' },
            { k: '[ SPACE ]', a: 'FIRE PLASMA GUN' }
        ],
        CONTROLS_MOBILE: [
            { k: '( JOYSTICK )', a: 'MOVE CHARACTER' },
            { k: '( BTN UP )', a: 'ACTIVATE JETPACK' },
            { k: '( BTN SHOOT )', a: 'FIRE PLASMA GUN' }
        ]
    };

    /**
     * @param {CanvasRenderingContext2D} ctx - The render context of the game.
     * @param {HTMLCanvasElement} canvas - The main game canvas.
     */
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.generateGrainPattern();
    }

    /**
     * Orchestrates which overlay should be rendered based on game state.
     * @param {boolean} showM - Flag to show the mission overlay.
     * @param {boolean} showC - Flag to show the controls overlay.
     */
    drawOverlays(showM, showC) {
        if (showM) this.drawMissionOverlay(false);
        else if (showC) this.drawControlsOverlay(false);
        else this.drawHelpHint();
    }

    /**
     * Helper to set common text properties.
     * @param {string} font - CSS font string.
     * @param {string} [align='center'] - Text alignment.
     * @param {string} [color=UIManager.THEMES.TEXT] - Text color hex/rgb.
     */
    prepareText(font, align = 'center', color = UIManager.THEMES.TEXT) {
        this.ctx.font = font;
        this.ctx.textAlign = align;
        this.ctx.fillStyle = color;
    }

    /**
     * Draws a semi-transparent dark background and a glowing neon border.
     * @param {string} color - The glow color for the border.
     */
    drawBaseOverlay(color) {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.88)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawNeonBorder(color);
    }

    /**
     * Creates a pulsing neon rectangle border around the screen.
     * @param {string} color - The stroke and shadow color.
     */
    drawNeonBorder(color) {
        let pulse = 15 + Math.sin(Date.now() / 300) * 5;
        this.ctx.shadowBlur = pulse;
        this.ctx.shadowColor = color;
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(20, 20, this.canvas.width - 40, this.canvas.height - 40);
        this.ctx.shadowBlur = 0;
    }

    /**
     * Renders a standardized message screen with a glitched title.
     * @param {string} title - Main title text.
     * @param {string} sub - Subtitle/Action text.
     * @param {string} color - Theme color.
     */
    drawMessage(title, sub, color) {
        this.drawBaseOverlay(color);
        this.drawGlitchedTitle(title, color);
        this.prepareText('400 2.4rem "ByteBounce"', 'center', color);
        this.ctx.fillText(sub, this.canvas.width / 2, this.canvas.height / 2 + 85);
        this.drawEffectLayers();
    }

    /**
     * Renders the game's initial start screen.
     */
    drawStartScreen() {
        const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        const startText = isMobile ? 'TAP TO ENTER SECTOR 7' : 'ENTER TO SECTOR 7';
        this.drawMessage('NEON CITY 2065', startText, UIManager.THEMES.PRIMARY);
    }

    /**
     * Renders the mission briefing text.
     * @param {boolean} [isIntro=false] - Whether this is shown during the initial intro.
     */
    drawMissionOverlay(isIntro = false) {
        const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        this.drawBaseOverlay(UIManager.THEMES.PRIMARY);
        this.drawGlitchedTitle('MISSION', UIManager.THEMES.PRIMARY, 60);
        this.prepareText('400 2rem "ByteBounce"');

        UIManager.TEXTS.MISSION.forEach((text, i) => {
            this.ctx.fillStyle = text.includes('---') || text.includes('>>') ? UIManager.THEMES.SECONDARY : UIManager.THEMES.TEXT;
            this.ctx.fillText(text, this.canvas.width / 2, 130 + i * 25);
        });

        const footerIntro = isMobile ? 'TAP TO CONTINUE' : 'PRESS ENTER TO CONTINUE';
        const footerGame = isMobile ? 'TAP BUTTON TO RETURN' : 'PRESS [M] TO RETURN TO GAME';
        this.drawFooter(isIntro, footerIntro, footerGame, UIManager.THEMES.SECONDARY);
    }

    /**
     * Renders the keybindings or touch controls overview.
     * @param {boolean} [isIntro=false] - Whether this is shown during the initial intro.
     */
    drawControlsOverlay(isIntro = false) {
        const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        const controlText = isMobile ? UIManager.TEXTS.CONTROLS_MOBILE : UIManager.TEXTS.CONTROLS;

        this.drawBaseOverlay(UIManager.THEMES.SECONDARY);
        this.drawGlitchedTitle('CONTROLS', UIManager.THEMES.SECONDARY, 60);
        this.ctx.save();
        this.prepareText('500 2.5rem "ByteBounce"', 'center', UIManager.THEMES.PRIMARY);

        controlText.forEach((c, i) => {
            this.ctx.shadowBlur = 3;
            this.ctx.shadowColor = UIManager.THEMES.PRIMARY;
            this.ctx.fillText(`${c.k}  ${c.a}`, this.canvas.width / 2, 200 + i * 45);
        });

        this.ctx.restore();
        const footerIntro = isMobile ? 'TAP TO START MISSION' : 'ENTER TO START MISSION';
        const footerGame = isMobile ? 'TAP BUTTON TO RETURN' : 'PRESS [C] TO RETURN TO GAME';
        this.drawFooter(isIntro, footerIntro, footerGame, UIManager.THEMES.PRIMARY);
    }

    /**
     * Draws a pulsing footer text at the bottom of the screen.
     */
    drawFooter(isIntro, introTxt, gameTxt, color) {
        this.drawEffectLayers();
        this.prepareText('400 1.2rem "ByteBounce"', 'center', color);
        const text = isIntro ? introTxt : gameTxt;
        this.ctx.globalAlpha = 0.6 + Math.sin(Date.now() / 300) * 0.4;
        this.ctx.fillText(text, this.canvas.width / 2, this.canvas.height - 60);
        this.ctx.globalAlpha = 1;
    }

    /**
     * Displays the win or game over screen.
     * @param {string} type - Either 'WIN' or 'LOSE'.
     */
    drawEndScreen(type) {
        const isWin = type === 'WIN';
        const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        let subText = isWin
            ? (isMobile ? 'TAP TO START NEW MISSION' : 'PRESS ENTER FOR NEW MISSION')
            : (isMobile ? 'TAP TO REBOOT SYSTEM' : 'PRESS ENTER TO REBOOT');

        this.drawMessage(
            isWin ? 'SECTOR 7 CLEARED' : 'WASTED...',
            subText,
            isWin ? UIManager.THEMES.WIN : UIManager.THEMES.LOSE
        );
    }

    /**
     * Creates a high-energy glitch effect by drawing text multiple times with random offsets.
     * @param {string} text - The title string.
     * @param {string} color - The primary glow color.
     * @param {number} [y=this.canvas.height / 2] - Vertical position.
     */
    drawGlitchedTitle(text, color, y = this.canvas.height / 2) {
        this.prepareText('4rem "Cyberway"');
        let gx = (Math.random() - 0.5) * 7;
        let gy = (Math.random() - 0.5) * 3;

        this.ctx.fillStyle = UIManager.THEMES.SECONDARY;
        this.ctx.fillText(text, this.canvas.width / 2 + gx, y + gy);
        this.ctx.fillStyle = color;
        this.ctx.fillText(text, this.canvas.width / 2 - gx * 0.5, y - gy * 0.5);
        this.ctx.fillStyle = UIManager.THEMES.TEXT;
        this.ctx.fillText(text, this.canvas.width / 2, y);
    }

    /**
     * Displays small hint text in the corner (Desktop only).
     */
    drawHelpHint() {
        if (/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) return;
        this.ctx.save();
        this.ctx.globalAlpha = 0.3 + Math.sin(Date.now() / 600) * 0.2;
        this.prepareText('500 1.2rem "ByteBounce"', 'left', 'white');
        this.ctx.fillText('[M] MISSION', 25, this.canvas.height - 45);
        this.ctx.fillText('[C] CONTROLS', 25, this.canvas.height - 25);
        this.ctx.restore();
    }

    /**
     * Triggers the post-processing pipeline (Scanlines and Grain).
     */
    drawEffectLayers() {
        this.drawScanlines();
        this.drawGrain();
    }

    /**
     * Draws horizontal low-opacity lines to simulate a CRT monitor.
     */
    drawScanlines() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        for (let i = 0; i < this.canvas.height; i += 4) {
            this.ctx.fillRect(0, i, this.canvas.width, 1);
        }
    }

    /**
     * Applies a moving film grain effect using a pre-generated pattern.
     */
    drawGrain() {
        if (!this.grainPattern) return;
        this.ctx.save();
        this.ctx.fillStyle = this.grainPattern;
        this.ctx.translate((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8);
        this.ctx.fillRect(-8, -8, this.canvas.width + 16, this.canvas.height + 16);
        this.ctx.restore();
    }

    /**
     * Pre-renders a 128x128 pixel grain texture to a hidden canvas for performance.
     */
    generateGrainPattern() {
        let gCanvas = document.createElement('canvas');
        gCanvas.width = gCanvas.height = 128;
        let gCtx = gCanvas.getContext('2d');
        let imgData = gCtx.createImageData(128, 128);

        for (let i = 0; i < imgData.data.length; i += 4) {
            let val = Math.random() * 255;
            imgData.data.set([val, val, val, 12], i);
        }

        gCtx.putImageData(imgData, 0, 0);
        this.grainPattern = this.ctx.createPattern(gCanvas, 'repeat');
    }
}