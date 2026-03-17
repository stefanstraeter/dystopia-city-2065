const level1 = {
    level_end_x: 3400,
    UIElements: [
        new HealthBar(),
        new CollectableBar(),
        new RocketBar()
    ],
    statusIcons: [
        new HealthIcon(),
        new CollectableIcon(),
        new RocketIcon()
    ],
    collectableItems: [
        new PlasmaCore(650, 300),
        new PlasmaCore(1250, 130),
        new PowerCell(2555, 120),
        new PlasmaCore(3300, 350),
        new RocketAmmo(150, 50),
        new RocketAmmo(950, 20),
        new RocketAmmo(2350, 200)
    ],
    enemies: [
        new Spider(900, 130, 130, 1),
        new Spider(1200, 110, 110, 0.8),
        new Spider(1350, 110, 110, 0.4),
        new Spider(1950, 120, 120, 0.9),
        new Endboss(2900, 330, 330, 0.4)
    ],
    vehicles: {
        background: [
            new Drone(400, 40, 2.5, -1, null, 0.3),
            new Police(1200, 60, 2.0, -1, null, 0.3),
            new Drone(2000, 30, 3.0, -1, null, 0.3)
        ],
        midground: [
            new Police(800, 180, 1.2, -1, null, 1),
            new Truck(1800, 100, 1.1, 1, null, 1)
        ]
    },
    neonSigns: [
        new NeonSign('assets/img/05_neon_signs/monitor_face.png', 10, 80, 120, 120, 4, 6),
        new NeonSign('assets/img/05_neon_signs/side-sign.png', 645, 25, 35, 140, 4, 7),
        new NeonSign('assets/img/05_neon_signs/green-sign.png', 1055, 60, 60, 140, 4, 8),
        new NeonSign('assets/img/05_neon_signs/coke.png', 1140, -10, 45, 110, 3, 10),
        new NeonSign('assets/img/05_neon_signs/scroll-sign.png', 1850, 10, 30, 140, 4, 9),
        new NeonSign('assets/img/05_neon_signs/monitor_face.png', 2255, 100, 120, 120, 4, 6),
        new NeonSign('assets/img/05_neon_signs/chinese-sign.png', 2435, 10, 60, 140, 4, 9),
    ],
    backgrounds: {
        back: [
            new BackgroundObject('assets/img/01_background/far-buildings.png', 350, 0, 350, 350),
            new BackgroundObject('assets/img/01_background/far-buildings.png', 0, 0, 350, 350),
            new BackgroundObject('assets/img/01_background/far-buildings.png', 700, 0, 350, 350),
            new BackgroundObject('assets/img/01_background/far-buildings.png', 1050, 0, 350, 350),
            new BackgroundObject('assets/img/01_background/far-buildings.png', 1400, 0, 350, 350),
            new BackgroundObject('assets/img/01_background/far-buildings.png', 1750, 0, 350, 350),
            new BackgroundObject('assets/img/01_background/far-buildings.png', 2100, 0, 350, 350),
            new BackgroundObject('assets/img/01_background/far-buildings.png', 2450, 0, 350, 350),
            new BackgroundObject('assets/img/01_background/far-buildings.png', 2800, 0, 350, 350),
            new BackgroundObject('assets/img/01_background/far-buildings.png', 3150, 0, 350, 350)
        ],
        middle: [
            new BackgroundObject('assets/img/01_background/back-buildings.png', -200, -60, 580, 400),
            new BackgroundObject('assets/img/01_background/back-buildings.png', 380, -60, 580, 400),
            new BackgroundObject('assets/img/01_background/back-buildings.png', 960, -60, 580, 400),
            new BackgroundObject('assets/img/01_background/back-buildings.png', 1540, -60, 580, 400),
            new BackgroundObject('assets/img/01_background/back-buildings.png', 2120, -60, 580, 400),
            new BackgroundObject('assets/img/01_background/back-buildings.png', 2700, -60, 580, 400)
        ],
        foreground: [
            new BackgroundObject('assets/img/01_background/foreground.png', -1200, -280, 1200, 750),
            new BackgroundObject('assets/img/01_background/foreground.png', 0, -280, 1200, 750),
            new BackgroundObject('assets/img/01_background/foreground.png', 1200, -280, 1200, 750),
            new BackgroundObject('assets/img/01_background/foreground.png', 2400, -280, 1200, 750)
        ]
    }
};