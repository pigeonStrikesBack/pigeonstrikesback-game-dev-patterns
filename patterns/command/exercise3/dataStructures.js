function createQueue() {
  const items = []; // Encapsulated within the function's closure

  return {
    // Add an element to the end of the queue
    enqueue(element) {
      items.push(element);
    },

    // Remove and return the first element from the queue
    dequeue() {
      return items.length === 0 ? null : items.shift();
    },

    // Peek at the front element without removing it
    peek() {
      return items.length === 0 ? null : items[0];
    },

    // Check if the queue is empty
    isEmpty() {
      return items.length === 0;
    },

    // Return a string representation of the queue
    toString() {
      return items.length === 0 ? "Queue is empty!" : items.join(", ");
    },

    // Convert queue to an array representation
    toArray() {
      return [...items];
    },

    // Create a copy of the current queue
    copy() {
      const newQueue = createQueue();
      items.forEach(item => newQueue.enqueue(item));
      return newQueue;
    }
  };
}

export const DataStructures = Object.freeze({
  createQueue
});
