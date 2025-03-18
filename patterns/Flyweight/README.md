# Flyweight Pattern

## Definition

### Gang of Four's definition  
The pattern solves that by separating out an object’s data into two kinds. The first kind of data is the stuff that’s not specific to a single instance of that object and can be shared across all of them. The Gang of Four calls this the intrinsic state. The rest of the data is the extrinsic state, the stuff that is unique to that instance.

### Robert Nystrom's definition (summarized)  
Flyweight is used when you have too many objects and need to make them lighter by splitting their state into two parts:  
- **Intrinsic state**: data that is shared and context-free (for example, models and textures for trees).  
- **Extrinsic state**: data that is unique to each instance (like position, scale, and color).  
By sharing intrinsic state between objects and keeping only unique data externally, the pattern reduces memory usage and overhead. This technique feels most clever when the shared data doesn’t have an obvious separate identity — it’s like the object exists in multiple places at once.  

### AI-generated definition  
The Flyweight Pattern is a technique for optimizing performance and memory usage by decomposing objects into shared and unique parts. The shared part — the intrinsic state — is immutable, reused across many instances, and typically represents heavy resources like textures or meshes. The unique part — the extrinsic state — represents per-instance attributes like position, direction, or scale. Flyweight encourages thinking of large groups of objects not as individual, fully self-contained instances, but as lightweight references bound together by shared structure and unique behavior.

## Use Cases

- Managing a large number of game entities (like bullets, trees, or particles) that share common attributes.
- Storing tile data in large maps where only a few types of tiles are repeated thousands of times.
- Representing characters in a font rendering system.
- Game projectiles where each projectile shares mesh and texture, but has different positions.

## General Examples

### Example 1: Rendering thousands of trees with shared sprites in 2D  

We have a `TreeType` object holding a shared texture, tint color, and possibly size. Each `Tree` only stores its position and refers to the shared `TreeType`.  

<details>
<summary> code (👆 click here to show) </summary>

```js
class TreeType {
  constructor(texture, color, size) {
    this.texture = texture; // In PixiJS, this would be a PIXI.Texture
    this.color = color;     // Tint or color filter
    this.size = size;       // Width/height scaling
  }

  draw(x, y) {
    console.log(`Drawing tree at (${x}, ${y}) with color ${this.color} and size ${this.size}`);
    // In PixiJS, you would do something like:
    // const sprite = new PIXI.Sprite(this.texture);
    // sprite.tint = this.color;
    // sprite.x = x; sprite.y = y;
    // sprite.scale.set(this.size, this.size);
    // app.stage.addChild(sprite);
  }
}

class TreeFactory {
  constructor() {
    this.treeTypes = {};
  }

  getTreeType(texture, color, size) {
    const key = `${texture}-${color}-${size}`;
    if (!this.treeTypes[key]) {
      this.treeTypes[key] = new TreeType(texture, color, size);
    }
    return this.treeTypes[key];
  }
}

class Tree {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
  }

  draw() {
    this.type.draw(this.x, this.y);
  }
}

// Example usage:
const factory = new TreeFactory();
const forest = [];

forest.push(new Tree(100, 150, factory.getTreeType("treeTexture.png", 0x00FF00, 1.2)));
forest.push(new Tree(200, 180, factory.getTreeType("treeTexture.png", 0x00FF00, 1.2)));
forest.push(new Tree(250, 160, factory.getTreeType("treeTexture.png", 0x228B22, 0.8)));

// Draw all trees
forest.forEach(tree => tree.draw());
```
</details>  

---

### Example 2: Reusing a bullet sprite in a 2D top-down shooter  

We store a shared bullet texture in `BulletModel` and spawn `Bullet` instances that only hold position and direction data.  

<details>
<summary> code (👆 click here to show) </summary>

```js
class BulletModel {
  constructor(texture) {
    this.texture = texture; // In PixiJS this will be a PIXI.Texture
  }

  render(x, y, angle) {
    console.log(`Rendering bullet at (${x}, ${y}) with angle ${angle}`);
    // With PixiJS:
    // const sprite = new PIXI.Sprite(this.texture);
    // sprite.x = x; sprite.y = y;
    // sprite.rotation = angle;
    // app.stage.addChild(sprite);
  }
}

class Bullet {
  constructor(x, y, angle, model) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.model = model;
  }

  update() {
    const speed = 8;
    this.x += Math.cos(this.angle) * speed;
    this.y += Math.sin(this.angle) * speed;
  }

  render() {
    this.model.render(this.x, this.y, this.angle);
  }
}

// Usage example:
const bulletModel = new BulletModel("bulletTexture.png");
const bullets = [
  new Bullet(300, 300, 0, bulletModel),
  new Bullet(320, 300, Math.PI / 6, bulletModel),
  new Bullet(340, 300, Math.PI / 4, bulletModel)
];

// Simulate updating and rendering
bullets.forEach(bullet => {
  bullet.update();
  bullet.render();
});
```
</details>  

## PROS and CONS

<details><summary>PROS</summary>

- Saves memory by avoiding duplication of identical data.
- Reduces object creation overhead.
- Useful in rendering large numbers of similar objects.
- Can improve cache performance.

</details>

<details><summary>CONS</summary>

- Adds complexity in managing shared and unique states.
- Can make code harder to read and maintain.
- Flyweights are immutable; attempting to change shared data can introduce bugs.
- Not always beneficial for small object counts.

</details>

----

**Conclusion:**  
The Flyweight Pattern is incredibly useful when you need to represent large numbers of similar objects without exhausting system memory. In game development, this often applies to objects like particles, trees, projectiles, and tiles. While it introduces a layer of complexity, it's an essential optimization technique for high-performance, large-scale scenes.