# Exercise 2: Undo System (Stack-Based)

## Goal:

Expand the previous exercise by adding an undo feature using a stack.

## Instructions:

- Maintain a stack of executed commands.
- When a command is executed, push it onto the stack.
- When the undo key is pressed, pop the last command and reverse it.

## Example Usage:

- Player moves right
    
    Stored in the stack.

- Player moves up
    
    Stored in the stack.

- Player presses Undo
    
    Moves back down.

- Player presses Undo again
    
    Moves back left.