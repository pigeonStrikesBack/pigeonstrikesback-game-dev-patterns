# Exercises

## Exercise 1: Basic Command Execution

### Goal:

Implement a command system for a player to move in four directions using commands.

### Instructions:

1. Create a MoveCommand class that takes a direction (up, down, left, right).

1. The player should execute the movement by calling execute() on the command.

1. Store the last command in case you need to undo it later.

### Example Usage:

- Pressing W
    
    Executes MoveCommand("up").

- Pressing S
    
    Executes MoveCommand("down").

- Pressing Z

    Undo the last move.

## Exercise 2: Undo System (Stack-Based)

### Goal:

Expand the previous exercise by adding an undo feature using a stack.

### Instructions:

- Maintain a stack of executed commands.
- When a command is executed, push it onto the stack.
- When the undo key is pressed, pop the last command and reverse it.

### Example Usage:

- Player moves right
    
    Stored in the stack.

- Player moves up
    
    Stored in the stack.

- Player presses Undo
    
    Moves back down.

- Player presses Undo again
    
    Moves back left.

## Exercise 3: Command Queue (Macro Actions)

Goal: Implement a command queue that allows queuing multiple actions and executing them in sequence.

### Instructions:

Create a CommandQueue class that stores commands in a list.
Allow the player to queue multiple actions before executing them.
When a "Play" button is pressed, execute all commands in order.

### Example Usage:

1. Player queues Move Right, Jump, Attack.

2. Press Execute
    
    - The character performs all actions in sequence.

## Exercise 4: AI Commands (Scripting NPC Behavior)

### Goal:

Use the Command Pattern to script NPC behavior dynamically.

### Instructions:

- Define different commands: `PatrolCommand`, `AttackCommand`, `FleeCommand`.
- Assign a list of commands to an NPC AI.
- The NPC should execute commands based on conditions (e.g., attack when close to the player).

### Example Usage:

- If the player is far, execute `PatrolCommand()`.
- If the player is near, execute `AttackCommand()`.
- If health is low, execute `FleeCommand()`.
