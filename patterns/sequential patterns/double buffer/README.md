# Double Buffer Pattern

📑 [Click here](./double-buffer.md) if you wanna read more about this pattern

## Definition

### Gang of Four's definition

The provided sources, "Design Patterns", do not explicitly provide the Gang of Four's definition of the Double Buffer pattern. The book focuses on 22 classic design patterns grouped by intent.

### Robert Nystrom's definition

Robert Nystrom defines the **intent** of the Double Buffer pattern as to "**Cause a series of sequential operations to appear instantaneous or simultaneous**". He elaborates that this pattern is useful when you have some **state that is being modified incrementally**, and that same state **may be accessed in the middle of modification**, and you **want to prevent the code that's accessing the state from seeing the work in progress**.

### AI-generated definition

The **Double Buffer pattern** involves using two buffers to manage state changes. One buffer, the **current buffer**, is used for reading information, while the other, the **next buffer**, is used for modifications. Once the modifications on the **next buffer** are complete, the two buffers are swapped instantaneously. This ensures that any process reading the state always sees a consistent and complete version.

## Use Cases

### Use Case 1: Eliminating Tearing in Graphics

The Double Buffer pattern is commonly used in **graphics to prevent screen tearing** [Double Buffer Pattern]. While one buffer is being displayed (**current buffer**), the next frame is being drawn on the other buffer (**next buffer**). Once the drawing is complete, the buffers are swapped, ensuring a smooth visual transition without partial updates [Double Buffer Pattern, 86, 87]. This is evident in graphics APIs like OpenGL (`swapBuffers()`) and Direct3D ("swap chains").

### Use Case 2: Managing Concurrent State Modification

This pattern is also used to **manage concurrent access to shared state** [Double Buffer Pattern]. If one part of a system is incrementally modifying a state while another part needs to read that state, using double buffering ensures that the reader always sees a consistent snapshot, preventing race conditions and inconsistent data [Double Buffer Pattern].

### Use Case 3: Simulating Simultaneous Actions

By performing multiple sequential updates on a **next buffer** and then swapping it to become the **current buffer**, the Double Buffer pattern can make a series of actions appear to happen **instantaneously or simultaneously** [Double Buffer Pattern, 84]. This can enhance the user experience by presenting a complete updated state at once.

## General Examples

### Example 1: Buffering Actor Slapped State

This example, from our previous conversation, illustrates how double buffering can manage a temporary state change across frames:

```cpp
class Actor {
public:
    Actor() : currentSlapped_(false), nextSlapped_(false) {}
    virtual ~Actor() {}
    virtual void update() = 0;

    void swap() {
        currentSlapped_ = nextSlapped_;
        nextSlapped_ = false;
    }

    void slap()       { nextSlapped_ = true; }
    bool wasSlapped() { return currentSlapped_; }

private:
    bool currentSlapped_;
    bool nextSlapped_;
};

class Stage {
public:
    static const int NUM_ACTORS = 3;
    Actor* actors_[NUM_ACTORS];

    void update() {
        for (int i = 0; i < NUM_ACTORS; i++) {
            actors_[i]->update();
        }
        for (int i = 0; i < NUM_ACTORS; i++) {
            actors_[i]->swap();
        }
    }
};
```
In this scenario, `nextSlapped_` records if an actor should be slapped in the current update cycle, and `currentSlapped_` reflects that state after the `swap()` operation at the end of the cycle.

### Example 2: Simple Graphics Framebuffer

Source provides a basic example of a graphics system using double buffering:

```cpp
class Graphics {
public:
    static const int WIDTH = 640;
    static const int HEIGHT = 480;

    Graphics() : currentBuffer_(bufferA_), nextBuffer_(bufferB_) {}

    void swapBuffers() {
        unsigned char* temp = currentBuffer_;
        currentBuffer_ = nextBuffer_;
        nextBuffer_ = temp;
        // In a real system, this would trigger the video hardware to display currentBuffer_
    }

    unsigned char* getNextBuffer() {
        return nextBuffer_;
    }

    unsigned char* getCurrentBuffer() {
        return currentBuffer_;
    }

private:
    unsigned char bufferA_[WIDTH * HEIGHT];
    unsigned char bufferB_[WIDTH * HEIGHT];
    unsigned char* currentBuffer_;
    unsigned char* nextBuffer_;
};
```
Here, `bufferA_` and `bufferB_` are the two framebuffers. `getNextBuffer()` provides access to the buffer being drawn to, and `swapBuffers()` switches which buffer is considered the current one for display.

## PROS and CONS

<details><summary>PROS</summary>

- **Eliminates visual artifacts (tearing)** in graphical applications by ensuring complete frames are displayed [Double Buffer Pattern].
- **Provides a mechanism for atomic updates** of a state, preventing readers from observing partially modified data [Double Buffer Pattern].
- **Simplifies handling of concurrent read/write operations** on a shared resource [Double Buffer Pattern].
- Can lead to a perception of **more instantaneous or simultaneous updates** from a user's perspective [Double Buffer Pattern, 84].
- **Widely adopted and understood**, especially in graphics programming.

</details>

<details><summary>CONS</summary>

- **Increases memory consumption** as it requires storing two copies of the state [Double Buffer Pattern, 86].
- The **swap operation introduces a small overhead**, and if not implemented efficiently (e.g., using pointer swapping), it can become a bottleneck [Double Buffer Pattern].
- **Increases complexity** in managing resources, as updates need to be directed to the "next" buffer, and reads from the "current" buffer [Double Buffer Pattern].
- Can introduce a slight **latency** between the moment an update is finished and when it becomes visible after the swap [Double Buffer Pattern].

</details>

## Conclusion

The **Double Buffer pattern** is a fundamental technique for achieving smooth visual presentation and managing state consistency in scenarios involving concurrent modifications and reads [Double Buffer Pattern]. By decoupling the reading and writing of state through the use of two buffers and an atomic swap operation, it addresses common problems like screen tearing and data inconsistency [Double Buffer Pattern, 84, 85]. While it introduces trade-offs in terms of memory usage and the overhead of the swap, its benefits often outweigh these costs, particularly in graphical applications and systems with shared, mutable state [Double Buffer Pattern]. Understanding the nuances of how to efficiently implement the swap, whether by repointing or copying, is crucial for maximizing the effectiveness of this pattern [Double Buffer Pattern].