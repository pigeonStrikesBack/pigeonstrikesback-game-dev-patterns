# Event Queue

The **Event Queue pattern decouples when a message or event is sent from when it is processed**. It involves a queue that stores a series of notifications or requests in a first-in, first-out (FIFO) order.

Sending a notification enqueues the request and returns immediately, while a separate processor handles items from the queue at a later time. This decoupling is both static (sender doesn't need to know the receiver) and temporal (processing happens later).

## Motivation

The primary motivation for using an Event Queue is to manage requests or notifications between different parts of a system that need to interact but should not be tightly coupled.

It provides a buffer between code that pushes requests and code that pulls and processes them at a convenient time.

Common manifestations of this pattern include GUI event loops and central event buses within games. For instance, user interface programming heavily relies on event queues to handle user interactions.

In games, a central event queue can facilitate communication between decoupled systems like combat and tutorials.

## Pros


- **Decoupling:**

	It effectively decouples the sender and receiver of messages both statically and in time. The sender doesn't need to know who will process the event or when.

- **Control for the Receiver:**

	Queues give control to the receiver, allowing it to delay processing, aggregate requests, or even discard them.

- **Asynchronous Processing:**

	It enables asynchronous processing, preventing the sender from being blocked while the request is being handled. This is particularly useful for time-consuming tasks like loading resources.

- **Buffering:**

	The queue acts as a buffer to handle situations where events are produced faster than they can be processed.

- **Aggregation:**

	Event queues can facilitate the aggregation or batching of similar requests for more efficient processing.

## Cons


- **Complexity:**

	Event queues can be complex and have a wide-reaching effect on the architecture of a game. Simpler decoupling patterns like Observer or Command might suffice if temporal decoupling is not required.

- **Global State (Central Queue):**

	A central event queue can act like a global variable, leading to subtle interdependencies and making it harder to track the flow of information.

- **Stale World State:**

	When an event is processed later, the state of the game world might have changed since the event was raised. This necessitates careful handling and potentially more data in the event itself.

- **Feedback Loops:**

	Asynchronous event systems are susceptible to feedback loops, where an event triggers a response that generates another event, potentially leading to unintended behaviour. These loops can be harder to detect than in synchronous systems.

- **No Direct Response:**

	Queues are not well-suited for scenarios where the sender needs a direct response to a request.

## Design choices

The Event Queue pattern offers several design choices that influence its implementation and usage:

- **What goes in the queue?**

    - **Events (Notifications):**

	    Describe something that has already happened (e.g., "monster died"). Often used for broadcasting to multiple listeners.

    - **Messages (Requests):**

    	Describe an action that should happen in the future (e.g., "play sound"). More likely to have a single listener and resemble an asynchronous API.

- **Who can read from the queue?**

    - **Single-cast queue:**

	    Only one designated object (the reader) can process events from the queue. This often encapsulates the queue within a class.

    - **Broadcast queue:**

    	Multiple listeners can register to receive and process every item in the queue. Events might be dropped if there are no listeners.

    - **Work queue:**

	    Multiple listeners exist, but each item in the queue is processed by only one of them. Requires scheduling logic.

- **Who can write to the queue?**

    - **One writer:**

	    A single object is responsible for adding events to the queue, similar to the synchronous Observer pattern.

    - **Multiple writers:**

	    Any part of the codebase can add events, as seen in central event buses. Requires more careful management to avoid cycles.
        
- **What is the lifetime of the objects in the queue?**

    - **Pass ownership:**

	    The queue takes ownership of the message when it's enqueued, and the receiver takes ownership upon processing.

    - **Share ownership:**

	    Messages persist as long as anything holds a reference to them, often using smart pointers.

    - **The queue owns it:**

	    Messages live within the queue's memory, and senders and receivers interact with them there (similar to an object pool).

## Implementation details

Queues can be implemented in various ways.

The sources highlight the use of a **ring buffer** as an efficient way to implement a queue using a fixed-size array without dynamic allocation or the need to shift elements upon removal.

## Related Patterns

The Event Queue pattern is closely related to several other design patterns:


- **Observer:**

	The Event Queue can be seen as an **asynchronous cousin to the Observer pattern**. Both decouple senders from receivers, but the Event Queue introduces temporal decoupling through the queue.

- **Command:**

	Messages in an event queue can represent **commands** (requests for an action). The Command pattern also focuses on encapsulating a request as an object.

- **State:**

	A finite state machine can use an event queue to process asynchronous input. Each event can trigger a transition between states.

- **Update Method:**

	An update method is often used to periodically process the events in the queue.

- **Service Locator:**

	A message queue can be used as an asynchronous API to a service, similar in concept to how a Service Locator provides access to services.

- **Actor Model:**

	When multiple state machines send messages to each other via their own input queues (mailboxes), it resembles the actor model of computation.

## Conclusion

In summary, the Event Queue pattern is a powerful tool for decoupling parts of a system and managing asynchronous communication. However, its complexity requires careful consideration of the various design choices and potential pitfalls before implementation.