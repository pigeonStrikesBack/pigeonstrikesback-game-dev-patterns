# Subclass Sandbox Pattern

[Click here](subclass-sandbox.md) if you wanna read more about this pattern

Original [book chapter](#)

## Definition

## Robert Nystrom's definition

Define behaviour in a subclass using a set of operations provided by its base class

## Use Cases

The Subclass Sandbox pattern is a good fit when:

You have a base class with a number of derived classes


The base class is able to provide all of the operations that a derived class may need to perform


There is behavioural overlap in the subclasses and you want to make it easier to share code between them


You want to minimise coupling between those derived classes and the rest of the program


You have a non-virtual protected method laying around

## General Examples

### Example 1: Basic Superpower Implementation

description of a basic superpower using the provided operations.

```cpp
class Superpower {
public:
    virtual ~Superpower() {}

protected:
    virtual void activate() = 0;

    void move(double x, double y, double z) {
        // Code here...
    }

    void playSound(SoundId sound, double volume) {
        // Code here...
    }

    void spawnParticles(ParticleType type, int count) {
        // Code here...
    }
};

class SkyLaunch : public Superpower {
protected:
    virtual void activate() {
        // Spring into the air.
        playSound(SOUND_SPROING, 1.0f);
        spawnParticles(PARTICLE_DUST, 10);
        move(0, 0, 20);
    }
};
```

## PROS and CONS

### PROS

- Facilitates code sharing between subclasses by providing operations in the base class

- Helps to minimise coupling between the derived classes and the rest of the program, as subclasses only couple to their base class

- Provides a controlled environment for implementing subclass behaviour through the defined operations

- Makes it clear where subclass-specific behaviour should be implemented through the abstract sandbox method

### CONS

- Can lead to a large base class that accretes more and more code over time

- The base class itself can become tightly coupled to various game systems as it provides more operations

- If the base class becomes too large, it might become a "giant bowl of code stew"

## Conclusion

The Subclass Sandbox pattern offers a straightforward way to define varied behaviours in subclasses by providing a set of controlled operations in the base class.

It promotes code reuse and reduces coupling of subclasses to the broader system. However, care must be taken to manage the growth and coupling of the base class to avoid it becoming unwieldy.

Considering alternative patterns like the Component pattern might be necessary if the base class becomes too complex.
