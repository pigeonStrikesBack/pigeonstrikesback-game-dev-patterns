# Prototype Pattern

📑 [Click here](./prototype.md) if you wanna read more about this pattern

## Definition

### Gang of Four's definition  

The Prototype Pattern is a creational design pattern that allows you to create new objects by copying an existing object, known as the prototype. This pattern avoids the cost of creating new instances by cloning an already existing object.

### Robert Nystrom's definition  

The Prototype pattern allows you to copy existing objects without making your code dependent on their classes. Instead of creating new objects via constructors, you clone an existing prototype, which can be more efficient and flexible.

### AI-generated definition  

The Prototype Pattern is a creational pattern that involves cloning an object rather than creating a new one from scratch. This is particularly useful when object creation is costly, and you want to avoid unnecessary repetitions in the object instantiation process.

## Use Cases

### Use case 1: Game Development

When different monsters are spawned in a game, instead of creating multiple spawners for each monster, the Prototype Pattern allows a monster to clone itself to create new instances.

### Use case 2: UI Frameworks

In UI frameworks where elements like buttons, text fields, and other components need to be cloned dynamically based on different configurations.

### Use case 3: Object Creation with Complex State

When objects have many parameters and configurations, cloning a prototype can be simpler than setting up all parameters again.

## General Examples

### Example 1: Cloning Monsters in a Game

In a game, instead of having different spawners for every type of monster, you could have the monsters clone themselves when needed.

<details>
<summary> code (👆 click here to show) </summary>

```js
class Monster {
  constructor(health, speed) {
    this.health = health;
    this.speed = speed;
  }

  clone() {
    return new this.constructor(this.health, this.speed);
  }
}

class Ghost extends Monster {
  constructor(health, speed) {
    super(health, speed);
  }

  clone() {
    return new Ghost(this.health, this.speed);
  }
}

const ghost = new Ghost(100, 5);
const clonedGhost = ghost.clone();
console.log(clonedGhost);
```

</details>

### Example 2: Cloning UI Elements

In a UI framework, you could have elements like buttons that are cloned to change their appearance or functionality.

<details>
<summary> code (👆 click here to show) </summary>

```js
class Button {
  constructor(label, color) {
    this.label = label;
    this.color = color;
  }

  clone() {
    return new Button(this.label, this.color);
  }
}

const primaryButton = new Button("Click Me", "blue");
const clonedButton = primaryButton.clone();
console.log(clonedButton);
```

</details>

## PROS and CONS

<details><summary>PROS</summary>

- **Reduced Object Creation Cost**: Cloning an existing object is often less expensive than constructing a new one, especially if object creation involves complex operations.
- **Flexible and Scalable**: Objects can be cloned with different configurations and the clone method can be overridden to cater to specific subclass behaviors.
- **Code Cleanliness**: Reduces the need for repetitive code for creating instances of similar objects.

</details>

<details><summary>CONS</summary>

- **Implementation Overhead**: Every class needs to implement the `clone()` method, which can add complexity and maintenance costs.
- **Shallow Copy Issues**: If not implemented carefully, cloning might result in shallow copies of objects, leading to issues when deep copying is needed.
- **Not Always Needed**: In some cases, especially with dynamically typed languages, cloning can be unnecessary, as objects can be passed directly.

</details>

## Conclusion

The Prototype Pattern can be incredibly useful for scenarios where object creation is costly or complex. By cloning prototypes, you can improve efficiency and flexibility. However, it requires careful implementation, especially when dealing with deep cloning. It might not always be necessary in languages with more flexible object handling mechanisms.