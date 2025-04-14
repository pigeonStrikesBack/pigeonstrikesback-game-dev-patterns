# Type Object Pattern
📑 [Click here](type-object.md) if you wanna read more about this pattern

## Definition

### Robert Nystrom's definition

Allow the flexible creation of new “classes” by creating a single class, each instance of which represents a different type of object


## Use Cases

- You need to define a variety of different “kinds” of things
- Baking these kinds into your language’s type system is too rigid
- You don’t know what types you will need up front (For example, what if your game needed to support downloading content that contained new breeds of monsters?)
- You want to be able to modify or add new types without having to recompile or change code

## General Examples

### Example 1: Monster Breeds

This example illustrates how to define different monster breeds using the Type Object pattern.

A Breed class holds the shared data for a type of monster (like starting health and attack string), and the Monster class holds a reference to a Breed object

```cpp
class Breed {
public:
    Breed(int health, const char* attack) : health_(health), attack_(attack) {}

    int getHealth() const { return health_; }
    const char* getAttack() const { return attack_; }

private:
    int health_;
    const char* attack_;
};

class Monster {
public:
    Monster(Breed& breed) : health_(breed.getHealth()), breed_(breed) {}

    const char* getAttack() const { return breed_.getAttack(); }

private:
    int health_; // Current health.
    Breed& breed_;
};

// Creating different monster types using Breed objects
Breed dragonBreed(100, "The dragon breathes fire!");
Breed trollBreed(50, "The troll hits you!");

Monster dragon(dragonBreed);
Monster anotherDragon(dragonBreed);
Monster troll(trollBreed);
```

## PROS and CONS

### PROS

- Allows for the flexible creation of new “classes”

- Enables defining new types at runtime without complicating the codebase

- Lifts a portion of the type system out of the hard-coded class hierarchy into data that can be defined at runtime

- Facilitates sharing data and behaviour across a set of similar objects without a fixed set of hard-coded subclasses

- Allows for modifying or adding new types without having to recompile or change code

### CONS

- The type objects have to be tracked manually
    
    You are responsible for instantiating and keeping breed objects in memory.

- It is harder to define behavior for each type
    
    Instead of overriding methods in subclasses, you typically store data in the type object. Defining type-specific behaviour becomes more challenging

## Conclusion

The Type Object pattern provides a powerful way to introduce flexibility into your system by representing types as objects.

This allows for dynamic creation and modification of types, particularly useful in scenarios where the set of types is not known beforehand or needs to be easily extended.

However, it shifts the responsibility of type management to the application code and can make defining complex, type-specific behaviour more intricate.

This pattern is especially beneficial when data drives the definition of different object categories, offering a more maintainable and extensible approach compared to a deeply nested class hierarchy

