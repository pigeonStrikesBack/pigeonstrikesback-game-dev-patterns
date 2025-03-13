import { keyPressed } from 'https://cdn.jsdelivr.net/npm/kontra@10.0.2/+esm';

const monitoredKeys = [
    'arrowleft', 'a',
    'arrowright', 'd',
    'arrowdown', 's',
    'arrowup', 'w',
    'q',
    'e',
];

export const keyboard = {
    keys: monitoredKeys.reduce((keys, key) => {
        keys[key] = { down: false, isPressed: false, isReleased: false };
        return keys;
    }, {}),
    update: updateKeyboard
};

function updateKeyboard() {
    Object.keys(keyboard.keys).forEach(key => {
        const keyState = keyboard.keys[key];

        if (keyPressed(key)) {
            if (!keyState.down) {
                keyState.isPressed = true; // Key was just pressed
                keyState.isReleased = false;
            } else {
                keyState.isPressed = false;
            }
            keyState.down = true;
        } else {
            if (keyState.down) {
                keyState.isReleased = true; // Key was just released
                keyState.isPressed = false;
            } else {
                keyState.isReleased = false;
            }
            keyState.down = false;
        }
    });
}
