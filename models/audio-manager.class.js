class AudioManager {
    constructor() {
        this.sounds = {
            background: new Audio('./assets/audio/cyberpunk.mp3'),
            plasma: new Audio('./assets/audio/plasma.wav'),
            collect: new Audio('./assets/audio/collect.wav'),
            explosion: new Audio('./assets/audio/explosion.wav')
        };
        this.isUnlocked = false;
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
        let playPromise = s.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.warn(`Audio ${name} blocked:`, error);
            });
        }
    }

    async unlockAudio() {
        if (this.isUnlocked) return;

        const unlockPromises = Object.values(this.sounds).map(sound => {
            return new Promise((resolve) => {
                sound.muted = true;
                sound.play()
                    .then(() => {
                        sound.pause();
                        sound.currentTime = 0;
                        sound.muted = false;
                        resolve();
                    })
                    .catch(() => resolve());
            });
        });

        await Promise.all(unlockPromises);
        this.isUnlocked = true;
    }
}