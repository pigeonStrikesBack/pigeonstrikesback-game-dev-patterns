# Update Method Pattern

📑 [Click here](./update.md) if you wanna read more about this pattern

## Definition

### Gang of Four's definition

The sources provided do not explicitly state the Gang of Four's definition of the Update Method pattern as a standalone pattern. The book "Design Patterns" lists various design patterns but does not have a dedicated section for an "Update Method" pattern.

### Robert Nystrom's definition

**Simulate a collection of independent objects by telling each to process one frame of behavior at a time**.

### AI-generated definition

ai generate definition

## Use Cases

### use case 1

Simulating independent objects: Games with multiple entities like characters, enemies, or environmental elements that need to have their behavior processed regularly can use the Update Method pattern. Each entity has its own `update()` method that gets called every frame.

### use case 2

Games with live entities that the player interacts with: Games featuring dynamic elements that the player can engage with, such as "space marines, dragons, Martians, ghosts, or athletes," often employ this pattern to control their actions and responses over time.

### use case 3

Handling concurrent behavior: When a game has numerous objects or systems that need to run seemingly simultaneously, the Update Method pattern allows each to perform a small part of its logic in each frame, creating the illusion of concurrency.

### use case 4

Simulating behavior over time: For objects whose state and actions evolve over time, the `update()` method provides a consistent mechanism to advance their simulation step by step.

## General Examples

### Example 1: Basic Entity Update

description of example

A basic `Entity` class with an abstract `update()` method is defined. Concrete entity types like `Skeleton` can then implement their specific behaviors within their own `update()` methods. The `World` class maintains a collection of these entities and iterates through them in its `gameLoop()` to call each entity's `update()` method.

code (👆 click here to show)

```cpp
class Entity {
public:
  Entity() : x_(0), y_(0) {}
  virtual ~Entity() {}
  virtual void update() = 0;

  double x() const { return x_; }
  double y() const { return y_; }

  void setX(double x) { x_ = x; }
  void setY(double y) { y_ = y; }

private:
  double x_;
  double y_;
};

class World {
public:
  World() : numEntities_(0) {}
  void gameLoop();

private:
  Entity* entities_[MAX_ENTITIES];
  int numEntities_;
};

void World::gameLoop() {
  while (true) {
    // Handle user input...

    // Update each entity.
    for (int i = 0; i < numEntities_; i++) {
      entities_[i]->update();
    }

    // Physics and rendering...
  }
}
```

### Example 2: Patrolling Skeleton

description of example

A `Skeleton` class inherits from `Entity` and overrides the `update()` method to implement patrolling behavior. It moves left and right within a defined range, changing direction when it reaches the boundaries.

code (👆 click here to show)

```cpp
class Skeleton : public Entity {
public:
  Skeleton() : patrollingLeft_(false) {}

  virtual void update() {
    if (patrollingLeft_) {
      setX(x() - 1);
      if (x() == 0) patrollingLeft_ = false;
    } else {
      setX(x() + 1);
      if (x() == 100) patrollingLeft_ = true;
    }
  }

private:
  bool patrollingLeft_;
};
```

### Example 3: Handling Variable Time Steps

description of example

The `Skeleton`'s `update()` method is modified to accept an `elapsed` time parameter. This allows the skeleton's movement speed to be independent of the frame rate, making the simulation more consistent even if the time between frames varies.

code (👆 click here to show)

```cpp
class Skeleton : public Entity {
public:
  Skeleton() : patrollingLeft_(false), x(0) {}

  virtual void update(double elapsed) {
    if (patrollingLeft_) {
      x -= elapsed;
      if (x <= 0) {
        patrollingLeft_ = false;
        x = -x;
      }
    } else {
      x += elapsed;
      if (x >= 100) {
        patrollingLeft_ = true;
        x = 100 - (x - 100);
      }
    }
  }

private:
  bool patrollingLeft_;
  double x;
};
```

## PROS and CONS

**PROS**

- **Simplicity:** The pattern is straightforward and easy to understand and implement.

- **Decoupling:** Each entity encapsulates its own behavior, making the game loop cleaner and reducing dependencies between different parts of the game.

- **Organization:** It provides a clear structure for managing the behavior of multiple dynamic game elements.

- **Extensibility:** Adding or removing entities with their own unique behaviors is easy; you just need to create a new class with an `update()` method or remove an instance from the update loop.

**CONS**

- **Potential for tight coupling within entities:** While the game loop is decoupled from individual entity logic, the logic within an entity's `update()` method can still become complex and tightly coupled to other systems if not managed carefully.

- **Sequential updates:** Updating all entities sequentially can become a performance bottleneck if there are a very large number of entities with complex update logic.

- **State management:** Entities need to maintain their own state between update calls, which can sometimes lead to more complex entity designs.

- **Careful modification of object lists:** Modifying the list of updatable objects while iterating through it in the update loop can lead to issues if not handled correctly.

## Conclusion

The **Update Method pattern** is a fundamental and widely used pattern in game development for **simulating the behavior of numerous independent game objects over time**. By giving each dynamic entity its own `update()` method that is called every frame, the pattern **promotes organization, decoupling, and extensibility** in game code. While it is simple and effective for many scenarios, developers should be mindful of potential performance implications with a large number of complex entities and ensure proper state management within the `update()` methods. The Update Method pattern often works in conjunction with the **Game Loop pattern**, which drives the continuous execution of the game and calls the update methods of the active entities.