class HSM {
    constructor() {
        this.states = {
            idle: { active: true, substates: { walking: { active: false } } },
            jumping: { active: false },
            shooting: { active: false }
        };

        this.x = 100;
        this.y = 300;
        this.vy = 0;
        this.gravity = 0.5;
        this.jumpForce = -12;
        this.speed = 4;
        this.isShooting = false;
        this.projectiles = [];
    }

    update(inputKeys) {
        if (this.states.idle.substates.walking.active) {
            if (inputKeys.walkLeft.isDown) this.x -= this.speed;
            if (inputKeys.walkRight.isDown) this.x += this.speed;
        }

        if (this.states.jumping.active) {
            this.vy += this.gravity;
            this.y += this.vy;
            if (this.y >= 300) {
                this.y = 300;
                this.vy = 0;
                this.states.jumping.active = false;
            }
        }

        if (this.states.shooting.active) {
            if (this.isShooting) {
                this.projectiles.push({ x: this.x + 50, y: this.y, speed: 5 });
                this.isShooting = false;
            }
        }

        this.projectiles.forEach(projectile => {
            projectile.x += projectile.speed;
        });
    }

    startWalking() {
        this.states.idle.substates.walking.active = true;
        this.states.idle.active = false;
    }

    stopWalking() {
        this.states.idle.substates.walking.active = false;
        this.states.idle.active = true;
    }

    startJumping() {
        if (!this.states.jumping.active) {
            this.states.jumping.active = true;
            this.vy = this.jumpForce;
        }
    }

    startShooting() {
        this.states.shooting.active = true;
        this.isShooting = true;
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
        this.hsm = new HSM();
    }

    update() {
        if (this.inputKeys.walkLeft.isDown || this.inputKeys.walkRight.isDown) {
            this.hsm.startWalking();
        } else {
            this.hsm.stopWalking();
        }

        if (this.inputKeys.jump.isDown && !this.hsm.states.jumping.active) {
            this.hsm.startJumping();
        }

        if (this.inputKeys.shoot.isDown && !this.hsm.states.shooting.active) {
            this.hsm.startShooting();
        }

        this.hsm.update(this.inputKeys);
        this.character.setPosition(this.hsm.x, this.hsm.y);

        this.hsm.projectiles.forEach(projectile => {
            this.add.rectangle(projectile.x, projectile.y, 10, 5, 0xff0000);
        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: MainScene,
};

const game = new Phaser.Game(config);
