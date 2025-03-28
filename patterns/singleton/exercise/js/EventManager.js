// --- EVENT MANAGER (Observer Pattern)
class EventManager {
    constructor() {
        this.listeners = {}; // Stores listeners for different events
    }

    // Subscribes a listener to a specific event
    subscribe(event, listener) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(listener);
        console.log(listener, `subscribed to ${event}`);
    }

    // Notifies all listeners when an event occurs
    notify(event, data) {
        console.log(`${event} dispatched with data`, data);
        if (this.listeners[event]) {
            this.listeners[event].forEach(listener => listener.update(data));
        }
    }

    reset() {}
}

export default EventManager;