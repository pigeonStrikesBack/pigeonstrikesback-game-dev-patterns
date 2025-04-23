# Dirty Flag Pattern

📑 [Click here](./dirty-flag.md) if you wanna read more about this pattern

## Definition

### Gang of Four's definition

The provided sources do not contain a definition of the Dirty Flag pattern from the Gang of Four's book. Robert Nystrom's book, which introduces this pattern, mentions the classic "Design Patterns" book but presents Dirty Flag as one of the patterns he has found useful in game programming, distinct from the Gang of Four's catalog.

### Robert Nystrom's definition

This pattern uses a simple flag or bit to track the "out-of-date-ness" or "dirtiness" of derived data relative to its primary source data. It is applied to **time-consuming or otherwise costly calculation and synchronization** work to avoid performing it unnecessarily.

### AI-generated definition

The Dirty Flag pattern is a performance optimization technique where a flag (or "dirty bit") is used to indicate that a derived piece of data is out of sync with its source data due to changes in the source. The costly process of recalculating or updating this derived data is **deferred until the data is actually needed** and the flag is set, thereby avoiding unnecessary work when the source data changes frequently but the derived data is accessed less often,,.

## Use Cases

The primary use case for the Dirty Flag pattern is when you have a **performance problem** caused by repeatedly performing a costly calculation or synchronization task.

It is useful in situations where:
*   The **primary data changes more frequently than the derived data is used**.
*   It is **hard to update the derived data incrementally** as the primary data changes.
*   The work involved in calculating or synchronizing the derived data is **time-consuming or otherwise costly**.

Specific applications mentioned include:
*   **Optimising scene graph transformations** by only recalculating a node's world transform when its local transform or a parent's transform changes and the world transform is needed (e.g., for rendering),-.
*   Tracking **unsaved changes in a document** editing application to know when the in-memory state needs to be saved to disk.
*   Tracking changes to parts of a complex object (like a customizable ship) have changed to know what data needs to be sent to a server for synchronization.

## General Examples

The core concept involves using a simple boolean flag (`dirty_`) alongside derived data (`world_`) which is costly to compute,.

### Example 1: Optimising Scene Graph World Transforms,-

In a scene graph, each node has a local transform (relative to its parent) and a world transform (relative to the origin). The world transform is derived from the node's local transform and its parent's world transform. If a node or any of its ancestors move, its world transform needs to be recalculated. Calculating this can involve costly matrix multiplications.

To avoid recalculating the world transform every frame, a `dirty_` flag is added to the `GraphNode` class.

code (👆 click here to show)
```cpp
class GraphNode {
public:
  GraphNode(Mesh* mesh)
  : mesh_(mesh),
    local_(Transform::origin()),
    dirty_(true) // Flag starts true as world_ is not yet calculated
  {}

  // Other methods...

  void setTransform(Transform local) {
    local_ = local;
    dirty_ = true; // Mark dirty when local transform changes
  }

  // ... other methods, including render()

private:
  Transform world_; // Cached derived data
  bool dirty_;    // The dirty flag
  Mesh* mesh_;
  Transform local_;
  // Other fields...
};
```

When a node's local transform changes, the `dirty_` flag is set to `true`. This indicates that the cached `world_` transform is now out of date,.

When the node's world transform is needed (e.g., during rendering), the `render` method checks the `dirty` flag. The `render` method is recursive and also receives a `dirty` status inherited from the parent.

code (👆 click here to show)
```cpp
void GraphNode::render(Transform parentWorld, bool dirty) {
  dirty |= dirty_; // Inherit parent's dirtiness or use own flag

  if (dirty) {
    // Only recalculate if the flag (or parent's flag) is set
    world_ = local_.combine(parentWorld);
    dirty_ = false; // Clear the flag after recalculating
  }

  if (mesh_) renderMesh(mesh_, world_);

  for (int i = 0; i < numChildren_; i++) {
    // Pass down the current dirtiness status
    children_[i]->render(world_, dirty);
  }
}
```

If the flag is set (either on this node or inherited from a parent), the `world_` transform is recalculated using the `local_` transform and the parent's world transform, and the `dirty_` flag is cleared. If the flag is not set, the previously calculated (and still valid) `world_` transform is used. This avoids unnecessary recalculations when nothing has changed in the node's ancestry.

### Example 2: Unsaved Document Changes

A text editor can use a dirty flag to track whether the in-memory state of a document has been modified since the last save. The "primary data" is the document content in memory, and the "derived data" is the state of the file on disk. A dirty flag (often visualised as a bullet or star in the title bar) is set whenever the user makes a change. Saving the document clears the flag. This flag is used to prompt the user to save before closing or exiting.

## PROS and CONS

**PROS**:
*   **Avoids performing costly work** (calculation or synchronization) when the derived data is not actually needed,.
*   Allows **collapsing multiple changes** to the primary data into a single update of the derived data that occurs only when needed.
*   **Saves CPU cycles** by deferring unnecessary computation.

**CONS**:
*   **Adds code complexity** compared to simply recalculating/synchronizing every time.
*   Can cause a **noticeable pause** when the deferred, costly work is finally performed (e.g., when the derived data is requested),.
*   Risks **losing work** if the deferred synchronization is interrupted before it happens (e.g., unsaved document changes lost during a power outage).
*   Requires **careful cache invalidation**: the dirty flag **must** be set every single time the primary data changes. Failing to do so leads to the program using stale derived data and can cause bugs that are very difficult to track down. Encapsulating modifications to the primary data behind a single API can help ensure the flag is always set.
*   You have to **keep the previous derived data in memory** in case it's needed when the flag is not set. (Note: This is less of an issue when used for synchronization to an external system like disk or network).
*   May require implementing **synchronization logic** if the primary data can be modified concurrently while the deferred work is being performed.
*   Choosing the **granularity of tracking** (how much primary data is covered by one flag) involves trade-offs: fine-grained tracking uses more memory for flags but processes only changed data, while coarse-grained tracking uses less memory for flags but may process unchanged data and has less fixed overhead per chunk,.

## Conclusion

The Dirty Flag pattern is an **optimization pattern** used to improve performance by deferring **costly calculations or synchronizations**. It works by using a flag (a "dirty bit") to track when derived data becomes out of date due to changes in its primary source. The expensive process to update the derived data is only executed when the flag is set and the derived data is actually required,. This is particularly effective when the primary data changes frequently but the derived data is accessed less often or is difficult to update incrementally. While powerful for performance, applying this pattern introduces **additional code complexity** and requires meticulous attention to ensure the flag is correctly set every time the primary data changes, as failure to do so can lead to subtle, hard-to-debug issues,. It also involves trade-offs regarding the cost of deferral and the granularity of change tracking,.