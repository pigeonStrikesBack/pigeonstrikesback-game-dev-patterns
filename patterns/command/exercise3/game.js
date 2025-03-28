import { Text } from 'https://cdn.jsdelivr.net/npm/kontra@10.0.2/+esm'
import { Entity, EntityMoveCommand } from './entity.js';
import { Keyboard } from './keyboard.js';
import { DataStructures } from './dataStructures.js';
import { getRandomHSVColor } from './color.js';

// Define the game object to handle game state and logic
export const game = {
    ui: {},   // UI-related data
    frameCounter: 0, // Frame counter for timing command execution
    isExecutingMacro: false, // Flag to indicate if the macro is being executed
    isExecutionPaused: false, // is macro execution paused?
    frameDelay: 25, // how much wait between commands execution

    // Initialize the game
    setup(canvas, context) {
        this.canvas = canvas;
        this.context = context;

        this.commandMacro = DataStructures.createQueue();
        this.player = this.player = this.createPlayer();
        this.ui = this.createUI();

        Keyboard.setup([
            'w', 'ArrowUp',
            'a', 'ArrowLeft',
            's', 'ArrowDown',
            'd', 'ArrowRight',
            'q', 'e', 'p',
            'z', 'c',
        ]);
    },

    // Create the player entity
    createPlayer() {
        const canvas = this.canvas;
        const player = new Entity(
            canvas.width / 2,
            canvas.height / 2,
            20,
            20,
            getRandomHSVColor()
        );
        player.speed = 10;

        return player;
    },

    macroLabelString() {
        let text = '';
        text += `Movement macro: [${
            this.isExecutingMacro ?
            this.isExecutionPaused ?
            'paused':
            'executing':
            'recording'
        }]\n`;
        text += this.commandMacro
            .toArray()
            .map(cmd => cmd.toString())
            .join("\n");

        return text;
    },

    executionLabelString() {
        let text = '';
        text += `Macro execution: [frameDelay: ${this.frameDelay}]\n`;
        if (this.executionQueue) {
            text += this.executionQueue
                .toArray()
                .map(cmd => cmd.toString())
                .join("\n");
        }

        return text;
    },

    // Create the UI elements
    createUI() {
        const canvas = this.canvas;

        const macroLabel = Text({
            font: '16px Arial',
            color: 'blue',
            x: 10,
            y: 10,
            anchor: { x: 0.0, y: 0.0 },
            textAlign: "center"
        });

        const executionLabel = Text({
            font: '16px Arial',
            color: 'brown',
            x: canvas.width - 10,
            y: 10,
            anchor: { x: 1.0, y: 0.0 },
            textAlign: "center"
        });

        const infoLabel = Text({
            font: '16px Arial',
            color: 'black',
            x: canvas.width/2,
            y: canvas.height - 10,
            anchor: { x: 0.5, y: 1 },
            textAlign: "left"
        });

        macroLabel.text = this.macroLabelString();
        executionLabel.text = this.executionLabelString();
        infoLabel.text = "Press [W][A][S][D] or [⮝][⮜][⮟][⮞]"
        infoLabel.text += "\nrepeatedly to fill the macro";
        infoLabel.text += "\nPress [E] to execute the macro"
        infoLabel.text += "\nPress [Q] to empty the macro"
        infoLabel.text += "\nPress [P] to pause/unpause"
        infoLabel.text += "\nPress [Z] and [C] to change the frame delay"

        return { macroLabel, executionLabel, infoLabel };
    },

    // Handle input and queue commands
    handleInput() {
        Keyboard.update();

        const { player, commandMacro } = this;

        if (Keyboard.getKeyState('p').isPressed && this.isExecutingMacro) {
            this.isExecutionPaused = !this.isExecutionPaused;
        }
        if (Keyboard.getKeyState('z').isPressed) {
            this.frameDelay = Math.max(5, this.frameDelay - 5); // Minimum delay of 5 frames
        }
        if (Keyboard.getKeyState('c').isPressed) {
            this.frameDelay = Math.min(60, this.frameDelay + 5); // Maximum delay of 60 frames
        }

        if(this.isExecutingMacro){ return; }
        
        if (Keyboard.getKeyState('w').isPressed || Keyboard.getKeyState('ArrowUp').isPressed) {
            commandMacro.enqueue(new EntityMoveCommand(0, -1, player.speed));
        }
        if (Keyboard.getKeyState('s').isPressed || Keyboard.getKeyState('ArrowDown').isPressed) {
            commandMacro.enqueue(new EntityMoveCommand(0, 1, player.speed));
        }
        if (Keyboard.getKeyState('a').isPressed || Keyboard.getKeyState('ArrowLeft').isPressed) {
            commandMacro.enqueue(new EntityMoveCommand(-1, 0, player.speed));
        }
        if (Keyboard.getKeyState('d').isPressed || Keyboard.getKeyState('ArrowRight').isPressed) {
            commandMacro.enqueue(new EntityMoveCommand(1, 0, player.speed));
        }
        if (Keyboard.getKeyState('q').isPressed) {
            this.commandMacro = DataStructures.createQueue(); // Clear macro
        }
        if (Keyboard.getKeyState('e').isPressed && !this.commandMacro.isEmpty()) {
            this.isExecutingMacro = true;
            this.frameCounter = 0;
        }
        
        
    },

    // Execute the macro commands with frame delays
    executeMacro() {
        if(this.isExecutionPaused) return;

        // Use a copy of the commandMacro to execute
        if (!this.executionQueue) {
            // Create a copy of the commandMacro for execution
            this.executionQueue = this.commandMacro.copy();
        }

        this.frameCounter++;

        // Execute a command every frameDelay
        if (this.frameCounter >= this.frameDelay && !this.executionQueue.isEmpty()) {
            const cmd = this.executionQueue.dequeue();
            cmd.execute(this.player);
            this.frameCounter = 0; // Reset frame counter after execution
        }

        // Stop execution if the copied queue is empty
        if (this.executionQueue.isEmpty()) {
            this.isExecutingMacro = false; // End macro execution
            this.executionQueue = null; // Clear the execution queue
        }
    },

    // Update the game state
    update(dt) {
        this.handleInput();

        // execute macro if any
        if(this.isExecutingMacro)
            this.executeMacro()

        // Update debug text
        const { macroLabel, executionLabel } = this.ui;
        macroLabel.text = this.macroLabelString();
        executionLabel.text = this.executionLabelString();
    },

    // Render the game
    render() {
        this.ui.macroLabel.render();
        this.ui.executionLabel.render();
        this.player.render();
        this.ui.infoLabel.render();
    }
};