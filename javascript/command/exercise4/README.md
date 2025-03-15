# Exercise 4: AI Commands (Scripting NPC Behavior)

## Goal:

Use the Command Pattern to script NPC behavior dynamically.

## Instructions:

- Define different commands: `PatrolCommand`, `AttackCommand`, `FleeCommand`.
- Assign a list of commands to an NPC AI.
- The NPC should execute commands based on conditions (e.g., attack when close to the player).

## Example Usage:

- If the player is far, execute `PatrolCommand()`.
- If the player is near, execute `AttackCommand()`.
- If health is low, execute `FleeCommand()`.
