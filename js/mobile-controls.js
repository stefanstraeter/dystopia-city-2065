const MobileControls = {
    keyboard: null,

    init: function (keyboardInstance) {
        this.keyboard = keyboardInstance;
        this.attachButtonListeners();
    },

    attachButtonListeners: function () {
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
            "btn-fullscreen-mobile": "FULLSCREEN"
        };
    },

    addTouchListeners: function (element, keyCode) {
        element.addEventListener("touchstart", (e) => this.handleTouch(e, keyCode, true, element), { passive: false });
        element.addEventListener("touchend", (e) => this.handleTouch(e, keyCode, false, element), { passive: false });
        element.addEventListener("touchcancel", (e) => this.handleTouch(e, keyCode, false, element), { passive: false });
    },

    handleTouch: function (event, keyCode, isPressed, element) {
        if (keyCode !== 'FULLSCREEN' && event.cancelable) {
            event.preventDefault();
        }

        if (this.keyboard) {
            this.keyboard[keyCode] = isPressed;

            if (element) {
                if (isPressed) {
                    element.classList.add("button-pressed");
                } else {
                    element.classList.remove("button-pressed");
                }
            }
        }
    },

    showButtonsOnGameStart: function () {
        const overlay = document.querySelector('.mobile-controls-overlay');
        if (overlay) overlay.classList.add('show-mobile-controls');
        const systemBtns = document.querySelector('.system-btns');
        if (systemBtns) systemBtns.classList.add('show-system-buttons');
    }
};