import { InitScene, GameScene } from "./js/Scenes.js";


// --- PHASER CONFIGURATION
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [InitScene, GameScene],
    parent: 'canvas-container', // Attach the game canvas to an HTML container
};

// Start the Phaser game
const game = new Phaser.Game(config);
