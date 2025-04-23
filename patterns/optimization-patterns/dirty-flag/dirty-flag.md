# Dirty Flag pattern

The Dirty Flag pattern is categorised as one of the **Optimization Patterns** in Robert Nystrom's book.

## Intent

The core intent of the pattern is to **accelerate recalculation or synchronization by marking data as 'dirty' when it changes**. It aims to avoid performing work unnecessarily.

## Motivation

The pattern addresses scenarios where calculating **derived data** from **primary data** (such as an object's world transform from its local transform in a scene graph) is **computationally expensive**. Similarly, it applies when **synchronization** of data (like sending data over a network) is **costly**. Recalculating or resynchronizing the derived data every time the primary data changes is inefficient if the derived data is not needed immediately or as frequently. The pattern postpones this costly work until the derived data is actually required, ensuring it is only performed when the primary data has changed *and* the derived data is accessed.

## The Pattern

The Dirty Flag pattern involves associating a **flag** (or "bit") with the derived data. This flag indicates whether the derived data is **out of date** or "dirty" relative to the primary data.

1.  When the **primary data changes**, the dirty flag is **set**.
2.  When the **derived data is requested or needed**, the flag is **checked**.
3.  If the flag is **set** (indicating "dirty" state), the derived data is **recalculated or synchronized** from the primary data. After this process, the flag is **cleared**.
4.  If the flag is **not set**, the previously calculated or synchronized derived data is used directly, bypassing the recalculation or synchronization step.

This ensures the costly operation happens a maximum of once after one or more changes to the primary data, specifically just before the derived data is accessed.

## When to Use It

- The pattern should primarily be used **when a specific performance problem has been identified**. Avoid applying it to code that is not performance-critical.
- It is suitable for speeding up **calculation** (like scene graph transforms) or **synchronization** (like sending data over a network) where the process is **time-consuming or costly**.
- The pattern is effective when the **primary data changes more often than the derived data is used**. This allows savings by skipping recalculations that would become obsolete before the derived data is needed.
- It is most useful when it is **hard to update the derived data incrementally** or "pay as you go". If a simple running total or similar incremental update is feasible, that might be a better approach.

## Keep in Mind

- Implementing the Dirty Flag pattern **adds code complexity**.
- The most significant challenge is **cache invalidation** – specifically, ensuring the dirty flag is **correctly set every single time the primary data is modified**. Failing to set the flag in even one place can result in hard-to-debug issues where stale data is used. Phil Karlton's famous quote highlights the difficulty of cache invalidation.
- To mitigate the risk of missed invalidations, modifications to the primary data can be **encapsulated behind a single, narrow API**. This ensures the flag can be reliably set within that controlled point.
- You generally need to **keep the previously calculated derived data in memory** so it can be used when the flag is not set. (This is less relevant when using the pattern for synchronization, as the derived data might reside elsewhere).
- If the recalculation or synchronization process is very time-consuming, deferring it until the derived data is needed (cleaning on demand) can result in a **noticeable pause**.

## Sample Code / Techniques (Described)

The sources illustrate the pattern through examples:

- **Scene Graph Transforms:** A classic example where a world transform's dirty flag is set when the object's local transform changes. The world transform is recalculated only when needed and the flag is dirty.
- **Synchronization:** Mentioned in the context of costly derived data residing on disk or over the network. The example of a pirate ship's booty total weight is used to contrast the pattern with an incremental update approach.

## Design Decisions

Beyond deciding where and when to apply the pattern, key design decisions include:

- **When is the dirty flag cleaned?**
    - **When the result is needed:** This avoids calculation entirely if the derived data is never used after being dirtied. However, for time-consuming calculations, this can cause a noticeable pause when the data is finally requested.
    - (Implied alternative from the above discussion) **Earlier (e.g., end of frame):** This would spread the cost but might result in calculating data that is immediately dirtied again before use.
- **What is the granularity of the flag?**
    - **Fine-grained:** A flag on small data units (e.g., individual planks). This ensures only truly changed data is processed but uses more memory for flags and increases fixed overhead per processed chunk.
    - **Coarse-grained:** A flag on larger data chunks (e.g., an entire deck). This uses less memory for flags and reduces fixed overhead but may result in processing some unchanged data within a dirty chunk.

## See Also

- The pattern is closely related to the general problem of **Cache Invalidation**.
- It is used in some **web frameworks**, such as Angular, to track data changes needing synchronization to a server.
