class CSM {
    constructor() {
        this.states = {
            walking: { active: false },
            jumping: { active: false },
        };
        this.x = 100; // Initial x position of the square
        this.y = 300; // Initial y position of the square
        this.vy = 0; // Vertical velocity (for gravity)
        this.gravity = 0.5; // Gravity strength
        this.jumpForce = -12; // Jump force
        this.speed = 4; // Speed of horizontal movement
        this.isJumping = false; // Flag to track if the square is jumping
    }

    update(inputKeys) {
        // Walking state
        if (this.states.walking.active) {
            if (inputKeys.walkLeft.isDown) this.x -= this.speed;
            if (inputKeys.walkRight.isDown) this.x += this.speed;
        }

        // Jumping state
        if (this.states.jumping.active) {
            // Apply gravity when jumping
            this.vy += this.gravity;
            this.y += this.vy;

            if (this.y >= 300) { // Ground level check
                this.y = 300; // Reset y position to the ground level
                this.vy = 0; // Stop vertical velocity
                this.states.jumping.active = false; // Deactivate jumping state
            }
        }
    }

    // Activate Walking State
    startWalking() {
        this.states.walking.active = true;
    }

    // Deactivate Walking State
    stopWalking() {
        this.states.walking.active = false;
    }

    // Activate Jumping State
    startJumping() {
        if (!this.states.jumping.active) {
            this.states.jumping.active = true;
            this.vy = this.jumpForce; // Apply jump force
        }
    }
}

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    create() {
        // Setup keys
        this.inputKeys = {
            walkLeft: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            walkRight: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            jump: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
        };

        // Create square and CSM instance
        this.square = this.add.rectangle(100, 300, 50, 50, 0x00ff00);
        this.csm = new CSM();
    }

    update() {
        // Handle state updates for concurrent behavior
        if (this.inputKeys.walkLeft.isDown || this.inputKeys.walkRight.isDown) {
            this.csm.startWalking();
        } else {
            this.csm.stopWalking();
        }

        if (this.inputKeys.jump.isDown && !this.csm.states.jumping.active) {
            this.csm.startJumping();
        }

        // Update CSM and square's position
        this.csm.update(this.inputKeys);
        this.square.setPosition(this.csm.x, this.csm.y);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: MainScene,
};

const game = new Phaser.Game(config);
