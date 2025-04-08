The **Update Method** pattern is a fundamental design pattern in game programming used to **simulate a collection of independent objects by instructing each object to process one frame of its behavior at a time**.

## Intent

The primary goal is to simulate a world containing multiple independent entities by having each entity manage its own behavior frame by frame.

## Motivation

Without the Update Method pattern, the logic for advancing the behavior of every game entity would likely be crammed into the main game loop. This leads to several problems:

- **Complexity:** The game loop becomes increasingly large and difficult to manage as more entities and their unique behaviors are added.

- **Maintainability:** Changes to one entity's behavior might inadvertently affect others due to the tightly coupled code.

- **Extensibility:** Adding new entities with distinct behaviors becomes cumbersome and error-prone.

The Update Method pattern addresses these issues by having each entity **encapsulate its own behavior within an `update()` method**. The game loop then simply iterates through a collection of these objects and calls their respective `update()` methods each frame. This keeps the game loop clean and makes it easy to add or remove entities without significantly altering the core game loop logic.

## **The Pattern in Detail:**

- The **game world** maintains a **collection of game objects** or entities.

- Each object in this collection implements an **`update()` method**. This method contains the logic that defines how the object behaves or changes over a single frame of the game.

- The **game loop**, during each iteration (frame), **traverses the collection of objects and calls the `update()` method on each one**. This gives every active entity a chance to process its behavior for the current frame.

## **When to Use It:**

The Update Method pattern is well-suited for games that:

- Have a **number of objects or systems that need to run simultaneously**.

- Where **each object's behavior is mostly independent of the others**.

- Where the **objects need to be simulated over time**.

- Feature **live entities that the player interacts with**, such as characters, enemies, and interactive elements.

- Even in more abstract games, it can be useful for **updating animations** every frame.

## **Keep in Mind:**

- **State Management:**
    
    Objects need to **store their state** between frames to remember what they were doing and resume their behavior correctly in the next `update()` call. The **State pattern** can be helpful in managing this state.

- **Simulated Concurrency:**

    While the pattern gives the *appearance* of simultaneous behavior, the objects are actually updated sequentially. The **order of updates can be significant** because an object updated earlier in the frame can affect the state that later objects will see during their update. The **Double Buffer pattern** can mitigate issues arising from update order if necessary.

- **Modifying the Object List:**

    Be cautious when **adding or removing objects from the collection while iterating through it** in the game loop. This can lead to skipping updates or other unexpected behavior. Strategies like iterating backwards or deferring modifications until the end of the update loop can address this.

- **Passing Time:**

    While basic implementations assume a fixed time step per update, many games use a **variable time step**. In such cases, the **elapsed time** since the last frame is often passed as a parameter to the `update()` method, allowing objects to adjust their behavior based on the actual time that has passed. This adds complexity but ensures consistent behavior across different hardware.

## **Design Decisions:**

- The most important design decision is **which class the `update()` method belongs to**. Typically, it resides within the class representing the game entity itself. However, in designs using patterns like **Component** or **State**, the `update()` logic might be delegated to a separate component or state object. In such cases, the main entity's `update()` method might simply forward the call to the delegated object.

## **Example:**

Consider a `Skeleton` entity that patrols back and forth and a `Statue` that shoots lightning periodically. Each would have its own `update()` method:

```cpp
class Skeleton : public Entity {
private:
    bool patrollingLeft_;
    double x_;
public:
    Skeleton() : patrollingLeft_(false), x_(0) {}
    void update() override {
        if (patrollingLeft_) {
            x_--;
            if (x_ <= 0) patrollingLeft_ = false;
        } else {
            x_++;
            if (x_ >= 100) patrollingLeft_ = true;
        }
        // Update the visual representation based on x_
    }
};

class Statue : public Entity {
private:
    int frames_;
    int delay_;
public:
    Statue(int delay) : frames_(0), delay_(delay) {}
    void update() override {
        frames_++;
        if (frames_ >= delay_) {
            shootLightning();
            frames_ = 0;
        }
    }
    void shootLightning() {
        // Logic to shoot lightning
    }
};
```

In the main game loop, these objects would be stored in a collection, and their `update()` methods would be called each frame.

## **See Also:**

The Update Method pattern is often used in conjunction with other fundamental game programming patterns:

- **Game Loop:** The Update Method is typically called within the `update()` phase of the game loop.

- **Component:** In an Entity-Component System (ECS) architecture, each component might have an `update()` method, embodying a specific aspect of an entity's behavior.

- **State:** The State pattern can be used within an entity's `update()` method to implement different behaviors based on the entity's current state.

- **Data Locality:** When optimizing performance, especially for a large number of entities, the **Data Locality** pattern can be used to organize the data of these updatable objects in memory for better cache utilization.

The Update Method pattern is a cornerstone of many game engines and provides a clean and organized way to manage the dynamic behavior of game entities over time. Frameworks like Unity (with `MonoBehaviour`), Microsoft's XNA (`Game` and `GameComponent`), and the Quintus JavaScript game engine (on its `Sprite` class) utilize this pattern.