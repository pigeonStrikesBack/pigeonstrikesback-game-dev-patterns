class PDA {
    constructor() {
        this.stateStack = [];
        this.x = 100;
        this.y = 300;
        this.vy = 0;
        this.gravity = 0.5;
        this.jumpForce = -12;
        this.speed = 4;

        // Default state is Standing
        this.stateStack.push('standing');
    }

    update(inputKeys) {
        // Handle states based on the top of the stack
        const currentState = this.stateStack[this.stateStack.length - 1];

        if (currentState === 'standing') {
            this.handleStandingState(inputKeys);
        } else if (currentState === 'walkingLeft') {
            this.handleWalkingLeftState(inputKeys);
        } else if (currentState === 'walkingRight') {
            this.handleWalkingRightState(inputKeys);
        } else if (currentState === 'jumping') {
            this.handleJumpingState();
        } else if (currentState === 'firing') {
            this.handleFiringState();
        }
    }

    // Handle movement when standing
    handleStandingState(inputKeys) {
        if (inputKeys.walkLeft.isDown) {
            this.stateStack.push('walkingLeft');
        } else if (inputKeys.walkRight.isDown) {
            this.stateStack.push('walkingRight');
        }
        if (inputKeys.jump.isDown && this.y === 300) {
            this.stateStack.push('jumping');
            this.vy = this.jumpForce;
        }
        if (inputKeys.shoot.isDown) {
            this.stateStack.push('firing');
        }
    }

    // Handle walking left state
    handleWalkingLeftState(inputKeys) {
        this.x -= this.speed;
        if (!inputKeys.walkLeft.isDown) {
            this.stateStack.pop();
        }
        if (inputKeys.jump.isDown && this.y === 300) {
            this.stateStack.push('jumping');
            this.vy = this.jumpForce;
        }
        if (inputKeys.shoot.isDown) {
            this.stateStack.push('firing');
        }
    }

    // Handle walking right state
    handleWalkingRightState(inputKeys) {
        this.x += this.speed;
        if (!inputKeys.walkRight.isDown) {
            this.stateStack.pop();
        }
        if (inputKeys.jump.isDown && this.y === 300) {
            this.stateStack.push('jumping');
            this.vy = this.jumpForce;
        }
        if (inputKeys.shoot.isDown) {
            this.stateStack.push('firing');
        }
    }

    // Handle jumping state
    handleJumpingState() {
        this.vy += this.gravity;
        this.y += this.vy;
        if (this.y >= 300) {
            this.y = 300;
            this.vy = 0;
            this.stateStack.pop();
        }
    }

    // Handle firing state
    handleFiringState() {
        // Perform firing action (e.g., shoot a projectile)
        console.log("Firing...");

        // Return to the previous state (this could be standing, walking, etc.)
        this.stateStack.pop();
    }
}

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    create() {
        this.inputKeys = {
            walkLeft: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            walkRight: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            jump: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
            shoot: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER),
        };

        this.character = this.add.rectangle(100, 300, 50, 50, 0x00ff00);
        this.pda = new PDA();
    }

    update() {
        this.pda.update(this.inputKeys);

        // Update the character's position
        this.character.setPosition(this.pda.x, this.pda.y);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: MainScene,
};

const game = new Phaser.Game(config);
