// Flyweight TileType class
class TileType {
    constructor(textureKey) {
        this.textureKey = textureKey; // Shared texture key
    }

    createTile(scene, x, y) {
        const sprite = scene.add.sprite(x, y, this.textureKey);
        sprite.setOrigin(0, 0);
        sprite.setDisplaySize(32, 32);
        return sprite;
    }
}

// Tile object storing extrinsic state and reference to TileType
class Tile {
    constructor(x, y, tileType, scene) {
        this.x = x;
        this.y = y;
        this.tileType = tileType;
        this.scene = scene;
        this.sprite = this.tileType.createTile(scene, x * 32, y * 32);
    }

    changeType(newTileType) {
        this.tileType = newTileType;
        this.sprite.destroy(); // Dispose of old sprite
        this.sprite = this.tileType.createTile(this.scene, this.x * 32, this.y * 32);
    }    
}

const config = {
    type: Phaser.AUTO,
    width: 320, // 10 tiles * 32px
    height: 320,
    backgroundColor: '#444',
    parent: 'canvas-container',
    scene: {
        preload: function () {
            this.load.image('dirt',  'assets/dirt_tile.png');
            this.load.image('grass', 'assets/grass_tile.png');
            this.load.image('water', 'assets/water_tile.png');
            this.load.image('stone', 'assets/stone_tile.png');
        },

        create: function () {
            // Create shared tile types
            const tileTypes = {
                dirt: new TileType('dirt'),
                grass: new TileType('grass'),
                water: new TileType('water'),
                stone: new TileType('stone')
            };

            this.tileTypesArray = [...Object.values(tileTypes)];

            this.map = [];
            for (let y = 0; y < 10; y++) {
                for (let x = 0; x < 10; x++) {
                    const randomTileType = this.tileTypesArray[Math.floor(Math.random() * this.tileTypesArray.length)];
                    const tile = new Tile(x, y, randomTileType, this);
                    this.map.push(tile);
                }
            }

            this.input.on('pointerdown', (pointer) => {
                const tileX = Math.floor(pointer.x / 32);
                const tileY = Math.floor(pointer.y / 32);
                const tile = this.map.find(t => t.x === tileX && t.y === tileY);

                if (tile) {
                    // Cycle through the tile types
                    const currentIndex = this.tileTypesArray.indexOf(tile.tileType);
                    const nextIndex = (currentIndex + 1) % this.tileTypesArray.length;
                    tile.changeType(this.tileTypesArray[nextIndex]);
                }
            });
        },

        update: function () {
            // No dynamic updates needed for static tiles
        }
    }
};

const game = new Phaser.Game(config);
