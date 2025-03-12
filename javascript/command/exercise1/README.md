# Exercise 1: Basic Command Execution

## Goal:

Implement a command system for a player to move in four directions using commands.

## Instructions:

1. Create a MoveCommand class that takes a direction (up, down, left, right).

1. The player should execute the movement by calling execute() on the command.

1. Store the last command in case you need to undo it later.

## Example Usage:

- Pressing W
    
    Executes MoveCommand("up").

- Pressing S
    
    Executes MoveCommand("down").

- Pressing Z

    Undo the last move.