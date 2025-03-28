import { init, GameLoop, Text } from 'https://cdn.jsdelivr.net/npm/kontra@10.0.2/+esm';
import { Entity } from './entity.js';
import { initializeInput } from './inputHandler.js';

document.addEventListener("DOMContentLoaded", function () {
    let canvasElement = document.getElementById('game');

    // Initialize Kontra.js properly
    let { canvas, context } = init();

    // Create player sprite
    let player = new Entity(canvas.width/2, canvas.height/2, 20, 20, 'red');

    // Debug text to show command stack
    let debugText = Text({
        text: 'Command Stack:',
        font: '16px Arial',
        color: 'blue',
        x: 10,
        y: 10,
    });

    // Command stack to handle multiple commands
    let commandStack = [];

    // Initialize input system
    initializeInput(commandStack, 10);

    let frameCounter = 0;
    const executeEveryXFrames = 15; // Adjust for more delay
    
    // Game Loop
    let loop = GameLoop({
        update: function () {
            frameCounter++;
    
            if (frameCounter >= executeEveryXFrames && commandStack.length > 0) {
                let command = commandStack.shift(); // Process ONE command per interval
                command.execute(player);
                frameCounter = 0; // Reset counter
            }
    
            // Update debug text
            debugText.text = `Command Stack:\n${commandStack.map(cmd => cmd.toString()).join("\n")}`;
        },
        render: function () {
            player.render();
            debugText.render();
        }
    });

    loop.start(); // Start the game loop
});