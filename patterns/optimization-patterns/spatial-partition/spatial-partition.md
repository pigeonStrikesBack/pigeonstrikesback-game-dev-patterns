Okay, here is an exhaustive summary of the **Spatial Partition pattern**, drawing upon the information from the provided sources.

The Spatial Partition pattern is listed among the **Optimization Patterns** in Robert Nystrom's book, *Game Programming Patterns*.

### Intent

The intent of the Spatial Partition pattern is to **efficiently locate objects by storing them in a data structure organized by their positions**.

### Motivation

Games often simulate worlds where the locations of objects are crucial. Many game tasks require finding objects at or near a specific location, such as checking for potential combat engagements between units. A straightforward approach, like comparing every object to every other object, results in an **O(n²) complexity** for finding all interactions, which becomes prohibitively slow when dealing with a large number of objects. Sorting objects by position can improve query efficiency, potentially reducing complexity to O(n log n) or even O(n). The Spatial Partition pattern extends this idea to handle spaces with more than one dimension.

### The Pattern

The pattern involves having a set of objects, each possessing a position in space. These objects are stored in a **spatial data structure** that organises them according to their locations. This structure enables efficient queries to find objects situated at or near a particular point. When an object's position changes, the spatial data structure must be updated to maintain its ability to find the object.

### When to Use It

The Spatial Partition pattern is widely used in games. It is applicable when:

- You have a collection of objects, each with a defined position in space.
- You frequently perform queries to locate objects based on their position, and performance is suffering due to the volume of such queries.
- It is commonly used for managing both dynamic, moving game entities and static elements like world geometry and art.
- Complex games may implement multiple spatial partitions tailored for different types of content.

### Keep in Mind

Implementing a Spatial Partition involves trade-offs and potential challenges:

- Spatial partitions are primarily useful for **reducing the complexity of operations** like finding nearby objects from O(n) or O(n²) to a more manageable level. If the number of objects (`n`) is small, the overhead might not be worthwhile.
- Handling objects that frequently change their positions requires **updating the spatial data structure**, which adds code complexity and consumes CPU cycles. You must ensure the performance gain from faster queries outweighs the cost of updating the structure.
- The pattern typically requires **additional memory** for the bookkeeping data structures it uses. This means it trades memory for speed, which might not be beneficial if memory is a more constrained resource than CPU time.
- The act of moving an object in a spatial partition that adapts its boundaries based on object positions can be complex, potentially requiring the movement of other objects or adjustments across multiple levels of a hierarchy.

### Sample Code / Techniques

The sample code section illustrates the **simplest spatial partition: a fixed grid**.

- This involves imposing a grid of fixed-size cells over the game space.
- Objects are stored within the grid cells that correspond to their spatial location.
- Each cell maintains a list of the objects it contains.
- Operations, like combat checks, are then localised to objects within the same cell (and potentially nearby cells if the interaction range exceeds the cell size), effectively partitioning the overall problem into smaller, more manageable sub-problems.
- The example uses a **doubly linked list** to manage the units within each grid cell. This allows units to be added or removed from a cell's list efficiently without needing to search. Using a plain old array is also noted as a common and often cache-friendly way to store homogenous collections.
- Other common spatial partition structures mentioned include the **Quadtree, BSP (Binary Space Partition), k-d tree, and Bounding Volume Hierarchy**.

### Design Decisions

Several key design decisions arise when implementing a Spatial Partition:

- **Hierarchical vs. Flat Partition**:
    - **Flat Partitions** (like a fixed grid) are simpler to understand and implement. They have constant memory usage and can be faster to update when objects move. However, they can be inefficient with large empty areas (wasting memory) and densely populated areas (where a single partition becomes too large).
    - **Hierarchical Partitions** (like Quadtrees, Octrees, BSPs, k-d trees) recursively subdivide space. They handle empty space efficiently by not subdividing sparse regions and densely populated areas by continuing to subdivide crowded regions until partitions contain a manageable number of objects. They are generally more complex than flat partitions.
- **Object-Dependent vs. Object-Independent Partitioning**:
    - **Object-Independent Partitions** (like a fixed grid) have static boundaries. Adding or moving objects is typically incremental and fast. The drawback is that if objects cluster together, partitions can become imbalanced, leading to performance issues.
    - **Object-Dependent Partitions** (like some BSPs, k-d trees, and BVHs) adjust their boundaries based on the actual location of objects, aiming for balanced partitions with roughly equal numbers of objects. This can provide more consistent performance. However, updating these structures when objects move or are added can be more complex and potentially costly, as it might require reshuffling many objects. These are often better suited for static geometry that doesn't move.
    - The **Quadtree (and its 3D counterpart, the Octree)** is presented as a hybrid approach. It uses a hierarchy that adapts to the object distribution (only subdividing crowded areas), but the subdivision boundaries are fixed (always splitting space in half). This allows for incremental adds, removes, and moves with predictable effort while still providing balanced partitions where no single partition contains an excessive number of objects.
- **Are Objects Only Stored in the Partition?**:
    - If the spatial partition is the *only* place objects are stored, it **avoids the memory overhead and complexity of maintaining a second collection**. It also simplifies synchronization when objects are created or destroyed, as you only need to update one structure.
    - The alternative is having a primary collection (e.g., a list of all objects) and using the spatial partition as a secondary index or cache for spatial queries. (The source explicitly details the benefits of the former approach).

### See Also

The Spatial Partition pattern is closely related to other concepts and patterns:

- It is one of the **Optimization Patterns** discussed.
- It is fundamentally linked to the concept of **Data Locality**, as organizing data by position often leads to improved cache usage when processing objects in proximity. The **Component pattern** is also noted as making spatial partition optimisation easier, as entities can be processed domain by domain (e.g., physics components, graphics components) across the partition.
- Specific spatial data structures that implement this pattern include **Grid, Quadtree, BSP, k-d tree, and Bounding volume hierarchy**. These structures can be seen as multi-dimensional extensions of simpler 1D data structures like bucket sorts (Grid), binary search trees (BSPs, k-d trees, BVHs), and tries (Quadtrees, Octrees).
- Referencing external resources, the pattern ties into concepts discussed in Tony Albrecht's "Pitfalls of Object-Oriented Programming" and Noel Llopis's blog post on **data-oriented design** and cache usage.
