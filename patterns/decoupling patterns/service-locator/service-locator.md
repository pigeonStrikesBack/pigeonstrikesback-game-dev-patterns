# Service locator

The **Service Locator** pattern provides a **global point of access to a service without coupling users to the concrete class that implements it**. It decouples code that needs a service from both the specific implementation type and the mechanism used to obtain an instance of it.

## Motivation

Certain objects or systems in a game, such as memory allocators, logging, or random number generators, are needed in many parts of the codebase. These can be considered services that the entire game relies on. A better approach than having dependencies scattered everywhere is to use a "phone book" analogy. Code that needs a service can look it up by name and get its current address. When the service "moves" (i.e., its implementation changes), only the "phone book" (the Service Locator) needs to be updated. This provides a single, convenient place to control how services are found.

## Pattern Structure

The Service Locator pattern involves the following key elements:

- **Service Class:** Defines an abstract interface to a set of operations.
- **Concrete Service Provider:** Implements the service interface.
- **Service Locator:** A separate component that provides access to the service by finding an appropriate provider, hiding both the provider's concrete type and the location process.

## When to Use It

The Service Locator pattern should be used **sparingly** because making something accessible globally can lead to problems. However, it can be helpful in the following scenarios:

- For systems that are fundamentally singular, such as an audio device or display system.
- When plumbing a service through many layers of methods just for a deeply nested call to access it adds unnecessary complexity.
- As a more flexible and configurable alternative to the Singleton pattern.

## Keep in Mind (Potential Pitfalls)

- It defers wiring dependencies until runtime, making it **harder to understand dependencies by just reading the code**.
- The service might not be available when needed, requiring handling of such failures.
- The service doesn't know who is using it because the locator is globally accessible, so the service must be able to function correctly in any context.
- When used poorly, it can inherit all the problems of the Singleton pattern with potentially worse runtime performance.

## Implementation and Design Decisions

There are several key design decisions to consider when implementing a Service Locator:

- **How is the service located?**
    - **Outside code registers it:** This involves an external piece of code providing an instance of the service to the locator. This is a common approach in games as it is fast and simple. It also allows control over how the provider is constructed and enables changing the service at runtime. However, it makes the locator dependent on outside initialisation.
    - **Bind to it at compile time:** This uses preprocessor macros to select the service implementation during compilation. This is fast and guarantees service availability but makes it difficult to change the service without recompiling.
    - **Configure it at runtime:** The locator uses runtime mechanisms (like reflection) to find and instantiate the service. While flexible, this approach is complex and can introduce runtime performance costs.

- **What happens if the service can't be located?**
    - **Let the user handle it:** The locator returns NULL if the service is not found, requiring each user to check for failure.
    - **Halt the game:** The locator asserts that the service will be found, stopping the game if it's not. This ensures that a missing service is treated as a bug.
    - **Return a null service:** The locator returns a special object that implements the service interface but does nothing. This allows the game to continue without error handling at each call site. This is a frequently used option.

- **What is the scope of the service?**
    - **Global access:** Anyone can access the service through the locator. This encourages the use of a single service instance but can lead to a loss of control over where and when it's used.
    - **Restricted to a class (and its descendants):** Access to the service is limited to a specific class hierarchy. This controls coupling but can lead to duplicate effort if unrelated classes need the same service.

## Sample Implementation (Simple Locator)

A basic implementation involves a static class (`Locator`) with a static pointer to the service interface (`Audio* service_`) and methods to `provide()` (set the service instance) and `getAudio()` (retrieve the instance).

```cpp
class Locator {
public:
    static Audio* getAudio() { return service_; }

    static void provide(Audio* service) { service_ = service; }

private:
    static Audio* service_;
};
```

## Null Service

A common refinement is to use a **Null Object** as a default service if a real one hasn't been provided. This avoids null pointer issues and simplifies client code.

## Logging Decorator

The Service Locator pattern can be combined with the **Decorator** pattern to add functionality to services, such as logging, without modifying the core service implementation.

## Relationship to Other Patterns

- **Singleton:** The Service Locator is a close relative of Singleton. While Singleton ensures only one instance of a class exists and provides a global access point, the Service Locator offers more flexibility by allowing different implementations of a service to be registered and used.
- **Factory Method:** Hiding the constructor of a Flyweight object behind an interface that first checks for an existing instance is an example of the Factory Method pattern.
- **Dependency Injection:** The technique of outside code providing a dependency to an object that needs it is called dependency injection. The `provide()` method in the Service Locator example uses this.
- **Component:** The Unity framework uses the Service Locator pattern in conjunction with the Component pattern in its `GetComponent()` method.
- **Event Queue:** A Service Locator can be akin to an Event Queue when enqueuing messages without caring which code processes them, as long as it gets processed as expected.

## Usage in Game Engines

Frameworks like Microsoft's XNA have the Service Locator pattern built into their core `Game` class, using a `GameServices` object for registering and locating services. Unity also uses this pattern.

## Conclusion

In summary, the Service Locator pattern offers a way to decouple service consumers from concrete implementations by providing a central point of access. While it offers flexibility and can simplify access to global resources, developers should be mindful of its potential to obscure dependencies and introduce runtime complexities, opting for it judiciously.