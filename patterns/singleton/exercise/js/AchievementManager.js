// --- ACHIEVEMENT MANAGER
class AchievementManager {
    constructor(eventManager) {
        this.eventManager = eventManager; // Handles event notifications
        this.achievements = []; // Stores unlocked achievements

        // Subscribe to score updates to check achievement criteria
        this.eventManager.subscribe('SCORE_UPDATED', {
            update: (score) => this.checkAchievements(score),
        });
    }

    // Checks achievement criteria based on the current score
    checkAchievements(score) {
        if (score >= 1000 && !this.achievements.includes('Millenium')) {
            this.unlockAchievement('Millenium');
        }
        else if (score >= 500 && !this.achievements.includes('Half-Millenium')) {
            this.unlockAchievement('Half-Millenium');
        }
        else if (score >= 100 && !this.achievements.includes('Century')) {
            this.unlockAchievement('Century');
        }
        else if (score >= 50 && !this.achievements.includes('Half-Century')) {
            this.unlockAchievement('Half-Century');
        }
    }

    // Unlocks an achievement and notifies relevant systems
    unlockAchievement(name) {
        this.achievements.push(name);
        console.log(`Achievement unlocked: ${name}`);
        this.eventManager.notify('ACHIEVEMENT_UNLOCKED', name);
    }

    reset() {
        this.achievements = []
    }
}

export default AchievementManager;