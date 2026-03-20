const MobileControls = {
    keyboard: null,

    init: function (keyboardInstance) {
        this.keyboard = keyboardInstance;
        const startBtn = document.getElementById("btn-start-game");
        if (startBtn) {
            this.bindButtonEvents();
            this.setupStartScreen();
        }
    },

    getButtonMapping: function () {
        return {
            "btn-left": "KEY_LEFT",
            "btn-right": "KEY_RIGHT",
            "btn-jump": "KEY_UP",
            "btn-shoot": "KEY_SPACE",
            "btn-mission": "KEY_M",
            "btn-controls": "KEY_C",
        };
    },

    bindButtonEvents: function () {
        const btnMap = this.getButtonMapping();
        Object.keys(btnMap).forEach((id) => {
            const element = document.getElementById(id);
            if (element) {
                this.addTouchListeners(element, btnMap[id]);
            }
        });
    },

    addTouchListeners: function (element, keyCode) {
        element.addEventListener("touchstart", (e) => this.handleTouch(e, keyCode, true), { passive: false });
        element.addEventListener("touchend", (e) => this.handleTouch(e, keyCode, false), { passive: false });
        element.addEventListener("touchcancel", (e) => this.handleTouch(e, keyCode, false), { passive: false });
    },

    handleTouch: function (event, keyCode, isPressed) {
        event.preventDefault();
        if (this.keyboard) {
            this.keyboard[keyCode] = isPressed;
        }
    },
    setupStartScreen: function () {
        const startBtn = document.getElementById("btn-start-game");
        if (!startBtn) return;

        startBtn.addEventListener("pointerdown", (e) => {
            e.preventDefault();

            this.startMusic();          // 🔥 ausgelagert
            this.executeStartSequence();

        }, { once: true });
    },

    startMusic: function () {
        const bg = world?.audioManager?.sounds?.background;
        if (!bg || !bg.paused) return;

        bg.volume = 0;
        bg.muted = true;

        bg.play().then(() => {
            bg.muted = false;

            setTimeout(() => {
                bg.volume = 0.2;
            }, 2000);

        }).catch(() => { });
    },

    executeStartSequence: function () {
        if (world) world.gameStarted = true;

        const btn = document.getElementById("btn-start-game");
        if (btn) btn.style.display = "none";
    }

};