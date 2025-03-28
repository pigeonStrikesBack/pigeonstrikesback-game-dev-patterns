import { init, initInput, GameLoop, Text } from 'https://cdn.jsdelivr.net/npm/kontra@10.0.2/+esm';
import { Entity, EntityMoveCommand } from './entity.js';
import { keyboard } from './input.js';

document.addEventListener("DOMContentLoaded", function () {
    let canvasElement = document.getElementById('game');

    // Initialize Kontra.js properly
    let { canvas, context } = init();
    initInput();

    // Create player sprite
    let player = new Entity(canvas.width / 2, canvas.height / 2, 20, 20, 'orange');
    player.speed = 10;

    // Debug text to show command stack
    let debugText = Text({
        text: 'Command Stack:',
        font: '16px Arial',
        color: 'blue',
        x: 10,
        y: 10,
    });

    // Info text to show undo/redo instructions
    let infoText = Text({
        text: 'Press [Q] to undo - Press [E] to redo',
        font: '16px Arial',
        color: 'black',
        x: 10,
        y: canvas.height - 20
    });

    // Command stack to handle multiple commands
    let commandStack = [];
    let commandHistory = [];
    let current = -1;

    // Function to handle input and queue commands
    function handleInput() {
        keyboard.update();

        if (keyboard.keys["a"].isPressed || keyboard.keys["arrowleft"].isPressed) {
            const cmd = new EntityMoveCommand(-1, 0, player.speed);
            commandStack.push(cmd);
        }
        if (keyboard.keys["d"].isPressed || keyboard.keys["arrowright"].isPressed) {
            const cmd = new EntityMoveCommand(1, 0, player.speed);
            commandStack.push(cmd);
        }
        if (keyboard.keys["w"].isPressed || keyboard.keys["arrowup"].isPressed) {
            const cmd = new EntityMoveCommand(0, -1, player.speed);
            commandStack.push(cmd);
        }
        if (keyboard.keys["s"].isPressed || keyboard.keys["arrowdown"].isPressed) {
            const cmd = new EntityMoveCommand(0, 1, player.speed);
            commandStack.push(cmd);
        }
        if (keyboard.keys["q"].isPressed) {
            if (current > 0) {
                commandHistory[current--].undo(player);
            }
        }
        if (keyboard.keys["e"].isPressed) {
            if (current < commandHistory.length - 1) {
                commandHistory[++current].execute(player);
            }
        }
    }

    // Function to process the command stack
    function handleCommandStack() {
        while (commandStack.length > 0) {
            commandStack[0].execute(player);
            if (current !== commandHistory.length - 1) {
                commandHistory = commandHistory.slice(0, current + 1);
            }
            commandHistory.push(commandStack.shift());
            current = commandHistory.length - 1;
        }
    }

    // Update function for the game loop
    function update() {
        handleInput();
        handleCommandStack();

        // Update debug text
        debugText.text = `Command History (current ${current}):\n`;
        debugText.text += commandHistory.map((cmd, idx) => (cmd.toString() + (current === idx ? ' *' : ''))).join("\n");
    }

    // Render function for the game loop
    function render() {
        debugText.render();
        player.render();
        infoText.render();
    }

    // Game Loop
    let loop = GameLoop({ update, render });
    loop.start(); // Start the game loop
});