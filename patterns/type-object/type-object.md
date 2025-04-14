# Type Object Pattern Summary

## Definition

The intent of the Type Object pattern is to allow the flexible creation of new “classes” by creating a single class, each instance of which represents a different type of object

> Robert Nystrom explains that with this pattern, a single Breed class can contain information shared between all monsters of the same breed, and each Monster instance holds a reference to a Breed object, which defines its "type"

## Motivation

The typical object-oriented approach of creating a subclass for every different type of entity (like monster breeds) can lead to a large and rigid class hierarchy

Adding new types then requires adding new code and recompiling.

The Type Object pattern addresses this by lifting the definition of a "type" out of the hard-coded class hierarchy into data that can be defined at runtime, even by designers without programmer intervention.

This allows for sharing attributes between many objects without a fixed set of hard-coded subclasses


## How it Works

1. Define a type object class (e.g. Breed)
    
    that holds data and/or behaviour that should be shared across all instances of a particular conceptual type
    
    Each instance of this type object class represents a different logical type

2. Define a typed object based class (e.g. Monster)
    
    that stores a reference to an instance of the type object class

3. Instance-specific data is stored in the typed object instance

    Shared data or behaviour is accessed through the reference to the type object
    
This allows objects referencing the same type object to function as if they were the same type


## Use Cases

This pattern is useful when:

- You need to define a variety of different "kinds" of things.

- Baking these kinds into the language's type system is too rigid.

- You don't know what types you will need up front (e.g., for downloadable content)

- You want to modify or add new types without recompiling or changing code

### Keep in Mind

- **Type objects have to be tracked manually**
    
    Unlike compiler-managed classes, you are responsible for instantiating and managing the lifecycle of type object instances

- It **can be harder to define behaviour** for each type
    
    Instead of overriding methods in subclasses, you typically store data in the type object. For more complex type-specific behaviour, you might need to consider patterns like Interpreter or Bytecode to define behaviour in data

- There is a **risk of duplicated effort** if no inheritance mechanism is implemented for type objects, as designers might have to repeat common attributes across many type definitions

    Implementing inheritance for type objects (single or multiple) can mitigate this


# Design Decisions
Key design considerations include

- Is the type object encapsulated or exposed?
    
    Encapsulating it hides the complexity but might require forwarding methods. Exposing it allows direct interaction but widens the API


- How are typed objects created?

    You can construct the object and pass in the type object, or call a "constructor" function on the type object


- Can the type change?
    
    Allowing the type to change offers flexibility but introduces complexity in ensuring the object's state is valid for the new type

- What kind of inheritance is supported for type objects?
    
    Options range from no inheritance (simple but can lead to duplication) to single inheritance (a good balance) to multiple inheritance (powerful but complex)

## Relation to Other Patterns

- The Type Object pattern addresses a similar high-level problem of sharing data and behaviour as the **Prototype pattern**, but in a different way

- It is a close cousin to **Flyweight**, as both allow sharing data across instances.
    
    However, Flyweight focuses on memory saving, while Type Object emphasizes organization and flexibility

- There is a lot of similarity with the **State pattern**,
    
    as both involve an object delegating part of what defines it to another object. Type Object typically delegates invariant data, while State delegates temporal data describing the current configuration

## Conclusion

By using the Type Object pattern, you can create a more flexible and data-driven system for defining different categories of objects in your game or software, allowing for easier content creation and modification.