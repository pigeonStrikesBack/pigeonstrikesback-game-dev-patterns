Objective:

Implement a Pushdown Automaton (PDA) to manage temporary actions like firing, where the character pushes the firing state onto the stack and returns to the previous state once firing is completed.

Key Concepts:

Pushdown Automaton (PDA): A PDA allows states to be pushed onto a stack for temporary actions, such as firing. Once the action is complete, the previous state is popped off the stack.

State Stack: The PDA uses a stack to remember the character’s previous state (e.g., walking, standing) while performing a temporary action (e.g., firing).

State Transitions: Firing causes the character to push the firing state onto the stack, and once finished, it pops the firing state and restores the previous state.