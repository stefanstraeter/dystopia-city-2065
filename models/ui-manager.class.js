class UIManager {
    static THEMES = {
        PRIMARY: '#b72299',
        SECONDARY: '#00ffff',
        WIN: '#00f2ff',
        LOSE: '#ff0055',
        TEXT: '#e3e3e3'
    };

    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.generateGrainPattern();
    }

    generateGrainPattern() {
        let gCanvas = document.createElement('canvas');
        let gCtx = gCanvas.getContext('2d');
        gCanvas.width = gCanvas.height = 128;
        let imgData = gCtx.createImageData(128, 128);
        for (let i = 0; i < imgData.data.length; i += 4) {
            let val = Math.random() * 255;
            imgData.data.set([val, val, val, 12], i);
        }
        gCtx.putImageData(imgData, 0, 0);
        this.grainPattern = this.ctx.createPattern(gCanvas, 'repeat');
    }

    prepareText(font, align = 'center', color = UIManager.THEMES.TEXT) {
        this.ctx.font = font;
        this.ctx.textAlign = align;
        this.ctx.fillStyle = color;
    }

    setShadow(blur, color = 'transparent') {
        this.ctx.shadowBlur = blur;
        this.ctx.shadowColor = color;
    }

    drawOverlay(color) {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.88)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawNeonBorder(color);
    }

    drawNeonBorder(color) {
        let pulse = 15 + Math.sin(Date.now() / 300) * 5;
        this.setShadow(pulse, color);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(20, 20, this.canvas.width - 40, this.canvas.height - 40);
        this.setShadow(0);
    }

    drawMessage(title, sub, color) {
        this.drawOverlay(color);
        this.drawGlitchedTitle(title, color);
        this.prepareText('400 2.4rem "ByteBounce"', 'center', color);
        this.ctx.fillText(sub, this.canvas.width / 2, this.canvas.height / 2 + 85);
        this.drawEffectLayers();
    }

    drawGlitchedTitle(text, color, y = this.canvas.height / 2) {
        this.prepareText('4rem "Cyberway"');
        let gx = (Math.random() - 0.5) * 7;
        let gy = (Math.random() - 0.5) * 3;

        this.drawTextLayer(text, UIManager.THEMES.SECONDARY, gx, y + gy);
        this.drawTextLayer(text, color, -gx * 0.5, y - gy * 0.5);
        this.drawTextLayer(text, UIManager.THEMES.TEXT, 0, y);
    }

    drawTextLayer(text, color, ox, y) {
        this.ctx.fillStyle = color;
        this.ctx.fillText(text, this.canvas.width / 2 + ox, y);
    }

    drawStartScreen() {
        this.drawMessage('NEON CITY 2065', 'ENTER THE GRID', UIManager.THEMES.PRIMARY);
    }

    drawHelpOverlay() {
        this.drawOverlay(UIManager.THEMES.SECONDARY);
        this.prepareText('3rem "Cyberway"');
        this.ctx.fillText('MISSION', this.canvas.width / 2, 90);
        this.renderControlList();
        this.prepareText('1.6rem "Cyberway"', 'center', UIManager.THEMES.TEXT);
        this.renderSystemInfo();

        this.drawEffectLayers();
    }

    drawMissionOverlay() {
        this.drawOverlay(UIManager.THEMES.PRIMARY);
        this.drawGlitchedTitle('MISSION', UIManager.THEMES.PRIMARY, 60);

        const story = [
            'STATUS: OPERATIVE BUD DETECTED',
            'LOCATION: NEON CITY SECTOR 7',
            '',
            'OBJECTIVE: NEUTRALIZE INFESTATION',
            'CLEAR SPIDERS & SENTRY DRONES',
            'ELIMINATE: V0ID-CRUSHER (PRIME)',
            '',
            '--- SYSTEM LOGS ---',
            'HEALTH-KITS: REPAIR CHASSIS',
            'PLASMA: RECHARGE WEAPONS'
        ];

        this.prepareText('400 2rem "ByteBounce"', 'center', UIManager.THEMES.TEXT);
        story.forEach((text, i) => {
            this.ctx.fillStyle = text.includes('---') ? UIManager.THEMES.SECONDARY : UIManager.THEMES.TEXT;
            this.ctx.fillText(text, this.canvas.width / 2, 130 + i * 25);
        });
        this.drawEffectLayers();
    }

    drawControlsOverlay() {
        this.drawOverlay(UIManager.THEMES.SECONDARY);
        this.drawGlitchedTitle('CONTROLS', UIManager.THEMES.SECONDARY, 60);
        this.renderControlList();
        this.drawEffectLayers();
    }

    renderControlList() {
        const controls = [
            { k: '[ LEFT / RIGHT ]', a: 'MOVE' },
            { k: '[ UP ]', a: 'JETPACK' },
            { k: '[ SPACE ]', a: 'PLASMA' },
            { k: '[ ENTER ]', a: 'START' },
            { k: '[ M / C ]', a: 'CLOSE' }
        ];
        this.prepareText('500 2rem "ByteBounce"', 'center', UIManager.THEMES.PRIMARY);
        controls.forEach((c, i) => {
            this.setShadow(3, UIManager.THEMES.PRIMARY);
            this.ctx.fillText(`${c.k}  ${c.a}`, this.canvas.width / 2, 160 + i * 35);
        });
        this.setShadow(0);
    }


    drawHelpHint() {
        this.ctx.save();
        let pulse = 0.3 + Math.sin(Date.now() / 600) * 0.2;
        this.ctx.globalAlpha = pulse;
        this.prepareText('500 1.2rem "ByteBounce"', 'left', 'white');

        const x = 25;
        const yBase = this.canvas.height - 45;

        this.ctx.fillText('[M] MISSION', x, yBase);
        this.ctx.fillText('[C] CONTROLS', x, yBase + 20);
        this.ctx.restore();
    }

    drawEndScreen(type) {
        const isWin = type === 'WIN';
        const title = isWin ? 'SECTOR 7 CLEARED' : 'CONNECTION LOST...';
        const sub = isWin ? 'PRESS ENTER FOR NEW MISSION' : 'PRESS ENTER TO REBOOT';
        const color = isWin ? UIManager.THEMES.WIN : UIManager.THEMES.LOSE;
        this.drawMessage(title, sub, color);
    }

    drawEffectLayers() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        for (let i = 0; i < this.canvas.height; i += 4) {
            this.ctx.fillRect(0, i, this.canvas.width, 1);
        }
        for (let j = 0; j < this.canvas.width; j += 4) {
            this.ctx.fillRect(j, 0, 1, this.canvas.height);
        }
        this.renderGrain();
    }

    renderGrain() {
        if (!this.grainPattern) return;
        this.ctx.save();
        this.ctx.fillStyle = this.grainPattern;
        this.ctx.translate((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8);
        this.ctx.fillRect(-8, -8, this.canvas.width + 16, this.canvas.height + 16);
        this.ctx.restore();
    }
}