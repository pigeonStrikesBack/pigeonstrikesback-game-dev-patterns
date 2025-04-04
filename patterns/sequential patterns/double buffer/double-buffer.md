# Double Buffer Pattern

## Intent

Make a sequence of operations appear instantaneous or simultaneous.

## Motivation

Computers inherently perform operations sequentially, one at a time. However, users often need to see actions completed in a single instantaneous step or perceive multiple activities happening concurrently. In the context of computer graphics, a monitor displays pixels one by one, row by row. If the program is modifying the framebuffer (the memory area holding the pixels to be displayed) while the monitor is reading it, the user might see an incomplete image or visual artifacts like tearing.

By analogy, imagine having to change the stage scenery between acts of a play. If stagehands were running around during the scene change, the illusion of a coherent place would be broken .

## The Pattern

The Pattern:

The Double Buffer pattern uses **two buffers (memory areas)** instead of one.

- One is the **current buffer**, which is read by the video hardware for display (the "stage A").

- The other is the **next buffer**, on which the rendering code is writing the subsequent scene (the darkened "stage B").

Once rendering to the next buffer is complete, the two buffers are **swapped instantaneously** ("the lights are toggled"). The video hardware then starts reading from the previously "next" buffer, which now contains the complete image. The old current buffer becomes the new "next" buffer and can be used to draw the next frame. This is the underlying process of rendering in almost all games.

## When to Use It
This pattern is appropriate when all of the following conditions are true:

- You have a state that is being modified incrementally.
- The same state might be accessed during modification.
- You want to prevent the code accessing the state from seeing work in progress.
- You want to be able to read the state without having to wait for it to be written.

As we discussed earlier, it's also useful when the code modifying a state is also accessing that same state, which can occur in physics and artificial intelligence

## Things to Keep in Mind

### Increased Memory Usage:

The pattern requires maintaining **two copies of the state in memory**, which can be costly on resource-constrained devices.

### The Swap Must Be Fast:

The swap operation needs to be as quick as possible to avoid negating the benefits of the pattern. **Swapping pointers or references to the buffer** is generally very fast.

- **Pointer Swap vs. Data Copy:**
    - **Swapping pointers or references** is fast and common for graphics buffers.
    - **Copying the data between the buffers** might be used when the state is small. In the slapstick comedians example, copying the boolean flag was as efficient as swapping a pointer.
- **Buffer Granularity:** The buffer can be a **monolithic** single area of memory (like a graphics framebuffer) or **distributed** among a collection of objects (like the "slapped" state of each actor). The nature of what you're buffering usually suggests the best solution.
    - Monolithic buffers make swapping simpler and faster, especially with pointer swapping.
    - Distributed buffers require iterating and updating each object during the swap.
- **Two-Frame Lag:** When swapping buffer pointers, the data present in the buffer being drawn in the third frame will be from the first frame, not the second. In most cases, this isn't an issue as the buffer is usually cleared before drawing, but it's important to consider if you intend to reuse existing data .
- **External Code Cannot Hold Persistent Pointers to the Buffer:** Because you are essentially telling the rest of the code to look elsewhere for the buffer, you cannot store direct pointers to the data inside the buffer .

### Buffer Granularity:

The buffer can be a single monolithic memory area (as in the case of a graphics framebuffer) [Me, 56] or distributed among a collection of objects (like the "slapped" state of each actor in the comedian example) [Me, 57]. The nature of what is being buffered usually suggests the best solution.

## Examples from Source Code (Expansion):

- **Basic Graphics System:** As previously discussed, using two `Framebuffer` objects prevents visual artifacts during rendering [Me, 56]. One `Scene` draws onto a `Framebuffer`, and then the buffers are swapped before the video driver reads from the newly drawn buffer.
- **Slapstick Comedians:** Another example illustrates how double buffering can be applied at a finer granularity to manage the "slapped" state of a series of actors. Each `Comedian` actor has a `currentSlapped_` and a `nextSlapped_` boolean. The `update()` method determines the `nextSlapped_` state, and then a separate process copies `nextSlapped_` to `currentSlapped_`, ensuring a "slap" is visible only in the subsequent frame, regardless of the actors' update order. This avoids one comedian potentially reacting to a slap in the same frame they receive it, leading to a more visually coherent sequence.

## **Design Decisions (Insights):**

- **How are the buffers swapped?**

    You can **swap pointers or references** to the buffers, which is fast, or **copy the data** between the buffers, which can be slower but necessary in some cases. The graphics example uses pointer swapping for performance, while the slapstick comedians example uses data copying because the state being buffered (a single boolean) is small.

- **What is the granularity of the buffer?**

    Do you buffer a single block of memory, or is the data distributed among multiple objects? The nature of the data to be buffered usually guides this decision . For example, for screen rendering, a monolithic buffer is natural, whereas for the individual state of multiple game objects, a per-object buffering might be more appropriate.

## See Also:

As mentioned, the Double Buffer pattern is fundamental in graphics APIs . A classic use of old framebuffer data is **simulating motion blur**. For example, OpenGL has `swapBuffers()`, Direct3D has "swap chains," and Microsoft's XNA framework swaps framebuffers within its `endDraw()` method .