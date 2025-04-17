# Service Locator Pattern

📑 [Click here](./service-locator.md) if you wanna read more about this pattern

## Definition

### Robert Nystrom's definition

**Provide a global point of access to a service without coupling users to the concrete class that implements it**. It **decouples code that needs a service from both who it is (the concrete implementation type) and where it is (how we get to the instance of it)**.

## Use Cases

### use case 1

For systems that are **fundamentally singular, such as an audio device or display system**.

### use case 2

When **plumbing a service through many layers of methods just for a deeply nested call to access it adds unnecessary complexity**.

### use case 3

As a **more flexible and configurable alternative to the Singleton pattern**.

### use case 4

When you want to be able to **swap out different implementations of a service** during development or even at runtime. For example, switching between a real audio system and a null audio system.

### use case 5

To **decorate services** with additional functionality, such as logging, without modifying the original service implementation.

### use case 6

When integrating with a framework that uses the Service Locator pattern, such as the **Unity framework's `GetComponent()` method**.

## General Examples

### Example 1: Simple Locator for Audio Service

description of example

This example shows a basic implementation of a Service Locator for an `Audio` service.

```cpp
class Audio { public:   virtual ~Audio() {}   virtual void playSound(int soundID) = 0;   virtual void stopSound(int soundID) = 0;   virtual void stopAllSounds() = 0; };

class ConsoleAudio : public Audio { public:   virtual void playSound(int soundID)   {     // Play sound using console audio api...   }    virtual void stopSound(int soundID)   {     // Stop sound using console audio api...   }    virtual void stopAllSounds()   {     // Stop all sounds using console audio api...   } };

class Locator { public:   static Audio* getAudio() { return service_; }

    static void provide(Audio* service)   {     service_ = service;   }

private:   static Audio* service_; };

void gameStartup() {
    ConsoleAudio* audio = new ConsoleAudio();
    Locator::provide(audio);
}

void someGameplayCode() {
    Audio* audioSystem = Locator::getAudio();
    audioSystem->playSound(123);
}
```

### Example 2: Locator with a Null Service

description of example

This example demonstrates a Service Locator that defaults to a `NullAudio` service if no real service has been provided, preventing null pointer issues.

```cpp
class NullAudio: public Audio { public:
virtual void playSound(int soundID) { /* Do nothing. */ }   virtual void stopSound(int soundID) { /* Do nothing. */ }   virtual void stopAllSounds()        { /* Do nothing. */ } };

class Locator { public:   static void initialize() { service_ = &nullService_; }

    static Audio& getAudio() { return *service_; }

    static void provide(Audio* service)   {
        if (service == NULL)
        {
            // Revert to null service.
            service_ = &nullService_;
        }
        else
        {
            service_ = service;
        }
    }

private:
    static Audio* service_;
    static NullAudio nullService_; };

void gameStartup() {
    Locator::initialize();
    // We might or might not provide a real audio service here
}

void someGameplayCode() {
    Audio& audioSystem = Locator::getAudio();
    audioSystem.playSound(456); // This will either play a sound or do nothing
}
```

### Example 3: Locator with Logging Decorator

description of example

This example shows how the Service Locator can be used to provide a decorated service, adding logging to the audio system.

```cpp
#include <iostream>

class LoggedAudio : public Audio { public:
    LoggedAudio(Audio* inner) : inner_(inner) {}

    virtual void playSound(int soundID) override {
        std::cout << "Playing sound: " << soundID << std::endl;
        inner_->playSound(soundID);
    }

    virtual void stopSound(int soundID) override {
        std::cout << "Stopping sound: " << soundID << std::endl;
        inner_->stopSound(soundID);
    }

    virtual void stopAllSounds() override {
        std::cout << "Stopping all sounds." << std::endl;
        inner_->stopAllSounds();
    }

private:
    Audio* inner_; };

void enableAudioLogging() {
    // Decorate the existing service.
    Audio* service = new LoggedAudio(Locator::getAudio());

    // Swap it in.
    Locator::provide(service);
}

void gameStartup() {
    Locator::initialize();
    ConsoleAudio* realAudio = new ConsoleAudio();
    Locator::provide(realAudio);
    // Later in the startup process:
    enableAudioLogging();
}

void someGameplayCode() {
    Audio& audioSystem = Locator::getAudio();
    audioSystem.playSound(789);
}
```

## PROS and CONS

**PROS**

- **Decouples code that needs a service from the concrete implementation**.
- Provides a **single, convenient place to control how services are found**.
- Offers **more flexibility than the Singleton pattern** by allowing different implementations to be registered.
- Facilitates **swapping out service implementations**, which can be useful for testing, different platforms, or runtime configuration.
- Enables **decoration of services** with cross-cutting concerns like logging.
- Can be applied to **existing classes not originally designed around it**.
- Using a **null service** ensures that a valid object is always returned, simplifying client code and allowing the game to continue even if a service is not available.
- **Fast and simple** when the service is registered externally, with minimal runtime performance cost.

**CONS**

- **Defers wiring dependencies until runtime**, making it harder to understand dependencies by just reading the code.
- The service might **not be available if not registered**, requiring handling of such failures (though null service mitigates this).
- The service **doesn't know who is using it** because the locator is globally accessible, so the service must be able to function correctly in any context.
- When used poorly, it can inherit all the problems of the **Singleton pattern**.
- Runtime configuration can be **complex and take time** to locate the service, potentially burning CPU cycles.
- If the service is not found and a null service is used, it can be **harder to debug** an unintentionally missing service.
- The locator **depends on outside code** to register the service; if this doesn't happen, it can lead to crashes or mysteriously non-working services.
- Binding to a service at compile time is **fast but doesn't allow easy changes** without recompilation.

## Conclusion

The Service Locator pattern offers a valuable mechanism for **decoupling service consumers from specific implementations** by introducing a central point of access. While it provides significant flexibility and facilitates managing dependencies for widely used services, it's crucial to use it **sparingly** and be aware of its potential drawbacks, particularly regarding deferred dependencies and the global nature of the locator. Employing techniques like a **null service** and carefully considering how services are registered and located can help mitigate some of these challenges. Ultimately, the Service Locator can be a powerful tool for managing complexity in game development when applied thoughtfully.