// --- GAME

class GameEntity {
    constructor(scene, x, y, texture) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.texture = texture;
        this.sprite = scene.add.sprite(x, y, texture);
        this.spawnTime = scene.time.now; // Store spawn time for movement calculation
    }

    clone() {
        return new GameEntity(this.scene, this.x, this.y, this.texture);
    }

    destroy() {
        this.sprite.destroy();
    }
}

class Monster extends GameEntity {
    constructor(scene, x, y, texture, health, attack = 10) {
        super(scene, x, y, texture);
        this.health = health;
        this.attack = attack;

        // Add click event to destroy monster
        this.sprite.setInteractive();
        this.sprite.on('pointerdown', () => {
            this.scene.removeMonster(this); // Remove from scene
        });
    }

    clone() {
        return new Monster(this.scene, this.x + 50, this.y, this.texture, this.health, this.attack);
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.scene.removeMonster(this); // Remove from scene if health reaches 0
        }
    }

    attackEnemy(enemy) {
        enemy.takeDamage(this.attack);
    }

    move(elapsedTime) {
        let speed = 0.0015; // Slow movement
        let radius = 30;   // Small circular motion
        this.sprite.x = this.x + Math.cos(elapsedTime * speed) * radius;
        this.sprite.y = this.y + Math.sin(elapsedTime * speed) * radius;
    }
}

// --- UI

class Button {
    constructor(scene, x, y, label, onClick) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.label = label;
        this.onClick = onClick;

        this.button = scene.add.text(x, y, label, { fontSize: '32px', fill: '#fff' })
            .setInteractive()
            .on('pointerdown', this.onClick);
    }

    clone(newLabel, newOnClick) {
        return new Button(this.scene, this.x, this.y + 50, newLabel, newOnClick);
    }
}

// --- SCENE

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.monsters = [];
        this.buttons = [];
    }

    preload() {
        this.load.image('monster', 'monster.png');
    }

    create() {
        // Spawn initial monster
        let monster = new Monster(this, 400, 300, 'monster', 100, 15);
        this.monsters.push(monster);

        // Restart Button
        const restartButton = new Button(this, 50, 100, 'Restart', () => {
            this.scene.restart(); // Correct restart behavior
        });
        this.buttons.push(restartButton);

        // Clone Restart Button into a Spawn Button but change its behavior
        const spawnButton = restartButton.clone('Spawn', () => {
            let newMonster = new Monster(
                this,
                Phaser.Math.Between(200, 600),
                Phaser.Math.Between(200, 400),
                'monster',
                100,
                10
            );
            this.monsters.push(newMonster);
        });
        this.buttons.push(spawnButton);
    }

    update(time) {
        this.monsters.forEach(monster => {
            monster.move(time - monster.spawnTime); // Move in slower circular motion
        });
    }

    removeMonster(monster) {
        // Remove monster from array
        this.monsters = this.monsters.filter(m => m !== monster);
        monster.destroy();
    }
}

// --- PHASER CONFIG

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: MainScene,
    parent: 'canvas-container'
};

const game = new Phaser.Game(config);
