// Queue class
export class Queue {
  constructor() {
      this.items = []; // Store the elements of the queue
  }

  // Add an element to the end of the queue
  enqueue(element) {
      this.items.push(element);
  }

  // Remove and return the first element from the queue
  dequeue() {
      return this.items.length === 0 ? null : this.items.shift();
  }

  // Peek at the front element without removing it
  peek() {
      return this.items.length === 0 ? null : this.items[0];
  }

  // Check if the queue is empty
  isEmpty() {
      return this.items.length === 0;
  }

  // Return a string representation of the queue
  toString() {
      return this.items.length === 0 ? "Queue is empty!" : this.items.join(", ");
  }

  // Convert queue to an array representation
  toArray() {
      return [...this.items];
  }

  // Create a copy of the current queue
  copy() {
      const newQueue = new Queue();
      this.items.forEach(item => newQueue.enqueue(item));
      return newQueue;
  }
}

// Stack class
export class Stack {
  constructor() {
      this.items = []; // Store the elements of the stack
  }

  // Push an element onto the stack
  push(element) {
      this.items.push(element);
  }

  // Pop an element off the stack and return it
  pop() {
      return this.items.length === 0 ? null : this.items.pop();
  }

  // Peek at the top element without removing it
  peek() {
      return this.items.length === 0 ? null : this.items[this.items.length - 1];
  }

  // Check if the stack is empty
  isEmpty() {
      return this.items.length === 0;
  }

  // Return a string representation of the stack
  toString() {
      return this.items.length === 0 ? "Stack is empty!" : this.items.join(", ");
  }

  // Convert stack to an array representation
  toArray() {
      return [...this.items];
  }

  // Create a copy of the current stack
  copy() {
      const newStack = new Stack();
      this.items.forEach(item => newStack.push(item));
      return newStack;
  }
}