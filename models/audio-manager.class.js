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
        if (this.sounds.plasma) {
            this.sounds.plasma.volume = 0.02;
        }
        if (this.sounds.explosion) {
            this.sounds.explosion.volume = 0.3;
        }
        if (this.sounds.collect) {
            this.sounds.collect.volume = 0.3;
        }
    }

    setVolume(name, volume) {
        if (this.sounds[name]) {
            this.sounds[name].volume = Math.max(0, Math.min(1, volume));
        }
    }

    play(name) {
        const s = this.sounds[name];
        if (!s) return;
        if (name !== 'background') {
            s.currentTime = 0;
        }
        s.play().catch(e => console.warn("Audio-Autoplay blockiert:", e));
    }
    stop(name) {
        if (this.sounds[name]) {
            this.sounds[name].pause();
            this.sounds[name].currentTime = 0;
        }
    }
}