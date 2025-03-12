import { init, Sprite, GameLoop, onInput, initInput, Text } from 'https://cdn.jsdelivr.net/npm/kontra@10.0.2/+esm';

document.addEventListener("DOMContentLoaded", function () {
    let canvasElement = document.getElementById('game');

    // Initialize Kontra.js properly
    let { canvas, context } = init();

    // Create player sprite
    let player = Sprite({
        x: 300,
        y: 300,
        width: 40,
        height: 40,
        color: 'red', // 🎨 Red color
        anchor: { x: 0.5, y: 0.5 },
        direction: { x: 0, y: 0 }, // Direction initialized as neutral
        speed: 0 // Speed initialized as 0
    });

    // Debug text to show command stack
    let debugText = Text({
        text: 'Command Stack:',
        font: '16px Arial',
        color: 'blue',
        x: 10,
        y: 10,
    });

    // Movement speed (pixels per frame)
    const defaultSpeed = 10;

    // Command classes
    class SetDirectionCommand {
        constructor(dx, dy) {
            this.dx = dx;
            this.dy = dy;
        }

        execute(player) {
            player.direction = { x: this.dx, y: this.dy };
        }

        toString() {
            return `SetDirection(${this.dx}, ${this.dy})`;
        }
    }

    class SetSpeedCommand {
        constructor(speed) {
            this.speed = speed;
        }

        execute(player) {
            player.speed = this.speed;
        }

        toString() {
            return `SetSpeed(${this.speed})`;
        }
    }

    class MoveCommand {
        execute(player) {
            player.x += player.direction.x * player.speed;
            player.y += player.direction.y * player.speed;
        }

        toString() {
            return `Move()`;
        }
    }

    // Command stack to handle multiple commands
    let commandStack = [];

    // Initialize input system
    initInput();

    // Listen for key or directional pad inputs using onInput()
    onInput(['arrowleft', 'swipeleft', 'dpadleft'], () => {
        console.log("Queueing Move Left");
        commandStack.push(new SetDirectionCommand(-1, 0));
        commandStack.push(new SetSpeedCommand(defaultSpeed));
        commandStack.push(new MoveCommand());
    });

    onInput(['arrowright', 'swiperight', 'dpadright'], () => {
        console.log("Queueing Move Right");
        commandStack.push(new SetDirectionCommand(1, 0));
        commandStack.push(new SetSpeedCommand(defaultSpeed));
        commandStack.push(new MoveCommand());
    });

    onInput(['arrowup', 'swipeup', 'dpadup'], () => {
        console.log("Queueing Move Up");
        commandStack.push(new SetDirectionCommand(0, -1));
        commandStack.push(new SetSpeedCommand(defaultSpeed));
        commandStack.push(new MoveCommand());
    });

    onInput(['arrowdown', 'swipedown', 'dpaddown'], () => {
        console.log("Queueing Move Down");
        commandStack.push(new SetDirectionCommand(0, 1));
        commandStack.push(new SetSpeedCommand(defaultSpeed));
        commandStack.push(new MoveCommand());
    });

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
