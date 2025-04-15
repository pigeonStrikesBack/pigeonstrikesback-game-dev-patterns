```markdown
# Component Pattern

📑 [Click here](./component.md) if you wanna read more about this pattern

## Definition

### Robert Nystrom's definition

**Allow a single entity to span multiple domains without coupling the domains to each other**. **The entity is reduced to a simple container of components**.

## Use Cases

*   The Component pattern is useful when **you have a class that touches multiple domains which you want to keep decoupled from each other**. For example, separating user input handling, physics, and rendering for a game entity.
*   It can be used when **a class is getting massive and hard to work with**, by breaking down its responsibilities into separate components.
*   The pattern is beneficial when **you want to be able to define a variety of objects that share different capabilities, but using inheritance doesn’t let you pick the parts you want to reuse precisely enough**. This allows for more flexible composition of object behaviour.
*   Components can be used to create different kinds of game objects by picking and choosing components, like building different objects by selecting parts. Examples include decorations, props, and zones in a game world, which can be created by combining different components.

## General Examples

### Example 1: A Game Entity with Components

A game entity, like a character in a game, can be composed of several components, each responsible for a specific aspect of its behaviour or data. For example, a baker character 'Bjørn' might have an `InputComponent` to handle user input, a `PhysicsComponent` to manage movement and collisions, and a `RenderComponent` to draw it on the screen. These components can operate independently.

### Example 2: Reusing Components

Components are reusable packages. For instance, the `PhysicsComponent` used for Bjørn could potentially be reused for other interactive objects in the game world. Similarly, different types of input handling (e.g., for player control vs. AI control) can be implemented as different `InputComponent` implementations and easily swapped.

## PROS and CONS

PROS

*   **Decoupling:** The Component pattern helps to **keep different domains within an entity isolated from each other**. Changes in one component are less likely to affect others.
*   **Reusability:** Components are **reusable across different entities**. This avoids code duplication and promotes modular design.
*   **Flexibility and Composition:** It allows for **flexible creation of new object types by combining different components**. You can easily add or remove capabilities from an entity by adding or removing components.
*   **Reduced Complexity in Entities:** The entity class itself becomes a **simple container of components**, reducing its size and complexity.
*   **Improved Organisation:** It helps to **organise code** by separating concerns into distinct components.

CONS

*   **Increased Complexity:** Introducing components can **add complexity** compared to a monolithic class structure. You need to manage the creation, initialisation, and interaction of multiple component objects.
*   **Communication Challenges:** **Communication between components can become more challenging**. Different strategies for component communication (e.g., modifying container state, direct references, messaging) need to be considered and implemented.
*   **Potential for Over-Engineering:** There's a risk of **over-engineering** if components are introduced for simple cases where a straightforward class design would suffice.
*   **Debugging Can Be Harder:** Understanding the behaviour of an entity might require inspecting multiple component classes instead of a single one, potentially making **debugging more difficult**.
*   **Memory Management:** Controlling how components occupy memory can be more complex.

## Conclusion

The **Component pattern is a powerful design pattern for creating flexible and maintainable entities by decoupling different aspects of their behaviour and data into separate, reusable components**. It favours **composition over inheritance**, allowing for a more dynamic and adaptable object model. While it introduces some complexity in managing these components and their communication, the benefits of **decoupling, reusability, and flexibility** often make it a valuable tool in game development and other software domains. Frameworks like Unity are built around the concept of components, highlighting its practical significance.
```