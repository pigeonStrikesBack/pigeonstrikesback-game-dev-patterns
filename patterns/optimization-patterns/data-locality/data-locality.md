# Data Locality

The Data Locality pattern is one of the **Optimization Patterns** discussed in Robert Nystrom's book. It is described as a mid-level pattern often used to speed up a game.

## Intent
The pattern's intent is to **accelerate memory access by arranging data to take advantage of CPU caching**.

## Motivation-
The motivation behind this pattern stems from the discrepancy between CPU processing speed and memory access speed. While CPUs have become significantly faster over the years, the rate at which data can be fetched from main memory has not kept pace. When the CPU needs data that is not in its cache (a "cache miss"), it stalls, waiting for the data to be fetched from slower memory. This wait can be hundreds of cycles long.

The way data is organized in memory directly impacts performance because of caching. When the CPU reads some memory, it typically fetches a whole cache line (a block of adjacent memory). The more useful data packed into that cache line, the more efficiently the CPU can work. Therefore, the goal is to **organize data structures so that the things being processed are next to each other in memory**, increasing data locality.

## The Pattern
The pattern leverages the fact that modern CPUs have caches that can access memory adjacent to recently accessed memory much quicker. To improve performance by increasing data locality, you arrange data to keep it in contiguous memory in the order that you process it.

## When to Use It
Like most optimizations, the primary guideline for using the Data Locality pattern is **when you have a performance problem**. It should not be applied to infrequently executed code, as optimizing code that doesn't need it adds complexity and reduces flexibility.

## Keep in Mind-
Applying the Data Locality pattern often requires **sacrificing some software architecture abstractions**. Patterns designed to decouple code, such as using interfaces in object-oriented languages, typically involve accessing objects through pointers or references. Going through a pointer means "hopping across memory," which can lead to the cache misses that this pattern aims to avoid. Similarly, virtual method calls (common with interfaces) require pointer chasing (looking up the vtable and then the method pointer), which also causes cache misses. Designing around data locality means giving up inheritance, interfaces, and their associated benefits to some extent, representing a challenging trade-off.

## Sample Code / Techniques-
The sample code examples focus on common ways to organize data to improve locality.

- **Arrays of Structures vs. Structure of Arrays**: Instead of having an array of objects where each object contains various data fields (e.g., position, velocity, etc.), you can use a "structure of arrays". This means having separate arrays for each data field (e.g., one array for all positions, one array for all velocities). This arrangement keeps the data for a single field (like position for all entities) contiguous in memory, which can be significantly faster when processing that specific field for multiple objects. This approach avoids pointer chasing between different data fields within an object. A real-world test showed this change made an update loop fifty times faster by using a straight crawl through three contiguous arrays instead of skipping around in memory.
- **Moving Data in Memory**: Although it might seem counter-intuitive or "heavyweight" compared to just assigning a pointer, in some cases, **it can be cheaper to move bytes around in memory if it helps keep the CPU cache full**. This highlights that intuition about performance can sometimes be wrong, and profiling is necessary.
- **Inferring State from Position**: Organizing data using locality can sometimes allow inferring state without storing explicit flags. For instance, if particles are sorted by their active state in an array, an explicit `active` flag is not needed in each particle; it can be inferred by its position and a counter tracking the number of active particles.
- **Hot/Cold Splitting**: This technique involves splitting a data structure into two parts: the "hot" data, which is frequently accessed (e.g., needed every frame), and the "cold" data, which is accessed less often. The hot data is kept contiguous and readily available, while the cold data can be elsewhere, potentially accessed via a pointer from the hot component.

## Design Decisions
The Data Locality pattern is more about adopting a **mindset** where the arrangement of data in memory is considered a key part of the game's performance. It can influence the entire architecture or be a localized pattern applied to specific data structures.

## See Also / Related Concepts-,,
- **Data-Oriented Design**: This is a broader concept that often aligns with the Data Locality pattern, focusing on designing data structures for cache usage.
- **Object Pool**: This pattern, which reuses pre-allocated objects, also benefits from Data Locality, as packing objects of the same type together helps the CPU cache when iterating over them.
- **Memory Hierarchy and Locality**: The C++ course source mentions memory hierarchy and locality as fundamental architecture concepts related to performance optimizations. This concept underpins the benefits seen with the Data Locality pattern.
- **Interpreter Pattern**: Mentioned in relation to avoiding pointer traversal overhead.
