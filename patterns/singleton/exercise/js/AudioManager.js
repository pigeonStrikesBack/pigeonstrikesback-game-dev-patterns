// --- AUDIO MANAGER
class AudioManager {
    constructor(scene) {
        this.scene = scene; // Reference to the Phaser scene
        this.sounds = {}; // Stores sound objects by key
    }

    // Adds a sound to the manager after preloading
    addSound(key) {
        this.sounds[key] = this.scene.sound.add(key);
    }

    // Plays a sound based on the key
    playSound(key) {
        if (this.sounds[key]) {
            this.sounds[key].play();
        } else {
            console.warn(`Sound ${key} not found!`);
        }
    }

    reset() {}
}

export default AudioManager;