// --- OBSERVER SYSTEM

class Observer {
    constructor() {
        this.subscribers = [];
    }

    subscribe(callback) {
        this.subscribers.push(callback);
    }

    notify(data) {
        this.subscribers.forEach(callback => callback(data));
    }
}

// --- UI SYSTEM

class UISystem {
    constructor(scene) {
        this.scene = scene;
        this.uiObserver = new Observer();

        // Create UI elements
        this.monsterCountText = this.scene.add.text(20, 20, `Monsters On Screen: 0`, {
            fontSize: '24px',
            fill: '#fff'
        });

        this.killedCountText = this.scene.add.text(20, 50, `Monsters Killed: 0`, {
            fontSize: '24px',
            fill: '#fff'
        });

        // Subscribe UI updates
        this.uiObserver.subscribe((data) => this.updateUI(data));
    }

    updateUI({ monsterCount, killCount }) {
        this.monsterCountText.setText(`Monsters On Screen: ${monsterCount}`);
        this.killedCountText.setText(`Monsters Killed: ${killCount}`);
    }
}

// --- ACHIEVEMENT SYSTEM

class AchievementSystem {
    constructor(scene, uiSystem) {
        this.scene = scene;
        this.uiSystem = uiSystem;
        this.killCount = 0;
        this.achievementObserver = new Observer();

        // Subscribe to achievements
        this.achievementObserver.subscribe((count) => this.checkAchievements(count));
    }

    trackKill() {
        this.killCount++;
        this.achievementObserver.notify(this.killCount);
        this.uiSystem.uiObserver.notify({ monsterCount: this.scene.monsters.length, killCount: this.killCount });
    }

    checkAchievements(count) {
        const milestones = {
            1: 'You killed a monster!',
            10: 'Way to the slaughter 😮',
            25: 'You still here?\n25 monsters felt your wrath',
            50: 'You killed 50 monsters\nYOU MONSTER!',
            100: 'The patience of the slaughter\nnever ends...',
            200: 'Come on bro this is just a demo\nstop it\nno more achievements >:c'
        };
        if (milestones[count]) {
            this.displayAchievement(`\n🏆\n\n${milestones[count]}\n`);
        }
    }

    displayAchievement(message) {
        this.scene.sound.play('achievement');

        const text = this.scene.add.text(400, 50, message, {
            fontSize: '24px',
            fill: '#ff0',
            backgroundColor: '#005500cc',
            align: 'center'
        }).setOrigin(0.5);

        this.scene.time.delayedCall(2000, () => {
            text.destroy();
        });
    }

    resetAchievements() {
        this.killCount = 0;
        this.uiSystem.uiObserver.notify({ monsterCount: this.scene.monsters.length, killCount: this.killCount });
    }
}

// --- GAME ENTITY

class GameEntity {
    constructor(scene, x, y, texture) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.texture = texture;
        this.sprite = scene.add.sprite(x, y, texture);
        this.spawnTime = scene.time.now;
    }

    destroy() {
        this.sprite.destroy();
    }
}

// --- MONSTER CLASS

class Monster extends GameEntity {
    constructor(scene, x, y, texture, health) {
        super(scene, x, y, texture);
        this.health = health;

        this.sprite.setInteractive();
        this.sprite.on('pointerdown', () => { this.damage(this.health); });
    }

    damage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.scene.removeMonster(this);
        }
    }

    move(elapsedTime) {
        let speed = 0.0015;
        let radius = 30;
        this.sprite.x = this.x + Math.cos(elapsedTime * speed) * radius;
        this.sprite.y = this.y + Math.sin(elapsedTime * speed) * radius;
    }
}

// --- UI BUTTON CLASS

class Button {
    constructor(scene, x, y, label, onClick) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.label = label;
        this.onClick = onClick;

        this.button = scene.add.text(x, y, label, {
            fontSize: '32px',
            fill: '#fff',
            backgroundColor: '#0000ff55',
        })
            .setInteractive()
            .on('pointerdown', this.onClick);
    }

    clone(newLabel, newOnClick) {
        return new Button(this.scene, this.x, this.y + 50, newLabel, newOnClick);
    }
}

// --- MAIN GAME SCENE

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.monsters = [];
        this.buttons = [];
    }

    preload() {
        this.load.image('monster', 'monster.png');
        this.load.audio('achievement', 'achievement.wav'); // Load achievement sound
    }

    create() {
        this.uiSystem = new UISystem(this);
        this.achievementSystem = new AchievementSystem(this, this.uiSystem);
        this.monsters = [];

        // Spawn initial monster
        this.spawnMonster(400, 300);

        // Restart Button
        const restartButton = new Button(this, 50, 100, 'Restart', () => {
            this.achievementSystem.resetAchievements();
            this.scene.restart();
        });
        this.buttons.push(restartButton);

        // Spawn Button
        const spawnButton = restartButton.clone('Spawn', () => {
            this.spawnMonster(
                Phaser.Math.Between(200, 600),
                Phaser.Math.Between(200, 400)
            );
        });
        this.buttons.push(spawnButton);
    }

    update(time) {
        this.monsters.forEach(monster => {
            monster.move(time - monster.spawnTime);
        });
    }

    spawnMonster(x, y) {
        let monster = new Monster(this, x, y, 'monster', 100, 10);
        this.monsters.push(monster);
        this.uiSystem.uiObserver.notify({ monsterCount: this.monsters.length, killCount: this.achievementSystem.killCount });
    }

    removeMonster(monster) {
        this.monsters = this.monsters.filter(m => m !== monster);
        monster.destroy();
        this.achievementSystem.trackKill();
        this.spawnMonster(Phaser.Math.Between(200, 600), Phaser.Math.Between(200, 400));
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
