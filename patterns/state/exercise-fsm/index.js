class FSM {
    constructor() {
        this.state = 'Idle'; // Initial state is Idle
        this.x = 100; // Initial x position of the square
        this.y = 300; // Initial y position of the square
        this.vy = 0; // Vertical velocity (for gravity)
        this.gravity = 0.5; // Gravity strength
        this.jumpForce = -12; // Jump force
        this.speed = 4; // Speed of horizontal movement
        this.isJumping = false; // Flag to track if the square is jumping
    }

    update(inputKeys) {
        switch (this.state) {
            case 'Idle':
                if (inputKeys.walkLeft.isDown || inputKeys.walkRight.isDown) this.state = 'Walking';
                if (inputKeys.jump.isDown && !this.isJumping) {
                    this.state = 'Jumping';
                    this.isJumping = true;
                    this.vy = this.jumpForce; // Apply jump force
                }
                break;
            case 'Walking':
                if (inputKeys.walkLeft.isDown) this.x -= this.speed;
                if (inputKeys.walkRight.isDown) this.x += this.speed;

                if (inputKeys.jump.isDown && !this.isJumping) {
                    this.state = 'Jumping';
                    this.isJumping = true;
                    this.vy = this.jumpForce;
                }

                if (!inputKeys.walkLeft.isDown && !inputKeys.walkRight.isDown) this.state = 'Idle';
                break;
            case 'Jumping':
                // Update the vertical position with gravity
                this.vy += this.gravity;
                this.y += this.vy;

                // If the square hits the ground, reset to idle and stop vertical movement
                if (this.y >= 300) {
                    this.y = 300;
                    this.isJumping = false;
                    this.vy = 0;
                    this.state = 'Idle'; // Return to idle state after landing
                }
                break;
        }
    }

    move() {
        // Update position based on current state
        if (this.state === 'Walking') {
            // Horizontal movement is already handled in the state logic
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

        // Create square and FSM instance
        this.square = this.add.rectangle(100, 300, 50, 50, 0x00ff00);
        this.fsm = new FSM();
    }

    update() {
        // Update FSM
        this.fsm.update(this.inputKeys);
        this.fsm.move();

        // Update square's position
        this.square.setPosition(this.fsm.x, this.fsm.y);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: MainScene,
};

const game = new Phaser.Game(config);
