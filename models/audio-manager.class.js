class AudioManager {
    constructor() {
        this.sounds = {
            background: new Audio('./assets/audio/cyberpunk.mp3'),
            plasma: new Audio('./assets/audio/plasma.wav'),
            collect: new Audio('./assets/audio/collect.wav'),
            explosion: new Audio('./assets/audio/explosion.wav')
        };
        this.initSettings();
    }

    initSettings() {
        this.sounds.background.loop = true;
        this.sounds.background.volume = 0.2;

        this.sounds.plasma.volume = 0.02;
        this.sounds.explosion.volume = 0.3;
        this.sounds.collect.volume = 0.3;
    }

    play(name) {
        const s = this.sounds[name];
        if (!s) return;

        if (name !== 'background') {
            s.currentTime = 0;
        }

        s.play().catch(() => { });
    }

    stop(name) {
        const s = this.sounds[name];
        if (!s) return;

        s.pause();
        s.currentTime = 0;
    }

    unlockAudio() {
        Object.values(this.sounds).forEach(sound => {
            sound.muted = true;

            sound.play().then(() => {
                sound.pause();
                sound.currentTime = 0;
                sound.muted = false;
            }).catch(() => { });
        });
    }
}