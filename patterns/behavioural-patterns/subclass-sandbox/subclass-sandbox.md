# Subclass Sandbox

## Definition

The intent of the Subclass Sandbox pattern is to define behaviour in a subclass using a set of operations provided by its base class

## Motivation

Imagine a game with many different superpowers. Implementing each as a separate subclass could lead to:

- Redundant code if different powers perform similar actions like playing sounds or spawning effects in the same way

- Difficulty in enforcing invariants across all superpowers, such as ensuring all audio is properly queued

- Tight coupling between the superpower subclasses and various game systems

The Subclass Sandbox pattern addresses these issues by providing a controlled environment for implementing the behaviour of these subclasses

## How it Works
1. A base class (e.g., Superpower) defines an abstract protected sandbox method
    
    e.g. `activate()`
    that subclasses must implement

2. The base class also provides a set of protected operations

    e.g. `move()`, `playSound()`, `spawnParticles()`
    that the subclasses can call within their sandbox method

3. To create a new behaviour, a subclass inherits from the base class and implements the sandbox method using the provided operations

This approach ensures that the subclass behaviour is constrained to the operations offered by the base class, limiting its direct interaction with other parts of the system

## Use Cases

The Subclass Sandbox pattern is a good fit when


- You have a base class with a number of derived classes

- The base class can provide all the necessary operations for the derived classes
There is behavioural overlap in the subclasses, and you want to facilitate code sharing

- You aim to minimise coupling between the derived classes and the rest of the program.

### Keep in Mind

This pattern can lead to a shallow but wide class hierarchy

- There's a risk of the base class becoming tightly coupled to many different game systems as it provides more operations
    
    *This is known as the [**brittle base class**](https://en.wikipedia.org/wiki/Fragile_base_class) problem*

- However, it can result in the derived classes being more isolated and easier to maintain

If the base class becomes too large, consider using the Component pattern to break down responsibilities

## Design Decisions

Key design considerations include:

- What operations should be provided?
    
    Balancing providing enough functionality with avoiding excessive coupling in the base class is crucial

- Should methods be provided directly or through objects?
    
    Providing operations through auxiliary classes can reduce the number of methods in the base class and lower coupling

- How does the base class get the state it needs? Options include:
    
    - passing state through the constructor (which can expose derived classes to unnecessary details)
    
    - two-stage initialisation
    
    - or making the state static (for shared, singleton-like state)

## Relation to Other Patterns

The Subclass Sandbox pattern can be seen as a variation of the [Facade pattern](https://it.wikipedia.org/wiki/Fa%C3%A7ade_pattern), where the base class acts as a facade hiding the complexities of the game engine from its subclasses

By using the Subclass Sandbox pattern, you can create a more organised and maintainable system for defining varied behaviours within a game or other software by providing a safe and controlled set of tools to the developers of those behaviours.