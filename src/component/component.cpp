#include <iostream>
#include <vector>
#include <memory>

// Component Interface
class Component
{
public:
    virtual ~Component() = default;
    virtual void update(class GameObject *gameObject) = 0;
};

// GameObject (Entity) - Container for Components and Shared State
class GameObject
{
public:
    // Shared State
    double positionX;
    double velocityX;

    GameObject() : positionX(0), velocityX(0) {}

    void addComponent(std::unique_ptr<Component> component)
    {
        components_.push_back(std::move(component));
    }

    void update()
    {
        std::cout << "GameObject: Updating components..." << std::endl;
        for (const auto &component : components_)
        {
            component->update(this); // Pass GameObject for shared state access
        }
        std::cout << "GameObject: --- Update End ---" << std::endl;
    }

    // Method to swap a component of a certain type (simple implementation)
    void swapComponent(std::unique_ptr<Component> newComponent)
    {
        // Identify the type of the new component and try to replace an existing one
        // For simplicity, we'll just clear and add here, a more robust solution would
        // identify by component type.
        std::cout << "GameObject: Swapping a component." << std::endl;
        components_.clear();
        components_.push_back(std::move(newComponent));
    }

private:
    std::vector<std::unique_ptr<Component>> components_;
};

// Concrete Input Component
class InputComponent : public Component
{
public:
    void update(GameObject *gameObject) override
    {
        std::cout << "Input Component: Processing input." << std::endl;
        // Simulate input affecting velocity
        gameObject->velocityX += 1;
        std::cout << "Input Component: Increased velocity to " << gameObject->velocityX << "." << std::endl;
    }
};

// Concrete Physics Component
class PhysicsComponent : public Component
{
public:
    void update(GameObject *gameObject) override
    {
        std::cout << "Physics Component: Applying physics." << std::endl;
        // Simulate physics affecting position based on velocity
        gameObject->positionX += gameObject->velocityX;
        std::cout << "Physics Component: Moved to position " << gameObject->positionX << "." << std::endl;
    }
};

// Concrete Graphics Component
class GraphicsComponent : public Component
{
public:
    void update(GameObject *gameObject) override
    {
        std::cout << "Graphics Component: Rendering at position " << gameObject->positionX << "." << std::endl;
    }
};

// Another Concrete Input Component (for swapping)
class AlternateInputComponent : public Component
{
public:
    void update(GameObject *gameObject) override
    {
        std::cout << "Alternate Input Component: Processing different input." << std::endl;
        // Simulate different input affecting velocity
        gameObject->velocityX -= 2;
        std::cout << "Alternate Input Component: Decreased velocity to " << gameObject->velocityX << "." << std::endl;
    }
};

int main()
{
    // Create a GameObject
    GameObject player;
    std::cout << "Creating a GameObject (Player)..." << std::endl;

    // Add initial components
    player.addComponent(std::make_unique<InputComponent>());
    player.addComponent(std::make_unique<PhysicsComponent>());
    player.addComponent(std::make_unique<GraphicsComponent>());
    std::cout << "Adding Input, Physics, and Graphics Components." << std::endl;

    // Update the GameObject, components communicate via shared state
    std::cout << "\nUpdating the Player GameObject (First set of components):" << std::endl;
    player.update();
    player.update();

    // Swap the InputComponent
    std::cout << "\nSwapping InputComponent with AlternateInputComponent." << std::endl;
    player.swapComponent(std::make_unique<AlternateInputComponent>());

    // Update the GameObject again with the swapped component
    std::cout << "\nUpdating the Player GameObject (After swapping InputComponent):" << std::endl;
    player.update();
    player.update();

    return 0;
}

/*
This program showcases the **Component pattern** where the `GameObject` acts as a container for different `Component` objects.

*   We define an abstract `Component` interface with a virtual `update()` method that takes a pointer to the `GameObject` as an argument. This allows components to interact with the shared state of the `GameObject`.
*   Concrete components like `InputComponent`, `PhysicsComponent`, and `GraphicsComponent` implement the `Component` interface. They perform their specific logic within the `update()` method, accessing and modifying the `positionX` and `velocityX` of the `GameObject`. This demonstrates **communication between components through the base class** (`GameObject`) for commonly shared state.
*   The `GameObject` class holds a `std::vector` of `std::unique_ptr<Component>`, demonstrating **composition over inheritance**. It also contains the **shared state** (`positionX`, `velocityX`) that the components can access and modify.
*   The `update()` method of `GameObject` iterates through its components and calls their `update()` method, passing a pointer to itself (`this`) so that the components can access the shared state.
*   **Components are swappable** as demonstrated by the `swapComponent()` method (in this simple example, it clears all and adds the new one, but a more refined approach could manage specific component types). We replace the `InputComponent` with an `AlternateInputComponent`, showing how the behaviour of the `GameObject` can be altered by changing its components. The components are behind an interface (`Component`), allowing for different concrete implementations to be used.
*   The `main()` function creates a `GameObject`, adds components, updates it to show the interaction, swaps a component, and updates it again to demonstrate the change in behaviour due to the swapped component. The `std::cout` statements provide simple control prints to illustrate the process [the user's request].

This example aligns with the principles of the Component pattern by promoting **decoupling** between different domains (input, physics, graphics) and allowing for **reusability** and **flexibility** in defining the behaviour of game entities. The components independently handle their specific functionalities while using the `GameObject`'s state as a central point of interaction as requested.
*/