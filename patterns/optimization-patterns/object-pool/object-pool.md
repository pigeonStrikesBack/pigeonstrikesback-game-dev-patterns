# Object Pool pattern:

The Object Pool pattern is listed as one of the **Optimization Patterns** in Robert Nystrom's book *Game Programming Patterns*,.

## Intent

The intent of the Object Pool pattern is to **avoid unnecessary allocation or resource acquisition costs by reusing objects from a collection**,. It aims to provide the ability to freely create and destroy objects without the performance penalty of actual memory management for each instance,,.

## Motivation

The pattern is motivated by the challenges associated with dynamic memory management, particularly in performance-critical applications like games,. Frequently creating and destroying objects on the heap can be slow, lead to **memory fragmentation**,, and potentially cause allocations to fail or the game to crash during prolonged play (as seen in "soak tests"). Acquiring other resources encapsulated by an object, such as database or network connections, can also be expensive.

An object pool offers "the best of both worlds" by allocating a large chunk of memory upfront,, addressing the memory manager's concerns about fragmentation and frequent calls. Simultaneously, it gives users the convenient illusion of freely creating and destroying objects.

## The Pattern

The Object Pool pattern defines a **pool class** that manages a collection of reusable objects.

1.  Each object within the pool supports an **"in use" query** to indicate if it is currently active.
2.  When the pool is initialised, it **creates the entire collection of objects upfront**. This is often done in a single contiguous allocation,.
3.  All objects in the newly created collection are initially set to the **"not in use" state**.
4.  When a "new" object is requested, the pool **finds an available object** from its collection,,.
5.  The found object is then **initialised** for its new purpose, and its state is set to **"in use"**. The pool returns this object to the requester.
6.  When an object is no longer needed, it is **set back to the "not in use" state**.

This approach allows objects to be created and destroyed functionally, but without triggering actual memory allocation or deallocation for each instance.

## When to Use It

The Object Pool pattern is used widely in games. Apply it when:

- You need to **frequently create and destroy objects**.
- The objects are **similar in size**, although strategies exist to handle varying sizes,.
- Allocating objects on the heap using standard methods (`new` and `delete`) is **slow or could lead to memory fragmentation**.
- Each object **encapsulates a resource** that is expensive to acquire but can be reused, like database or network connections.
- Common use cases include game entities, visual effects, and currently playing sounds.

## Keep in Mind

Using an object pool means you are taking on the responsibility of memory management yourself, rather than relying on the system's default mechanisms. This comes with several limitations:

- **The pool may waste memory** on objects that are allocated but never needed if the pool size is too large. Tuning the pool size is important.
- There is a **fixed number of objects** that can be active simultaneously, equal to the pool's size.
- Attempts to create a new object may **fail if the pool is full**,. Strategies include tuning pool sizes to prevent this, returning `NULL` or an error indicator,.
- If objects have **varying sizes**, memory can be wasted because each slot must accommodate the largest possible object. This can be mitigated by splitting the pool into multiple pools for different object sizes.
- **Reused objects are not automatically cleared** like memory returned by standard allocators. You lose the debugging safety net that might overwrite freed memory with magic values. Special care must be taken to fully initialise reused objects. Adding a debug feature to clear memory on reclamation is recommended.
- In systems with garbage collection, **unused pooled objects remain in memory**, potentially holding references to other objects and preventing the garbage collector from reclaiming them. References within a pooled object should be cleared when it is no longer in use.

## Sample Code / Techniques (Described)

The sample code section- focuses on a particle system as an example of an object pool.

- A simple pool can use a fixed-size array of `Particle` objects and an integer count of active particles,. The `create()` function iterates through the array to find the first available particle,. This naive search has **O(n) complexity** for creation.
- A more efficient technique is to use a **free list**,.
    - This avoids iterating to find an available object.
    - Instead of a separate list of pointers (which would use extra memory), the free list **cannibalises the memory of unused objects** themselves,.
    - Unused objects store a pointer (`next_`) to the next available object,, forming a linked list.
    - The pool only needs to store a pointer to the `firstAvailable_` particle (the head of the free list).
    - The pool's constructor initialises this free list, linking all particles in the array.
    - Creating a particle involves taking the one pointed to by `firstAvailable_` and updating `firstAvailable_` to the next one in the list.
    - This results in **constant-time (O(1)) creation and deletion**.
- The sample `ParticlePool::animate()` method is noted as an example of the **Update Method pattern**.

## Design Decisions

Implementing an object pool involves several design choices:

- **Are objects coupled to the pool?**
    - **Yes:** Simplifies the pool implementation, allows the pool to enforce object creation (e.g., using C++ `friend` and private constructors), and may allow avoiding a separate "in use" flag by querying object state directly.
    - **No:** The pool can be more generic and pool objects of any type. However, the "in use" state must be tracked externally, such as with a separate boolean array.
- **What is responsible for initialising reused objects?**
    - **The pool internally:** Encapsulates the objects within the pool class, making it harder for outside code to hold stale references. The pool's interface becomes tied to the ways objects can be initialised.
    - **The caller externally:** The pool's interface can be simpler, potentially just returning a pointer or reference to an available object. The caller then calls the appropriate initialisation methods on the returned object. The caller must also handle the potential failure to get an object if the pool is full,.

## See Also

- **Flyweight:** Object Pool is noted as looking similar to the Flyweight pattern as both maintain reusable object collections. However, the distinction is in the meaning of "reuse": Flyweight shares the *same instance simultaneously* across multiple owners to save memory; Object Pool reuses objects *over time* by reclaiming memory after an object's previous owner is done with it, with no expectation of simultaneous sharing within its lifetime.
- **Update Method:** The sample code explicitly links the pool's `animate()` method to the Update Method pattern.
- **Data Locality:** While not explicitly listed in the "See Also" for Object Pool, the Data Locality chapter uses the Particle System object pool example to illustrate arranging data contiguously in memory for cache efficiency,,.
