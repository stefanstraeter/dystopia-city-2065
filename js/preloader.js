window.IMAGE_CACHE = {};

const ASSETS_TO_PRELOAD = [
    'assets/img/01_background/back-buildings.png',
    'assets/img/01_background/far-buildings.png',
    'assets/img/01_background/foreground.png',
    'assets/img/background.jpg',
    'assets/img/02_character_bud/Idle.png',
    'assets/img/02_character_bud/Walk.png',
    'assets/img/02_character_bud/Jump.png',
    'assets/img/02_character_bud/Attack.png',
    'assets/img/02_character_bud/Hurt.png',
    'assets/img/02_character_bud/Death.png',
    'assets/img/02_character_bud/Plasma.png',
    'assets/img/03_enemies/sentry_drone/Idle.png',
    'assets/img/03_enemies/spider/Walk.png',
    'assets/img/03_enemies/endboss/Idle.png',
    'assets/img/08_explosions/plasma_explosion.png',
    'assets/img/06_status_bar/health_status.png',
    'assets/img/06_status_bar/plasma_status.png'
];

async function preloadAssets() {
    const promises = ASSETS_TO_PRELOAD.map(src => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = src;

            img.onload = async () => {
                try {
                    await img.decode();
                } catch (e) { }

                window.IMAGE_CACHE[src] = img;
                resolve();
            };

            img.onerror = () => resolve();
        });
    });

    await Promise.all(promises);
}