/**
 * Manages game audio, including sound effects and background music.
 * Handles browser-specific audio unlocking and volume balancing.
 */
export class AudioManager {

    /**
     * Initializes the audio library and sets default volumes.
     */
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

    /**
     * Configures looping and initial volume levels for all sound assets.
     */
    initSettings() {
        this.sounds.background.loop = true;
        this.sounds.background.volume = 0.1;
        this.sounds.plasma.volume = 0.05;
        this.sounds.explosion.volume = 0.1;
        this.sounds.collect.volume = 0.2;
    }

    /**
     * Plays a sound effect or music track by its defined name.
     * Resets the playback time for sound effects to allow rapid re-firing.
     * @param {string} name - The key of the sound in the sounds object.
     */
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

    /**
     * Unlocks all audio contexts by briefly playing and pausing them.
     * Required to satisfy browser Autoplay policies upon first user interaction.
     * @async
     * @returns {Promise<void>} Resolves once all audio assets are primed for playback.
     */
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