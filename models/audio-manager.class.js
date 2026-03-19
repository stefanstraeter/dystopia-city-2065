class AudioManager {
    constructor() {
        this.sounds = {
            background: new Audio('../assets/audio/cyberpunk-street.mp3'),
        };

        this.initSettings();
    }

    initSettings() {
        this.sounds.background.loop = true;
        this.sounds.background.volume = 0.4; // Etwas leiser im Hintergrund
    }

    play(name) {
        const s = this.sounds[name];
        if (!s) return;

        // Bei kurzen Sounds: Zurückspulen, falls sie gerade noch spielen
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