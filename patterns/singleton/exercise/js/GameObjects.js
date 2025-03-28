import GameManager from "./GameManager.js";

// --- ENEMY
class Enemy {
    constructor(scene, x, y, texture) {
        this.scene = scene; // Reference to the Phaser scene
        this.x = x; // Spawn position X
        this.y = y; // Spawn position Y
        this.texture = texture; // Texture key for the sprite
        this.sprite = scene.add.sprite(x, y, texture); // Create the enemy sprite
        this.sprite.scale = 1.8;
        this.spawnTime = scene.time.now; // Store the spawn time for movement

        // Make the sprite interactive and set click event
        this.sprite.setInteractive();
        this.sprite.on('pointerdown', () => {
            GameManager.instance.eventManager.notify('ENEMY_KILLED', this);
            GameManager.instance.updateScore(10); // Award points for killing the enemy
            this.destroy();
        });
    }


    // Moves the enemy in a circular path
    move(elapsedTime) {
        const angle = elapsedTime * 0.002; // Adjust speed here
        this.sprite.x = this.x + 30 * Math.cos(angle);
        this.sprite.y = this.y + 30 * Math.sin(angle);
    }

    // Destroys the sprite when the enemy is removed
    destroy() {
        this.sprite.destroy(); // Remove sprite from the scene
        const index = this.scene.enemies.indexOf(this);
        if (index > -1) {
            this.scene.enemies.splice(index, 1); // Remove enemy from array
        }
        console.log('Enemy destroyed. Total remaining: ', this.scene.enemies.length);
    }
    
}

export { Enemy };