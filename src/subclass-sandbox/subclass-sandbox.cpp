#include <iostream>
#include <string>

// Forward declaration for a hypothetical game-related enum
enum class InteractionType {
    NONE,
    SPEAK,
    MOVE,
    USE_ITEM
};

// **Base Class: InteractiveObject**
// This class defines the structure for interactive objects in our system.
// It implements the Subclass Sandbox pattern.
class InteractiveObject {
public:
    virtual ~InteractiveObject() {}

protected:
    // **Sandbox Method: performInteraction**
    // This is an abstract protected method that derived classes MUST implement.
    // It defines the specific interaction behaviour for each type of object. [1, 2]
    virtual void performInteraction(InteractionType type) = 0;

    // **Provided Operation: sendMessage**
    // This protected method allows subclasses to send a message.
    // It centralizes the message sending functionality. [1, 3]
    void sendMessage(const std::string& message) {
        std::cout << "[Object]: " << message << std::endl;
    }

    // **Provided Operation: changePosition**
    // This protected method allows subclasses to simulate a change in position.
    // It provides a controlled way for objects to indicate movement. [1, 3]
    void changePosition(double x, double y) {
        std::cout << "[Object]: Moving to (" << x << ", " << y << ")" << std::endl;
    }

    // **Provided Operation: useObject**
    // This protected method simulates the usage of another generic object.
    // It demonstrates how the base class can provide higher-level actions. [4]
    void useObject(const std::string& itemName) {
        std::cout << "[Object]: Attempting to use item: " << itemName << std::endl;
        // In a real system, this might trigger further events or logic.
    }
};

// **Derived Class: Character**
// This class represents a character that can interact with the environment.
// It implements the performInteraction sandbox method using the provided operations. [4]
class Character : public InteractiveObject {
public:
    virtual void performInteraction(InteractionType type) override {
        std::cout << "Character is trying to interact with type: ";
        switch (type) {
            case InteractionType::SPEAK:
                sendMessage("Hello there!");
                break;
            case InteractionType::MOVE:
                changePosition(1.0, 0.5);
                break;
            case InteractionType::USE_ITEM:
                useObject("Key");
                break;
            case InteractionType::NONE:
            default:
                sendMessage("Character has no interaction.");
                break;
        }
        std::cout << "Character interaction complete." << std::endl;
    }
};

// **Derived Class: Door**
// This class represents a door that reacts to interactions.
// It also implements the performInteraction sandbox method with its own specific behaviour. [4]
class Door : public InteractiveObject {
public:
    virtual void performInteraction(InteractionType type) override {
        std::cout << "Door is being interacted with type: ";
        switch (type) {
            case InteractionType::USE_ITEM:
                sendMessage("The door seems to react to an item...");
                break;
            case InteractionType::MOVE:
                sendMessage("The door doesn't move on its own.");
                break;
            case InteractionType::SPEAK:
                sendMessage("The door remains silent.");
                break;
            case InteractionType::NONE:
            default:
                sendMessage("The door awaits interaction.");
                break;
        }
        std::cout << "Door interaction complete." << std::endl;
    }
};

int main() {
    std::cout << "Demonstrating the Subclass Sandbox pattern:" << std::endl;

    Character playerCharacter;
    std::cout << "\nCharacter interacting..." << std::endl;
    playerCharacter.performInteraction(InteractionType::SPEAK);
    playerCharacter.performInteraction(InteractionType::MOVE);
    playerCharacter.performInteraction(InteractionType::USE_ITEM);
    std::cout << "--------------------" << std::endl;

    Door woodenDoor;
    std::cout << "\nDoor being interacted with..." << std::endl;
    woodenDoor.performInteraction(InteractionType::USE_ITEM);
    woodenDoor.performInteraction(InteractionType::MOVE);
    woodenDoor.performInteraction(InteractionType::SPEAK);
    std::cout << "--------------------" << std::endl;

    return 0;
}

/*
**Design Choices Made:**

1.  **What operations should be provided?** [5]
    *   We chose to provide `sendMessage()`, `changePosition()`, and `useObject()` as **protected concrete methods** in the `InteractiveObject` base class [1].
    *   This represents a **middle ground** in the spectrum of provided operations [6]. The base class provides some common functionalities related to interaction, but derived classes could potentially interact with other systems directly if needed (although our example doesn't show this to keep it simple).
    *   The provided operations aim to be **relatively high-level** in the context of object interaction [4]. For instance, `changePosition()` encapsulates the idea of an object moving without exposing the underlying physics or movement system.

2.  **Should methods be provided directly, or through objects that contain them?** [7]
    *   We chose to provide the methods **directly within the `InteractiveObject` base class** [7, 8].
    *   This keeps the example simple and avoids the added complexity of introducing separate "player" or "interaction" objects accessed via the base class. In a more complex scenario, if the number of provided operations grew significantly, using separate helper objects (as suggested by the source [8]) would be a better design choice to maintain the base class's manageability.

3.  **The Sandbox Method:**
    *   We defined `performInteraction(InteractionType type)` as the **abstract protected sandbox method** [1, 2, 9]. This clearly defines where the specific interaction logic for each derived class must reside [2]. The use of `protected` signifies that this method is intended for implementation by subclasses [1].

4.  **Scope of Coupling:**
    *   The derived classes (`Character` and `Door`) are **only coupled to the `InteractiveObject` base class** and the `InteractionType` enum in their `performInteraction()` implementations [6]. They use the provided operations of the base class to define their behaviour. This minimizes their direct coupling to other parts of a larger hypothetical game system [4]. The coupling to the underlying game systems (like a message queue or a physics engine, if `sendMessage()` or `changePosition()` were fully implemented) is encapsulated within the `InteractiveObject` base class [10].

5.  **Simplicity:**
    *   We aimed for a **simple and clear demonstration** of the pattern [9, 11]. The provided operations are basic, and the derived classes have straightforward implementations of the sandbox method. This makes the core concept of the Subclass Sandbox pattern easier to understand [12].
*/
