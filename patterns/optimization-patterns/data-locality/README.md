# Data Locality Pattern

📑 [Click here](./data-locality.md) if you wanna read more about this pattern

## Definition

### Gang of Four's definition

The provided sources do not contain a definition of the Data Locality pattern from the Gang of Four's book. Robert Nystrom's book, which introduces this pattern, mentions the classic "Design Patterns" book but presents Data Locality as one of the patterns he has found useful in game programming, distinct from the Gang of Four's catalog.

### Robert Nystrom's definition

**Accelerate memory access by arranging data to take advantage of CPU caching**.

Modern CPUs have caches to speed up memory access. These caches can access memory adjacent to recently accessed memory much quicker. The Data Locality pattern suggests taking advantage of this to improve performance by increasing data locality — keeping data in contiguous memory in the order that you process it.

### AI-generated definition

The Data Locality pattern is an optimization pattern focused on improving performance by **organising data in memory to take advantage of CPU caching**. It aims to reduce the time the CPU spends waiting for data by ensuring that the data being processed is stored contiguously, thus increasing the chance of cache hits when a cache line is loaded. This often involves trade-offs with other software design principles like abstraction and flexibility.

## Use Cases

The primary use case for the Data Locality pattern is **when you have a performance problem** and specifically when that problem is caused by **cache misses**. It should not be applied to infrequently executed code or if the performance issue stems from other reasons.

It is useful in **performance-critical code that touches a lot of data**. The more you can use stuff in a loaded cache line, the faster your program will run.

Specific areas where this pattern, or techniques based on it, can be applied include:
*   Optimising the iteration over a bunch of objects of the same type by packing them together in memory.
*   Splitting data fields within a class into "hot" and "cold" components based on how frequently they are accessed. The hot data, used every frame, stays together, while the cold data, used less frequently, is stored separately, often accessed via a pointer from the hot component.
*   It can influence the overall architecture or be applied as a localized pattern to specific core data structures.

## General Examples

The sources describe the concept using an analogy of an accountant retrieving boxes of papers, likening the office to the CPU and the warehouse to RAM. Fetching a single box (a byte) results in an entire pallet (a cache line) being delivered. The goal is to ensure that the next piece of data needed is likely to be on the pallet already in the office.

A simple example is provided conceptually for optimizing the update loop of game entities. If entity data like position, velocity, and AI state is scattered in memory, iterating through a list of entities and accessing these scattered pieces of data for each one will lead to frequent cache misses.

A more concrete example involves **hot/cold splitting** for an `AIComponent`. The component has fields like `animation_`, `energy_`, and `goalPos_` which are accessed every frame ("hot" data). It also has data about what loot it drops when it dies ("cold" data), which is rarely accessed. To apply hot/cold splitting, you break the data structure into two pieces. The main `AIComponent` holds the hot data, and a separate structure holds the cold data, with the main component holding a pointer to the cold data.

```cpp
// Conceptual structure demonstrating hot/cold splitting
class AIComponentHot {
public:
  void update() { /* ... uses hot data ... */ }

private:
  Animation* animation_;
  double energy_;
  Vector goalPos_;
  AIComponentCold* coldData_; // Pointer to cold data
};

class AIComponentCold {
  // Data used rarely, e.g., only when the entity dies
  LootTable* lootTable_;
  int experiencePoints_;
  // Other cold data...
};
```
*(Note: The provided C++ code snippets in the source are illustrative and kept simple, potentially omitting details not directly relevant to the pattern.)*

## PROS and CONS

**PROS**:
*   **Accelerates memory access** and significantly improves performance by taking advantage of CPU caches.
*   Helps to **reduce CPU stalls** caused by waiting for data from main memory (cache misses).
*   Allows you to **make better use of the entire cache line** fetched from memory.

**CONS**:
*   Often requires **sacrificing abstractions** like inheritance, interfaces, and encapsulation.
*   Results in code that is typically **more complex and less flexible**.
*   Requires **profiling to identify cache-related bottlenecks** before applying the pattern.
*   It is an **optimization pattern** and should only be used when a confirmed performance problem exists due to cache misses.
*   Can be a **complex and time-consuming optimization task** ("somewhere between a black art and a rathole").

## Conclusion

The Data Locality pattern is a performance optimization pattern focused on **how data is arranged in memory**. It is based on the principle that modern CPUs are much faster at processing data than they are at fetching it from main memory, and they benefit greatly from **data being located near other data that will be used soon**. By structuring data so that related items are stored contiguously in memory, the pattern aims to maximise CPU cache utilisation and minimise costly cache misses. Applying this pattern often involves significant **trade-offs** with other software design principles, potentially making code more complex and less abstract in exchange for speed. It is most effectively used in **performance-critical sections of code** only after profiling has identified cache performance as a bottleneck.
