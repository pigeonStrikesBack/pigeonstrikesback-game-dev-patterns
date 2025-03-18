// Flyweight Object - TreeType
class TreeType {
    constructor(texture) {
        this.texture = texture;  // Shared texture (intrinsic state)
    }

    // This method will create a new sprite with the shared texture and given position, scale, and color
    createTree(scene, x, y, scale, color) {
        const sprite = scene.add.sprite(x, y, this.texture);  // Create a new sprite with the shared texture
        sprite.setScale(scale);  // Set the scale (extrinsic state)
        sprite.setTint(color);  // Apply random color tint (extrinsic state)
        return sprite;
    }
}

// Individual Tree Object - represents the unique state (extrinsic state)
class Tree {
    constructor(x, y, treeType, color) {
        this.x = x;       // Position of the tree (extrinsic state)
        this.y = y;       // Position of the tree (extrinsic state)
        this.scale = Math.random() * 0.5 + 0.5;  // Random scale for variation (extrinsic state)
        this.treeType = treeType;  // Reference to the shared TreeType object (intrinsic state)
        this.color = color;  // Color for tinting (extrinsic state)
    }
}

const C = Object.freeze({
    screen: { width: 800, height: 600 },
    treeCount: 50,
})

// Phaser Game Config
const config = {
    type: Phaser.AUTO,
    width: C.screen.width,
    height: C.screen.height,
    backgroundColor: '#007711',
    parent: 'canvas-container',
    scene: {
        preload: function () {
            // Load multiple tree textures for variety
            this.load.image('tree1', 'assets/bigtree01.png');  // Tree 1 texture
            this.load.image('tree2', 'assets/bigtree02.png');  // Tree 2 texture
            this.load.image('tree3', 'assets/bigtree03.png');  // Tree 3 texture
        },

        create: function () {
            // Create an array of available tree textures
            const textures = ['tree1', 'tree2', 'tree3'];

            // Create TreeType objects for each texture
            const treeTypes = {};
            textures.forEach(texture => {
                treeTypes[texture] = new TreeType(texture);
            });

            // Create multiple Tree instances with random positions, random textures, and random colors
            const trees = [];
            for (let i = 0; i < C.treeCount; i++) {
                const x = Math.random() * C.screen.width;
                const y = Math.random() * C.screen.height;
                const texture = textures[Math.floor(Math.random() * textures.length)];  // Random texture
                const color = Phaser.Display.Color.RandomRGB().color;  // Random color for tinting
                trees.push(new Tree(x, y, treeTypes[texture], color));  // Each tree has unique position, texture, and scale
            }

            // Draw the trees using the shared TreeType objects
            trees.forEach(tree => {
                tree.treeType.createTree(this, tree.x, tree.y, tree.scale, tree.color);  // Draw the tree with the random texture and color
            });
        },

        update: function () {
            // Update logic for the game (if needed)
        }
    }
};

const game = new Phaser.Game(config);