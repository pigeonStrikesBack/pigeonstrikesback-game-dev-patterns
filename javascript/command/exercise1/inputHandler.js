import { onInput, initInput } from 'https://cdn.jsdelivr.net/npm/kontra@10.0.2/+esm';
import { EntityMoveCommand } from './entity.js';

// Function to initialize input handling
export function initializeInput(commandStack, defaultSpeed) {
    // Initialize Kontra.js input system
    initInput();

    // Listen for the 'left' arrow key or swipe or dpad left input
    onInput(['arrowleft', 'swipeleft', 'dpadleft'], () => {
        // When left is pressed, push a new move command with direction (-1, 0) and speed
        commandStack.push(new EntityMoveCommand(-1, 0, defaultSpeed));
    });

    // Listen for the 'right' arrow key or swipe or dpad right input
    onInput(['arrowright', 'swiperight', 'dpadright'], () => {
        // When right is pressed, push a new move command with direction (1, 0) and speed
        commandStack.push(new EntityMoveCommand(1, 0, defaultSpeed));
    });

    // Listen for the 'up' arrow key or swipe or dpad up input
    onInput(['arrowup', 'swipeup', 'dpadup'], () => {
        // When up is pressed, push a new move command with direction (0, 1) and speed
        commandStack.push(new EntityMoveCommand(0, -1, defaultSpeed));
    });

    // Listen for the 'down' arrow key or swipe or dpad down input
    onInput(['arrowdown', 'swipedown', 'dpaddown'], () => {
        // When down is pressed, push a new move command with direction (0, -1) and speed
        commandStack.push(new EntityMoveCommand(0, 1, defaultSpeed));
    });
}
