const MobileControls = {
    init: function () {
        if (this.isMobileVisible()) {
            this.bindButtonEvents();
            this.setupStartScreen();
        }
    },

    isMobileVisible: function () {
        const controls = document.querySelector(".mobile-controls-overlay");
        return controls && window.getComputedStyle(controls).display !== "none";
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

    addTouchListeners: function (element, keyCode) {
        element.addEventListener("touchstart", (e) => this.handleTouch(e, keyCode, true), { passive: false });
        element.addEventListener("touchend", (e) => this.handleTouch(e, keyCode, false), { passive: false });
        element.addEventListener("touchcancel", (e) => this.handleTouch(e, keyCode, false), { passive: false });
    },


    handleTouch: function (event, keyCode, isPressed) {
        event.preventDefault();
        keyboard[keyCode] = isPressed;
    },

    setupStartScreen: function () {
        const startBtn = document.getElementById("btn-start-game");
        if (!startBtn) return;

        startBtn.addEventListener("click", () => this.executeStartSequence());
        startBtn.addEventListener("touchstart", (e) => {
            e.preventDefault();
            this.executeStartSequence();
        }, { passive: false }
        );
    },


    executeStartSequence: function () {
        keyboard.KEY_ENTER = true;
        setTimeout(() => (keyboard.KEY_ENTER = false), 100);

        const startOverlay = document.getElementById("start-screen");
        if (startOverlay) startOverlay.style.display = "none";

        if (typeof startInitialAudio === "function") startInitialAudio();
        if (typeof toggleFullscreen === "function") toggleFullscreen();
    },
};