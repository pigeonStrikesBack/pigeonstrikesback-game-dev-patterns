# Object Pool Pattern

📑 [Click here](./object-pool.md) if you wanna read more about this pattern

## Definition

### Gang of Four's definition

The provided sources do not contain a definition of the Object Pool pattern from the Gang of Four's book. Robert Nystrom's book, which introduces this pattern, covers some patterns from the classic "Design Patterns" book but presents Object Pool as one of the patterns he has found useful in game programming.

### Robert Nystrom's definition

This pattern defines a **pool class that maintains a collection of reusable objects**. Each object supports an "in use" query to tell if it is currently "alive". When the pool is initialized, it **creates the entire collection of objects up front** (usually in a single contiguous allocation) and initializes them all to the "not in use" state. When you want a new object, you ask the pool for one, which finds an available object, initializes it to "in use", and returns it. When the object is no longer needed, it is set back to the "not in use" state. This way, objects can be freely created and destroyed **without needing to allocate memory or other resources**.

### AI-generated definition

The Object Pool pattern is a memory management technique where a **fixed-size collection of objects is pre-allocated** at the start of a program or system. Instead of creating new objects and destroying them frequently on the heap, clients request an object from the pool. The pool provides an existing, unused object and marks it as "in use". When the object is no longer needed, it is returned to the pool and marked as "not in use," making it available for later reuse. This pattern is primarily used to **avoid the performance overhead and potential fragmentation issues associated with frequent dynamic memory allocation and deallocation**, especially in scenarios requiring high performance like games.

## Use Cases

Use Object Pool when:
*   You need to **frequently create and destroy objects**.
*   Objects are **similar in size**.
*   **Allocating objects on the heap is slow** or could lead to **memory fragmentation**.
*   Each object encapsulates a resource such as a database or network connection that is **expensive to acquire and could be reused**.

This pattern is used widely in games for obvious things like game entities and visual effects. It is also used for less visible data structures such as currently playing sounds. A specific example given is a `ParticleSystem` which is an object pool custom built for a single type of object.

## General Examples

### Example 1: Particle System Pool

A common use case for the Object Pool pattern in games is managing visual effects like particles. Creating and destroying particles frequently can be slow and cause memory fragmentation. An object pool provides a fixed-size array of `Particle` objects that can be reused.

First, we define a simple `Particle` class that includes an `inUse()` method to check if the particle is active:

code (👆 click here to show)
```cpp
class Particle {
public:
  // Particle data (position, velocity, lifetime, etc.)
  // ...

  bool inUse() const { return framesLeft_ > 0; } // Example check

  void init(/* ... particle state ... */) {
    // Initialize particle state
    // ...
    framesLeft_ = lifetime_; // Example initialization
  }

  void animate() {
    if (inUse()) {
      // Update particle physics, animation, etc.
      // ...
      framesLeft_--; // Decrease lifetime
    }
  }

private:
  int framesLeft_; // Example state to track if in use
  // Other particle fields...
};
```

Next, we define the `ParticlePool` class, which holds a fixed-size array of `Particle` objects:

code (👆 click here to show)
```cpp
class ParticlePool {
public:
  ParticlePool() : particles_ {} {} // Simple constructor

  void create(double x, double y,
              double xVel, double yVel, int lifetime); // Function to create a new particle

  void animate() { // Method to animate all active particles
    for (int i = 0; i < POOL_SIZE; i++) {
      particles_[i].animate();
    }
  }

private:
  static const int POOL_SIZE = 100; // Fixed size of the pool
  Particle particles_[POOL_SIZE]; // The array of particles
};
```

The `create` function is responsible for finding an available particle in the pool and initializing it:

code (👆 click here to show)
```cpp
void ParticlePool::create(double x, double y,
                          double xVel, double yVel,
                          int lifetime) {
  // Find an available particle.
  for (int i = 0; i < POOL_SIZE; i++) {
    if (!particles_[i].inUse()) { // Check if the particle is not in use
      particles_[i].init(x, y, xVel, yVel, lifetime); // Initialize the particle
      return; // Found one, done
    }
  }
  // If the loop finishes, no available particles were found.
  // In this simple example, we just don't create a particle.
}
```

When a particle's `animate` method reduces its `framesLeft_` to zero, it becomes "not in use" and is available to be reused by a subsequent call to `create`. The `animate` method of the pool simply iterates over all particles and calls their individual `animate` methods. This avoids the overhead of dynamic allocation and deallocation for each particle throughout the game loop.

An optimization for finding an available particle more quickly is to use a **free list**, which is a linked list that chains together all the unused particles within the pool's memory. This allows finding an available object in constant time, `O(1)`, instead of iterating through the array.

## PROS and CONS

**PROS**:
*   **Avoids performing costly allocation and deallocation** of objects on the heap repeatedly.
*   Can **prevent memory fragmentation**, which can occur with frequent heap operations.
*   Allows for **efficient reuse of expensive resources** encapsulated by objects.
*   Can be used to **limit the number of active objects** of a certain type, helping manage memory usage and performance.
*   Often stores objects contiguously in memory (e.g., in an array), which can improve **data locality** and cache performance when iterating over objects.

**CONS**:
*   **Adds code complexity** compared to using standard allocation/deallocation (like `new` and `delete`).
*   The **pool may waste memory** if the chosen size is larger than the maximum number of objects needed at any given time.
*   Allows **only a fixed number of objects to be active** at any one time; attempting to create an object when the pool is full requires a handling strategy (e.g., failing to create, recycling the oldest object).
*   Can waste memory if the pooled objects vary significantly in size, as each slot must accommodate the largest possible object.
*   **Reused objects are not automatically cleared**; you lose the debug features of memory managers (like setting to `0xdeadbeef`), increasing the risk of bugs from uninitialized variables if initialization code is incomplete.
*   If used with a garbage collector, **unused objects remaining in the pool can prevent the collector from reclaiming other objects** they reference; requires manually clearing references when an object is returned to the pool.
*   Implementing optimisations like a free list for fast allocation adds further complexity.
*   The pattern requires **manual responsibility for memory handling**, which is normally managed automatically by the system or language.

## Conclusion

The Object Pool pattern is an **optimization pattern** primarily used in performance-critical applications like games to manage memory efficiently. It works by **pre-allocating a fixed collection of objects** and reusing them instead of constantly allocating and deallocating memory on the heap. This helps **avoid the performance costs and fragmentation** associated with frequent dynamic memory operations. It is particularly useful for objects that are frequently created and destroyed and are similar in size. While powerful for performance and resource management, implementing an Object Pool adds complexity and requires careful consideration of its fixed size, handling initialization, and potential memory waste or issues with garbage collection.
