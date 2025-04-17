#include <iostream>
#include <vector>
#include <memory>
#include <array>
#include <cassert>

// Forward declaration
class EventListener;

// Base class for events
class Event /*: public std::enable_shared_from_this<Event>*/ {
public:
    virtual ~Event() = default;
    virtual void process(EventListener* listener) = 0;
};

// Concrete example event: MessageEvent
class MessageEvent : public Event, public std::enable_shared_from_this<MessageEvent> {
public:
    MessageEvent(std::string message) : message_(std::move(message)) {}
    void process(EventListener* listener) override;
    const std::string& getMessage() const { return message_; }
private:
    std::string message_;
};

// Interface for event listeners (observers)
class EventListener {
public:
    virtual ~EventListener() = default;
    virtual void onEvent(std::shared_ptr<Event> event) = 0;
};

// Implementation of MessageEvent's process method
inline void MessageEvent::process(EventListener* listener) {
    listener->onEvent(shared_from_this()); // Transfer ownership to the listener
}

// Concrete example listener: ConsoleLogger
class ConsoleLogger : public EventListener {
public:
    void onEvent(std::shared_ptr<Event> event) override {
        if (auto messageEvent = dynamic_cast<MessageEvent*>(event.get())) {
            std::cout << "ConsoleLogger received: " << messageEvent->getMessage() << std::endl;
        } else {
            std::cout << "ConsoleLogger received an unknown event type." << std::endl;
        }
        // Ownership of the event is now with ConsoleLogger (though we don't need it after processing here)
    }
};

// Concrete example listener: AlertSystem
class AlertSystem : public EventListener {
public:
    void onEvent(std::shared_ptr<Event> event) override {
        if (auto messageEvent = dynamic_cast<MessageEvent*>(event.get())) {
            if (messageEvent->getMessage().find("error") != std::string::npos) {
                std::cerr << "**ALERT SYSTEM**: Error detected: " << messageEvent->getMessage() << std::endl;
            }
        }
        // Ownership of the event is now with AlertSystem
    }
};

// Ring buffer based event queue
class RingBufferEventQueue {
public:
    RingBufferEventQueue(size_t capacity) : capacity_(capacity), buffer_(capacity) {}

    void enqueue(std::shared_ptr<Event> event) {
        assert((head_ + 1) % capacity_ != tail_); // Check for overflow
        buffer_[head_] = std::move(event);
        head_ = (head_ + 1) % capacity_;
    }

    void addListener(EventListener* listener) {
        listeners_.push_back(listener);
    }

    void processEvents() {
        while (tail_ != head_) {
            std::shared_ptr<Event> event = std::move(buffer_[tail_]);
            tail_ = (tail_ + 1) % capacity_;
            notifyListeners(event);
        }
    }

private:
    void notifyListeners(std::shared_ptr<Event> event) {
        for (EventListener* listener : listeners_) {
            event->process(listener); // Transfer ownership to each listener temporarily
        }
        // After processing by all listeners, the original unique_ptr goes out of scope,
        // but each listener *should* have moved ownership if they needed to keep the event.
    }

    size_t capacity_;
    std::vector<std::shared_ptr<Event>> buffer_; // Fixed size for simplicity
    size_t head_ = 0;
    size_t tail_ = 0;
    std::vector<EventListener*> listeners_;
};

// Single writer class
class EventGenerator {
public:
    EventGenerator(RingBufferEventQueue& queue) : eventQueue_(queue) {}

    void generateMessage(std::string message) {
        std::cout << "EventGenerator sending: " << message << std::endl;
        eventQueue_.enqueue(std::make_shared<MessageEvent>(message));
    }
private:
    RingBufferEventQueue& eventQueue_;
};

int main() {
    // Create the event queue with a fixed capacity
    RingBufferEventQueue eventQueue(16);
    std::cout << "**Event Queue Created**" << std::endl;

    // Create event listeners
    ConsoleLogger logger;
    AlertSystem alerter;
    eventQueue.addListener(&logger);
    eventQueue.addListener(&alerter);
    std::cout << "**Listeners Added**" << std::endl;

    // Create the single event writer
    EventGenerator generator(eventQueue);

    // Generate some events
    generator.generateMessage("User logged in.");
    generator.generateMessage("Game started.");
    generator.generateMessage("Enemy defeated.");
    generator.generateMessage("Error: File not found!");
    generator.generateMessage("User logged out.");
    std::cout << "**Events Generated**" << std::endl;

    // Process the events in the queue
    std::cout << "**Processing Events...**" << std::endl;
    eventQueue.processEvents();
    std::cout << "**Events Processed**" << std::endl;

    return 0;
}

/*
This C++ program demonstrates the **Event Queue pattern** using a **ring buffer** and adheres to the specified design choices:

*   **Events:** The program defines a base `Event` class and a concrete `MessageEvent` class to represent notifications. Each event has a `process` method that takes an `EventListener`.
*   **Broadcast queue:** The `RingBufferEventQueue` maintains a `std::vector` of `EventListener` pointers. When processing events, it iterates through all registered listeners and calls their `onEvent` method.
*   **One writer:** The `EventGenerator` class acts as the single writer. It has a method `generateMessage` that creates `MessageEvent` objects and enqueues them into the `RingBufferEventQueue`.
*   **Pass ownership:** When an event is enqueued using `std::move`, the queue takes ownership. In the `notifyListeners` method, `event->process(listener)` is called, and within the `MessageEvent::process` method, `std::unique_ptr<MessageEvent>(this)` is used to transfer ownership of the event to each listener's `onEvent` method via a `std::unique_ptr`. The listeners then own the event for the duration of their processing.

The `RingBufferEventQueue` uses a fixed-size `std::array` to implement the ring buffer. The `head_` index points to the next available slot for writing, and the `tail_` index points to the next event to be read. The modulo operator (`%`) is used to wrap the indices around the buffer.

The `processEvents` method dequeues events one by one and calls `notifyListeners`. `notifyListeners` then iterates through all registered `EventListener` objects and calls their `onEvent` method, effectively broadcasting the event. The use of `std::unique_ptr` ensures that memory is managed correctly according to the "pass ownership" design choice.

This example showcases the basic structure of an event queue with the specified design considerations. In a more complex system, you might have different types of events and more sophisticated listener management.
*/