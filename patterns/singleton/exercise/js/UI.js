// --- BUTTON (Prototype-based)
class Button {
    constructor(scene, x, y, text, callback) {
        this.scene = scene; // Reference to the Phaser scene
        this.text = text; // Text displayed on the button
        this.callback = callback; // Function executed on click

        // Create interactive text that acts as a button
        this.button = scene.add.text(x, y, text, { fontSize: '32px', fill: '#fff' })
            .setInteractive()
            .on('pointerdown', callback); // Set click event
    }

    // Clones the button with new text and callback
    clone(newText, newCallback) {
        return new Button(this.scene, this.button.x, this.button.y + 50, newText, newCallback);
    }
}

export { Button };