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

### Example 1: Rendering thousands of trees with shared models

We have a TreeType object holding shared texture, color, and model data. Each Tree only stores its coordinates and refers to the shared TreeType.

<details>
<summary> code (👆 click here to show) </summary>

js
class TreeType {
constructor(texture, color, model) {
  this.texture = texture;
  this.color = color;
  this.model = model;
}

draw(x, y) {
  console.log(`Drawing tree at (${x}, ${y}) with ${this.color} color`);
}
}

class TreeFactory {
constructor() {
  this.treeTypes = {};
}

getTreeType(texture, color, model) {
  const key = `${texture}-${color}-${model}`;
  if (!this.treeTypes[key]) {
    this.treeTypes[key] = new TreeType(texture, color, model);
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

// Example usage
const factory = new TreeFactory();
const trees = [];
trees.push(new Tree(10, 20, factory.getTreeType("pine.png", "green", "pineModel")));
trees.push(new Tree(30, 40, factory.getTreeType("pine.png", "green", "pineModel")));
trees.forEach(tree => tree.draw());


</details>

### Example 2: Bullet pooling with shared projectile model

A bullet pool stores a shared bullet model and reuses it, rather than creating new models for each bullet fired.

<details>
<summary> code (👆 click here to show) </summary>

js
class BulletModel {
constructor(mesh) {
  this.mesh = mesh; // Shared mesh
}

render(x, y, angle) {
  console.log(`Rendering bullet at (${x}, ${y}) with angle ${angle}`);
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
  this.x += Math.cos(this.angle) * 10;
  this.y += Math.sin(this.angle) * 10;
}

render() {
  this.model.render(this.x, this.y, this.angle);
}
}

// Usage
const bulletModel = new BulletModel("bulletMesh");
const bullet1 = new Bullet(100, 100, 0, bulletModel);
const bullet2 = new Bullet(150, 150, Math.PI / 4, bulletModel);

bullet1.update();
bullet1.render();

bullet2.update();
bullet2.render();


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