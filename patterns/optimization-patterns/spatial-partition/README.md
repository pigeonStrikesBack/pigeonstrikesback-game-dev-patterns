# Spatial Partition Pattern

📑 [Click here](./spatial-partition.md) if you wanna read more about this pattern

## Definition

### Gang of Four's definition

The provided sources do not contain a definition of the Spatial Partition pattern from the Gang of Four's book. Robert Nystrom's book includes a section revisiting some of the classic Design Patterns, but the Spatial Partition is presented as one of thirteen design patterns he has found useful, grouped under Optimization Patterns.

### Robert Nystrom's definition

For a set of objects, each has a position in space. Store them in a **spatial data structure that organizes the objects by their positions**. This data structure lets you **efficiently query for objects at or near a location**. When an object’s position changes, **update the spatial data structure** so that it can continue to find the object.

### AI-generated definition

The Spatial Partition pattern is an **optimization technique** used to efficiently manage and query a collection of objects that have positions in a spatial domain. It involves storing these objects within a specialized data structure that organizes them based on their location. This allows for **much faster location-based queries** (like finding all objects within a certain radius or cell) compared to checking every object in the collection. When an object moves, its position within the data structure must be updated to maintain query efficiency. This pattern is widely used in game development for tasks like collision detection, rendering visibility, and finding nearby entities.

## Use Cases

Use the Spatial Partition pattern when:
*   You have a **set of objects, each with a position in space**.
*   You are doing **enough queries to find objects by location** that your performance is suffering.
*   You need to store both **live, moving game objects** and **static art and geometry**.
*   Sophisticated games may use **multiple spatial partitions** for different kinds of content.

## General Examples

### Example 1: Fixed Grid Spatial Partition

A common and simple spatial partition implementation is a **fixed grid**. Space is divided into a grid of cells, and objects are stored in the cell corresponding to their position. This example shows the basic structure for a grid and a unit that can be placed within it, using linked lists to store multiple units per cell.

First, a sketch of the `Grid` class:

code (👆 click here to show)
```cpp
class Grid {
public:
  Grid()
  {
    // Clear the grid.
    for (int x = 0; x < NUM_CELLS; x++)
    {
      for (int y = 0; y < NUM_CELLS; y++)
      {
        cells_[x][y] = NULL;
      }
    }
  }

  static const int NUM_CELLS = 10;
  static const int CELL_SIZE = 20;

private:
  Unit* cells_[NUM_CELLS][NUM_CELLS]; // Array of pointers to Units (head of linked lists)
};
```

Next, the `Unit` class is extended with pointers to form a doubly linked list within each grid cell:

code (👆 click here to show)
```cpp
class Unit {
  // ... previous code for Unit ...

private:
  Unit* prev_; // Pointer to the previous unit in the cell's list
  Unit* next_; // Pointer to the next unit in the cell's list

  // Need Grid pointer to add/remove from grid
  Grid* grid_;
  double x_, y_; // Position

  // Friend class or public methods needed by Grid to manipulate prev/next
  friend class Grid;
};
```

The `Unit` constructor takes a `Grid` pointer and adds itself to the grid:

code (👆 click here to show)
```cpp
Unit::Unit(Grid* grid, double x, double y)
: grid_(grid),
  x_(x),
  y_(y),
  prev_(NULL),
  next_(NULL)
{
  grid_->add(this); // Assumes Grid has an add method
}
```

An `add` method in `Grid` would calculate the cell based on `x` and `y` and add the unit to the linked list in that cell. When querying, instead of checking all units, you only check units in the relevant cell(s). For queries that span multiple cells (like finding units within an attack radius), you check the current cell and potentially neighbouring cells. If units move, they must be removed from their old cell's list and added to the new cell's list in the grid.

## PROS and CONS

**PROS**:
*   **Efficiently locate objects by position**.
*   **Reduces the complexity of location-based queries** (like finding nearby objects) from O(n) or O(n²) to something more manageable, especially for large numbers of objects.
*   Allows for **efficient querying for objects at or near a location**.

**CONS**:
*   **Adds code complexity** compared to simply iterating through all objects.
*   Requires **updating the data structure when an object's position changes**, which adds complexity and CPU cycles.
*   Uses **additional memory** for the spatial data structure's bookkeeping.
*   May **not be worth the bother if the number of objects (n) is small**.
*   Object-independent partitions (like a fixed grid) can become **imbalanced if objects clump together**, potentially reducing efficiency in dense areas.
*   Adapting partitions can require **reorganization overhead** when objects move.

## Conclusion

The Spatial Partition pattern is an **optimization pattern** widely used in game development to **efficiently find objects based on their location**. It organises spatially located objects within a dedicated data structure, allowing for significantly faster queries compared to checking every object. While it introduces **complexity and memory overhead**, it provides substantial performance gains, particularly when dealing with a large number of objects and frequent location-based queries. The choice of specific spatial data structure (like a grid, quadtree, BSP, etc.) involves trade-offs regarding complexity, memory usage, and how well it handles object movement and uneven spatial distribution.