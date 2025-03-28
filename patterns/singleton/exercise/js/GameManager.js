import EventManager from "./EventManager.js";
import AudioManager from "./AudioManager.js"
import AchievementManager from "./AchievementManager.js";

// --- GAME MANAGER (Singleton)
class GameManager {
    constructor(scene) {
        // Ensure only one instance of GameManager exists
        if (GameManager.instance) {
            return GameManager.instance;
        }
        GameManager.instance = this;

        this.scene = scene; // Reference to the current scene
        this.playerStats = { score: 0 }; // Player stats (currently only score)
        this.eventManager = new EventManager(); // Handles event notifications
        this.audioManager = new AudioManager(scene); // Manages audio
        this.achievementManager = new AchievementManager(this.eventManager); // Manages achievements

        console.log('GameManager initialized!');
    }

    // Updates the score and notifies relevant systems
    updateScore(amount) {
        this.playerStats.score += amount;
        this.eventManager.notify('SCORE_UPDATED', this.playerStats.score);
    }

    reset() {
        this.playerStats.score = 0;
        this.achievementManager.reset();
        this.eventManager.reset();
        this.audioManager.reset();
    }

    // Switches scenes based on the provided scene key
    switchScene(sceneKey) {
        this.scene.scene.start(sceneKey);
    }
}

export default GameManager;