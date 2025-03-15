import { initInput, keyPressed } from 'https://cdn.jsdelivr.net/npm/kontra@10.0.2/+esm';

/**
 * Keyboard module for managing the state of monitored keys.
 * Provides methods to initialize key tracking, update their states, and retrieve state information.
 */
const privateData = {
    keys: null // Encapsulated keys to keep the state private
};

export const Keyboard = {
    /**
     * Initializes the Keyboard module with the keys to be monitored.
     * @param {string[]} monitoredKeys - Array of keys to monitor (e.g., ["ArrowUp", "a", "Space"]).
     * @throws {Error} If monitoredKeys is not an array.
     */
    setup: (monitoredKeys) => {
        if (!Array.isArray(monitoredKeys)) {
            throw new Error("setup method requires an array of keys to monitor.");
        }

        initInput(); // Initialize Kontra's input system
        privateData.keys = monitoredKeys.reduce((keys, key) => {
            keys[key] = {
                down: false,      // Tracks whether the key is currently held down
                isPressed: false, // Tracks whether the key was just pressed in the current update
                isReleased: false // Tracks whether the key was just released in the current update
            };
            return keys;
        }, {});
    },

    /**
     * Updates the state of monitored keys.
     * Checks whether each key is pressed or released and updates its state accordingly.
     * @throws {Error} If the setup method was not called.
     */
    update: () => {
        if (!Object.prototype.hasOwnProperty.call(privateData, 'keys') || privateData.keys === null) {
            throw new Error("Keyboard was not initialized. Use the setup method first.");
        }

        // Iterate over all monitored keys and update their states
        Object.keys(privateData.keys).forEach((key) => {
            const keyState = privateData.keys[key];

            if (keyPressed(key)) {
                if (!keyState.down) {
                    keyState.isPressed = true;  // Key was just pressed
                    keyState.isReleased = false;
                } else {
                    keyState.isPressed = false; // Key remains held down
                }
                keyState.down = true; // Mark the key as down
            } else {
                if (keyState.down) {
                    keyState.isReleased = true; // Key was just released
                    keyState.isPressed = false;
                } else {
                    keyState.isReleased = false; // Key remains unpressed
                }
                keyState.down = false; // Mark the key as no longer down
            }
        });
    },

    /**
     * Retrieves the state of all monitored keys.
     * @returns {Object|null} - The state of all monitored keys or null if not initialized.
     */
    getKeys: () => {
        return privateData.keys;
    },

    /**
     * Retrieves the state of a specific key.
     * @param {string} key - The key to retrieve the state for.
     * @returns {Object|null} - The state of the key or null if the key is not monitored or setup was not called.
     */
    getKeyState: (key) => {
        return privateData.keys && privateData.keys[key] ? privateData.keys[key] : null;
    },

    /**
     * Cleans up the Keyboard module by clearing the monitored keys.
     */
    cleanup: () => {
        privateData.keys = null;
    }
};
