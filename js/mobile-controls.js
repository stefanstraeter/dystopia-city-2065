const MobileControls = {

    keyboard: null,

    /**
     * Initializes the mobile controls with a keyboard instance.
     * @param {Object} keyboardInstance - The keyboard state manager to update.
     */
    init: function (keyboardInstance) {
        this.keyboard = keyboardInstance;
        this.attachButtonListeners();
    },

    /**
     * Finds button elements in the DOM and attaches touch event listeners.
     */
    attachButtonListeners: function () {
        const btnMap = this.getButtonMapping();
        Object.keys(btnMap).forEach((id) => {
            const element = document.getElementById(id);
            if (element) {
                this.addTouchListeners(element, btnMap[id]);
            }
        });
    },

    /**
     * Defines the mapping between HTML element IDs and internal key codes.
     * @returns {Object<string, string>} A map of element IDs to key constants.
     */
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

    /**
     * Adds touch start, end, and cancel listeners to a specific element.
     * @param {HTMLElement} element - The button element.
     * @param {string} keyCode - The key code to trigger.
     */
    addTouchListeners: function (element, keyCode) {
        element.addEventListener("touchstart", (e) => this.handleTouch(e, keyCode, true, element), { passive: false });
        element.addEventListener("touchend", (e) => this.handleTouch(e, keyCode, false, element), { passive: false });
        element.addEventListener("touchcancel", (e) => this.handleTouch(e, keyCode, false, element), { passive: false });
    },

    /**
     * Processes touch events to update key states and visual button feedback.
     * @param {TouchEvent} event - The native touch event.
     * @param {string} keyCode - The mapped key code.
     * @param {boolean} isPressed - Whether the button is currently being touched.
     * @param {HTMLElement} element - The element that was touched.
     */
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

    /**
     * Displays the mobile control UI overlays when the game starts.
     */
    showButtonsOnGameStart: function () {
        const overlay = document.querySelector('.mobile-controls-overlay');
        if (overlay) overlay.classList.add('show-mobile-controls');
        const systemBtns = document.querySelector('.system-btns');
        if (systemBtns) systemBtns.classList.add('show-system-buttons');
    }
};