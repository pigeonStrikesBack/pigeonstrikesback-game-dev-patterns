# Command Pattern

## Definition

### Gang of Four's definition

Encapsulate a request as an object, thereby letting users parameterize clients with different requests, queue or log requests, and support undoable operations.

### Robert Nystrom's definition

A command is a reified method call.

### Copilot's definition

The Command Pattern encapsulates a request into an object, allowing clients to decouple the execution of a method from the object invoking it. It supports flexible request management, such as queuing, undo functionality, and parameterization of actions.

## Use Cases

1. **Undo/Redo Mechanisms**:

    When building applications like text editors, the Command Pattern allows for undoable operations by keeping a history of command objects.

1. **Macro Recording**

    Useful in software like game engines or automation tools, where a sequence of actions (commands) can be recorded and replayed.

1. **Queueing and Scheduling Tasks**

    Ideal for task schedulers or job queues, where commands need to be executed at specific times or in a particular order.

1. **Decoupled Functionality**

    Enables loose coupling between senders (who initiate the request) and receivers (who handle the request), making codebases easier to maintain and extend.

1. **Game Programming**

    In games, it allows binding user inputs (like key presses) to actions, enabling reconfigurable controls or AI-driven character actions.
  
## General Examples

### Example 1: Simple Command Pattern in JavaScript

<details>
<summary> code (👆 click here to show) </summary>

```javascript
// Command Interface
class Command {
  execute() {}
  undo() {}
}

// Receiver
class Light {
  on() {
    console.log("The light is on.");
  }
  off() {
    console.log("The light is off.");
  }
}

// Concrete Command
class LightOnCommand extends Command {
  constructor(light) {
    super();
    this.light = light;
  }
  execute() {
    this.light.on();
  }
  undo() {
    this.light.off();
  }
}

// Invoker
class RemoteControl {
  setCommand(command) {
    this.command = command;
  }
  pressButton() {
    this.command.execute();
  }
  pressUndo() {
    this.command.undo();
  }
}

// Client
const light = new Light();
const lightOn = new LightOnCommand(light);
const remote = new RemoteControl();

remote.setCommand(lightOn);
remote.pressButton();  // Output: The light is on.
remote.pressUndo();    // Output: The light is off.
```
</details>

---

This example demonstrates the core components of the Command Pattern: Command Interface, Receiver, Concrete Command, Invoker, and Client.

### Example 2: Queueing Commands

<details>
<summary> code (👆 click here to show) </summary>

```javascript
class TaskQueue {
  constructor() {
    this.queue = [];
  }
  addCommand(command) {
    this.queue.push(command);
  }
  processQueue() {
    while (this.queue.length > 0) {
      const command = this.queue.shift();
      command.execute();
    }
  }
}

class PrintCommand {
  constructor(message) {
    this.message = message;
  }
  execute() {
    console.log(this.message);
  }
}

const queue = new TaskQueue();
queue.addCommand(new PrintCommand("Task 1"));
queue.addCommand(new PrintCommand("Task 2"));
queue.processQueue();
// Output:
// Task 1
// Task 2
```

</details>

## PROS and CONS

<details><summary>PROS</summary>

1. **Encapsulation of Requests**:
    
    By turning requests into objects, the pattern decouples the sender from the receiver, enabling greater flexibility and modularity.

1. **Undo and Redo Operations**:
    
    Commands can store state, making it easy to implement undo/redo functionality in applications such as text editors or drawing tools.

1. **Queuing and Scheduling**:

    The pattern makes it straightforward to queue or schedule tasks, which is useful in job schedulers and task automation.

1. **Macro Support**:
    
    It allows grouping multiple commands into a macro, which can be executed as a single operation—useful for game development or batch processing.

1. **Parameterization**:
    
    Since commands are encapsulated in objects, they can be parameterized dynamically, allowing flexibility in executing different behaviors.

1. **Open/Closed Principle**:
    
    New commands can be introduced without modifying existing code, adhering to one of the SOLID design principles.

1. **Reusability**:

    Command objects can be reused for different operations or contexts, reducing code duplication.

</details>

<details><summary>CONS</summary>

1. **Increased Complexity**:
    
    Implementing the pattern requires creating multiple additional classes, which can bloat the codebase if not managed carefully.

1. **Overhead for Simple Tasks**:
    
    For straightforward operations, the complexity of the pattern might outweigh its benefits, making it overkill.

1. **Maintenance Challenges**:
    
    As the number of commands grows, managing and maintaining them can become burdensome.

1. **Debugging Difficulty**:

    Debugging may be more challenging due to the indirect nature of requests, as the invoker doesn’t directly execute operations.

</details>

---

This trade-off between flexibility and complexity is key to deciding when to use the Command Pattern. It tends to shine in scenarios where extensibility, undo/redo, or request management is critical.