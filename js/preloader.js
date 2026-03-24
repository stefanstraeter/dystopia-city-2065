/** * Global cache object for storing preloaded Image elements.
 * @type {Object<string, HTMLImageElement>} 
 */
window.IMAGE_CACHE = {};

const ASSETS_TO_PRELOAD = [
    'assets/img/01_background/back-buildings.png',
    'assets/img/01_background/far-buildings.png',
    'assets/img/01_background/foreground.png',
    'assets/img/00_general/background.jpg',

    'assets/img/02_character_bud/Attack.png',
    'assets/img/02_character_bud/Death.png',
    'assets/img/02_character_bud/Hurt.png',
    'assets/img/02_character_bud/Idle.png',
    'assets/img/02_character_bud/Jump.png',
    'assets/img/02_character_bud/Plasma.png',
    'assets/img/02_character_bud/Walk.png',

    'assets/img/03_enemies/endboss/Attack.png',
    'assets/img/03_enemies/endboss/Bomb.png',
    'assets/img/03_enemies/endboss/Death.png',
    'assets/img/03_enemies/endboss/Hurt.png',
    'assets/img/03_enemies/endboss/Idle.png',

    'assets/img/03_enemies/sentry_drone/Death.png',
    'assets/img/03_enemies/sentry_drone/Fire.png',
    'assets/img/03_enemies/sentry_drone/Forward.png',
    'assets/img/03_enemies/sentry_drone/Idle.png',
    'assets/img/03_enemies/sentry_drone/Plasma.png',
    'assets/img/03_enemies/sentry_drone/Hurt.png',

    'assets/img/03_enemies/spider/Attack.png',
    'assets/img/03_enemies/spider/Death.png',
    'assets/img/03_enemies/spider/Idle.png',
    'assets/img/03_enemies/spider/Walk.png',
    'assets/img/03_enemies/spider/Hurt.png',

    'assets/img/04_vehicles/drone.png',
    'assets/img/04_vehicles/police.png',
    'assets/img/04_vehicles/truck.png',

    'assets/img/05_neon_signs/chinese-sign.png',
    'assets/img/05_neon_signs/coke.png',
    'assets/img/05_neon_signs/green-sign.png',
    'assets/img/05_neon_signs/monitor_face.png',
    'assets/img/05_neon_signs/scroll-sign.png',
    'assets/img/05_neon_signs/side-sign.png',

    'assets/img/06_status_bar/gun_icon.png',
    'assets/img/06_status_bar/gun_status.png',
    'assets/img/06_status_bar/health_icon.png',
    'assets/img/06_status_bar/health_status.png',
    'assets/img/06_status_bar/health_status_endboss.png',
    'assets/img/06_status_bar/plasma_icon.png',
    'assets/img/06_status_bar/plasma_status.png',

    'assets/img/07_collectables/medipack.png',
    'assets/img/07_collectables/plasma_core.png',
    'assets/img/07_collectables/power_cell.png',

    'assets/img/08_explosions/plasma_explosion.png',
    'assets/img/08_explosions/rocket_explosion.png'
];

/**
 * Loads and decodes all game assets asynchronously to populate the IMAGE_CACHE.
 * Uses Promise.all to wait for all assets to be ready.
 * @returns {Promise<void>} Resolves when all assets are loaded and decoded.
 */
async function preloadAssets() {
    const promises = ASSETS_TO_PRELOAD.map(src => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = async () => {
                try {
                    await img.decode();
                } catch (error) {
                };
                window.IMAGE_CACHE[src] = img;
                resolve();
            };
            img.onerror = () => {
                resolve();
            };
        });
    });

    await Promise.all(promises);
}