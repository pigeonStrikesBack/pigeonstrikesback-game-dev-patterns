import GameManager from "./GameManager.js";
import { Button } from "./UI.js";
import { Enemy } from "./GameObjects.js";

// --- INIT SCENE
class InitScene extends Phaser.Scene {
    constructor() {
        super({ key: 'InitScene' });
    }

    preload() {
        // Preload assets for the game
        this.load.setBaseURL('assets/')
        this.load.image('enemy', 'enemy.png'); // Enemy texture
        this.load.audio('hit', 'hit.mp3'); // Hit sound effect
        this.load.audio('achievement', 'achievement.mp3'); // Achievement sound effect
    }

    create() {
        // Initialize GameManager and preload sounds
        const gameManager = new GameManager(this);
        gameManager.audioManager.addSound('hit');
        gameManager.audioManager.addSound('achievement');

        // Switch to the main game scene
        gameManager.switchScene('GameScene');
    }
}

// --- GAME SCENE
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.enemies = []; // Array to store enemies
    }

    create() {
        const gameManager = GameManager.instance;

        // Spawn enemies periodically
        this.time.addEvent({
            delay: 500, // Spawn every second
            callback: () => {
                if (this.enemies.length < 10) { // Only spawn if less than 10 enemies
                    const enemy = new Enemy(this, Phaser.Math.Between(100, 700), Phaser.Math.Between(100, 500), 'enemy');
                    this.enemies.push(enemy);
                }
            },
            loop: true,
        });

        // Create a restart button
        const restartButton = new Button(this, 50, 50, 'Restart', () => {
            gameManager.reset(); // Reset player stats
            this.enemies = [];
            this.scene.restart(); // Restart the scene
        });

        this.scoreLabel = this.add.text(50, 100, 'Score: 0', { fontSize: '32px', fill: '#fff' });

        // Subscribe to SCORE_UPDATED to update the score label
        gameManager.eventManager.subscribe('SCORE_UPDATED', {
            update: (newScore) => {
                this.scoreLabel.setText(`Score: ${newScore}`);
            }
        });


        // Subscribe to ACHIEVEMENT_UNLOCKED to update both audio and HUD
        gameManager.eventManager.subscribe('ACHIEVEMENT_UNLOCKED', {
            update: (achievement) => {
                const achievementText = this.add.text(300, 50, `Achievement: ${achievement}`, { fontSize: '24px', fill: '#0f0' });

                // Set a timer to destroy the text after 3 seconds
                this.time.addEvent({
                    delay: 1000, // Duration (in milliseconds) before the text disappears
                    callback: () => {
                        achievementText.destroy(); // Remove the text from the scene
                    },
                });

                // Play achievement audio
                gameManager.audioManager.playSound('achievement');
            }
        });

        gameManager.eventManager.subscribe('ENEMY_KILLED', {
            update: (enemy) => {;
                console.log(`enemy killed at x: ${enemy.x}, y: ${enemy.y}`);
                gameManager.audioManager.playSound('hit');
            }
        })
    }

    update(time) {
        // Update enemy movement
        this.enemies.forEach(enemy => {
            enemy.move(time - enemy.spawnTime);
        });
    }
}

export { InitScene, GameScene }