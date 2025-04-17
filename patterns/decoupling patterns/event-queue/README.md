# Event Queue Pattern

📑 [Click here](./event-queue.md) if you wanna read more about this pattern

## Definition

### Robert Nystrom's definition

A **queue stores a series of notifications or requests in first-in, first-out order**. Sending a notification enqueues the request and returns. The request processor then processes items from the queue at a later time. Requests can be handled directly or routed to interested parties. This **decouples the sender from the receiver both statically and in time**.

## Use Cases

### use case 1: GUI event loops

In user interface programming, the operating system generates events (like button clicks or key presses) when the user interacts with the program. These events are added to a queue. The application then pulls these events from the queue and handles them, allowing the application to respond to user input in a decoupled manner.

### use case 2: Central event bus in games

Games often use a central event queue for high-level communication between different game systems that need to remain decoupled. For example, when an enemy dies in the combat system, it can add an "enemy died" event to the central queue. The tutorial system, which has registered to receive these events, can then react by displaying a tutorial message without the combat system needing to know about it directly.

### use case 3: Decoupling sound requests in an audio engine

An audio engine can use an event queue to decouple the code that requests a sound to be played from the code that actually loads the resource and starts playing it. When a `playSound()` request is made, it's added to the queue, and the calling code can continue immediately. A separate update process in the audio engine then retrieves these requests from the queue and processes them.

## General Examples

### Example 1: Audio engine using a ring buffer

An audio engine can implement an event queue using a **ring buffer**, which is an efficient way to manage a fixed-size queue using an array without dynamic allocation or shifting elements. When a sound needs to be played, a message containing the sound ID and volume is enqueued at the tail of the ring buffer. The audio engine's update method dequeues messages from the head of the buffer, loads the sound resource, and plays it. The head and tail pointers wrap around the array, creating a circular queue.

```cpp
// Example structure for a play sound message (conceptual C++ based on)
struct PlayMessage {
    SoundId id;
    int volume;
};

// Conceptual Audio class using a ring buffer (based on)
class Audio {
public:
    static void playSound(SoundId id, int volume) {
        // Enqueue the PlayMessage in the ring buffer
    }

    static void update() {
        // Dequeue and process PlayMessages
    }

private:
    static const int MAX_PENDING = 16;
    static PlayMessage pending_[MAX_PENDING];
    static int head_;
    static int tail_;
};
```

### Example 2: Aggregating sound requests

To avoid redundant processing or unwanted effects (like playing the same sound too loudly multiple times), an audio engine using an event queue can implement **request aggregation**. When a new `playSound()` request is received, the queue is checked for any existing pending requests for the same sound ID. If one is found, the volume of the existing request can be updated (e.g., to the maximum of the two volumes) instead of adding a new request to the queue.

```cpp
// Conceptual Audio::playSound method with aggregation (conceptual C++ based on)
static void playSound(SoundId id, int volume) {
    // Check the pending queue for an existing request with the same SoundId
    // If found, update its volume and return
    // Otherwise, enqueue the new PlayMessage
}
```

## PROS and CONS

**PROS**

*   **Decoupling:** It effectively decouples the sender and receiver of messages both statically (sender doesn't need to know the receiver) and in time (processing happens later).
*   **Control for the Receiver:** Queues give control to the receiver, allowing it to delay processing, aggregate requests, or even discard them.
*   **Asynchronous Processing:** It enables asynchronous processing, preventing the sender from being blocked while the request is being handled.
*   **Buffering:** The queue acts as a buffer to handle situations where events are produced faster than they can be processed.
*   **Aggregation:** Event queues can facilitate the aggregation or batching of similar requests for more efficient processing.

**CONS**

*   **Complexity:** Event queues can be complex and have a wide-reaching effect on the architecture. Simpler decoupling patterns might suffice if temporal decoupling isn't needed.
*   **Global State (Central Queue):** A central event queue can act like a global variable, potentially leading to subtle interdependencies and making it harder to track information flow.
*   **Stale World State:** When an event is processed later, the state of the game world might have changed since the event was raised, requiring careful handling and potentially more data in the event.
*   **Feedback Loops:** Asynchronous event systems are susceptible to feedback loops, where an event triggers a response that generates another event, potentially leading to unintended behaviour that can be harder to detect than in synchronous systems.
*   **No Direct Response:** Queues are not well-suited for scenarios where the sender needs a direct response to a request.

## Conclusion

The Event Queue pattern is a valuable tool for **achieving temporal and static decoupling** between different parts of a system. It allows for **asynchronous processing, buffering of requests, and control for the receiver**. However, it introduces **complexity and potential issues related to global state, stale data, and feedback loops**. Careful consideration of the design choices, such as what goes in the queue and who can read and write to it, is crucial for effective implementation. When temporal decoupling is required, the Event Queue pattern provides a powerful mechanism to build more flexible and responsive systems.