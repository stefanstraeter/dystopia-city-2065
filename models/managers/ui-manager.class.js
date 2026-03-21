class UIManager {
    static THEMES = {
        PRIMARY: '#b72299', SECONDARY: '#00ffff', WIN: '#00f2ff', LOSE: '#ff0055', TEXT: '#e3e3e3'
    };

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
            { k: '[ ← / → ]', a: 'SHIFT POSITION' },
            { k: '[ ↑ ]', a: 'ACTIVATE JETPACK' },
            { k: '[ SPACE ]', a: 'SHOOT PLASMA GUN' }
        ]
    };

    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.generateGrainPattern();
    }

    drawOverlays(showM, showC) {
        if (showM) this.drawMissionOverlay(false);
        else if (showC) this.drawControlsOverlay(false);
        else this.drawHelpHint();
    }

    prepareText(font, align = 'center', color = UIManager.THEMES.TEXT) {
        this.ctx.font = font;
        this.ctx.textAlign = align;
        this.ctx.fillStyle = color;
    }

    drawBaseOverlay(color) {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.88)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawNeonBorder(color);
    }

    drawNeonBorder(color) {
        let pulse = 15 + Math.sin(Date.now() / 300) * 5;
        this.ctx.shadowBlur = pulse;
        this.ctx.shadowColor = color;
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(20, 20, this.canvas.width - 40, this.canvas.height - 40);
        this.ctx.shadowBlur = 0;
    }

    drawMessage(title, sub, color) {
        this.drawBaseOverlay(color);
        this.drawGlitchedTitle(title, color);
        this.prepareText('400 2.4rem "ByteBounce"', 'center', color);
        this.ctx.fillText(sub, this.canvas.width / 2, this.canvas.height / 2 + 85);
        this.drawEffectLayers();
    }

    drawStartScreen() {
        this.drawMessage('NEON CITY 2065', 'ENTER SECTOR 7', UIManager.THEMES.PRIMARY);
    }

    drawMissionOverlay(isIntro = false) {
        this.drawBaseOverlay(UIManager.THEMES.PRIMARY);
        this.drawGlitchedTitle('MISSION', UIManager.THEMES.PRIMARY, 60);
        this.prepareText('400 2rem "ByteBounce"');
        UIManager.TEXTS.MISSION.forEach((text, i) => {
            this.ctx.fillStyle = text.includes('---') || text.includes('>>') ? UIManager.THEMES.SECONDARY : UIManager.THEMES.TEXT;
            this.ctx.fillText(text, this.canvas.width / 2, 130 + i * 25);
        });

        this.drawFooter(isIntro, 'PRESS ENTER TO CONTINUE', 'PRESS [M] TO RETURN TO GAME', UIManager.THEMES.SECONDARY);
    }

    drawControlsOverlay(isIntro = false) {
        this.drawBaseOverlay(UIManager.THEMES.SECONDARY);
        this.drawGlitchedTitle('CONTROLS', UIManager.THEMES.SECONDARY, 60);
        this.ctx.save();
        this.prepareText('500 2.5rem "ByteBounce"', 'center', UIManager.THEMES.PRIMARY);
        UIManager.TEXTS.CONTROLS.forEach((c, i) => {
            this.ctx.shadowBlur = 3;
            this.ctx.shadowColor = UIManager.THEMES.PRIMARY;
            this.ctx.fillText(`${c.k}  ${c.a}`, this.canvas.width / 2, 200 + i * 45);
        });
        this.ctx.restore();
        this.drawFooter(isIntro, 'ENTER TO START MISSION', 'PRESS [C] TO RETURN TO GAME', UIManager.THEMES.PRIMARY);
    }

    drawFooter(isIntro, introTxt, gameTxt, color) {
        this.drawEffectLayers();
        this.prepareText('400 1.2rem "ByteBounce"', 'center', color);
        const text = isIntro ? introTxt : gameTxt;
        this.ctx.globalAlpha = 0.6 + Math.sin(Date.now() / 300) * 0.4;
        this.ctx.fillText(text, this.canvas.width / 2, this.canvas.height - 60);
        this.ctx.globalAlpha = 1;
    }

    drawEndScreen(type) {
        const isWin = type === 'WIN';
        this.drawMessage(isWin ? 'SECTOR 7 CLEARED' : 'WASTED...',
            isWin ? 'PRESS ENTER FOR NEW MISSION' : 'PRESS ENTER TO REBOOT',
            isWin ? UIManager.THEMES.WIN : UIManager.THEMES.LOSE);
    }

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

    drawHelpHint() {
        this.ctx.save();
        this.ctx.globalAlpha = 0.3 + Math.sin(Date.now() / 600) * 0.2;
        this.prepareText('500 1.2rem "ByteBounce"', 'left', 'white');
        this.ctx.fillText('[M] MISSION', 25, this.canvas.height - 45);
        this.ctx.fillText('[C] CONTROLS', 25, this.canvas.height - 25);
        this.ctx.restore();
    }

    drawEffectLayers() {
        this.drawScanlines();
        this.drawGrain();
    }

    drawScanlines() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        for (let i = 0; i < this.canvas.height; i += 4) {
            this.ctx.fillRect(0, i, this.canvas.width, 1);
        }
    }

    drawGrain() {
        if (!this.grainPattern) return;
        this.ctx.save();
        this.ctx.fillStyle = this.grainPattern;
        this.ctx.translate((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8);
        this.ctx.fillRect(-8, -8, this.canvas.width + 16, this.canvas.height + 16);
        this.ctx.restore();
    }

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