class UIManager {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.primaryColor = '#b72299';
        this.secondaryColor = '#00ffff';
        this.grainPattern = null;
        this.generateGrainPattern();
    }

    generateGrainPattern() {
        let grainCanvas = document.createElement('canvas');
        let grainCtx = grainCanvas.getContext('2d');
        grainCanvas.width = 128;
        grainCanvas.height = 128;
        let imageData = grainCtx.createImageData(grainCanvas.width, grainCanvas.height);
        let data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            let value = Math.random() * 255;
            data[i] = value;
            data[i + 1] = value;
            data[i + 2] = value;
            data[i + 3] = 12;
        }
        grainCtx.putImageData(imageData, 0, 0);
        this.grainPattern = this.ctx.createPattern(grainCanvas, 'repeat');
    }

    drawOverlay(color) {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.88)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        let glowPulse = 15 + Math.sin(Date.now() / 300) * 5;
        this.ctx.shadowBlur = glowPulse;
        this.ctx.shadowColor = color;
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(20, 20, this.canvas.width - 40, this.canvas.height - 40);
        this.ctx.shadowBlur = 0;
    }

    drawMessage(title, subtext, color) {
        this.drawOverlay(color);
        this.ctx.textAlign = 'center';

        this.ctx.font = '80px "Cyberway Riders"';


        let glitch_x = (Math.random() - 0.5) * 7;
        let glitch_y = (Math.random() - 0.5) * 3;

        this.ctx.fillStyle = this.secondaryColor;
        this.ctx.fillText(title, this.canvas.width / 2 + glitch_x, this.canvas.height / 2 + glitch_y);

        this.ctx.fillStyle = color;
        this.ctx.fillText(title, this.canvas.width / 2 - (glitch_x * 0.5), this.canvas.height / 2 - (glitch_y * 0.5));

        this.ctx.fillStyle = '#e3e3e3';
        this.ctx.fillText(title, this.canvas.width / 2, this.canvas.height / 2);

        this.ctx.font = '400 18px "Science Gothic"';
        this.ctx.fillStyle = color;
        this.ctx.fillText(subtext, this.canvas.width / 2, this.canvas.height / 2 + 85);

        this.drawEffectLayers();
    }

    drawStartScreen() {
        this.drawMessage('NEON CITY 2065', 'ENTER THE GRID', this.primaryColor);
    }

    drawEffectLayers() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        for (let i = 0; i < this.canvas.height; i += 4) {
            this.ctx.fillRect(0, i, this.canvas.width, 1);
        }

        if (this.grainPattern) {
            this.ctx.save();
            this.ctx.fillStyle = this.grainPattern;
            let offset_x = (Math.random() - 0.5) * 8;
            let offset_y = (Math.random() - 0.5) * 8;
            this.ctx.translate(offset_x, offset_y);
            this.ctx.fillRect(-8, -8, this.canvas.width + 16, this.canvas.height + 16);
            this.ctx.restore();
        }
    }

    drawHelpOverlay() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.strokeStyle = this.secondaryColor;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(50, 50, this.canvas.width - 100, this.canvas.height - 100);

        const centerX = this.canvas.width / 2;
        this.ctx.textAlign = 'center';
        this.ctx.font = '40px "Cyberway Riders"';
        this.ctx.fillStyle = '#e3e3e3';
        this.ctx.fillText('SYSTEM CONTROLS', centerX, 110);

        const controls = [
            { k: '[LEFT / RIGHT]', a: 'MOVE LEFT / RIGHT' },
            { k: '[UP]', a: 'JETPACK' },
            { k: '[SPACE]', a: 'PLASMA ATTACK' },
            { k: '[ENTER]', a: 'START MISSION' },
            { k: '[H]', a: 'CLOSE MANUAL' }
        ];

        this.ctx.font = '600 18px "Science Gothic"';

        controls.forEach((c, i) => {
            let y = 180 + i * 45;
            let fullText = `${c.k}  —  ${c.a}`;
            this.ctx.shadowBlur = 5;
            this.ctx.shadowColor = this.primaryColor;
            this.ctx.fillStyle = this.primaryColor;
            this.ctx.fillText(fullText, centerX, y);
            this.ctx.shadowBlur = 0;
        });

        this.ctx.font = '400 14px "Science Gothic"';
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';


        this.drawEffectLayers();
    }

    drawHelpHint() {
        this.ctx.save();
        let pulse = 0.25 + Math.sin(Date.now() / 1000) * 0.15;
        this.ctx.globalAlpha = pulse;
        this.ctx.textAlign = 'left';
        this.ctx.font = '800 12px "Science Gothic"';
        this.ctx.fillStyle = 'white';
        this.ctx.fillText('[H] CONTROLS', 25, this.canvas.height - 25);
        this.ctx.restore();
    }

    drawEndScreen(gameOverType) {
        if (gameOverType === 'LOSE') {
            this.drawMessage(
                'TERMINATED',
                'PRESS ENTER TO REBOOT CLONE',
                '#ff0055'
            );
        } else if (gameOverType === 'WIN') {
            this.drawMessage(
                'MISSION COMPLETE',
                'PRESS ENTER TO START NEW MISSION',
                '#00f2ff'
            );
        }
    }
}