# Bytecode Pattern

📑 [Click here](./bytecode.md) if you wanna read more about this pattern

## Definition

### Gang of Four's definition

The provided sources do not contain a definition of the Bytecode pattern from the Gang of Four.

### Robert Nystrom's definition

Give behavior the **flexibility of data by encoding it as instructions for a virtual machine**. An instruction set defines the low-level operations that can be performed. A series of instructions is encoded as a sequence of bytes. A virtual machine executes these instructions one at a time, using a stack for intermediate values. By combining instructions, complex high-level behavior can be defined.

### AI-generated definition

The provided sources do not contain an AI-generated definition of the Bytecode pattern.

## Use Cases

### Use case 1: Defining a lot of behavior

The Bytecode pattern is useful when you have a **lot of behavior** that needs to be defined.

### Use case 2: Unsuitable implementation language

Use it when your game’s **implementation language isn’t a good fit** because it’s too low-level, iterating on it takes too long, or it has too much trust. For example, if you want to ensure the behavior being defined can’t break the game, you need to sandbox it from the rest of the codebase.

### Use case 3: Supporting modding

When you want to **support modding** and allow users to create their own game logic without needing a full compiler toolchain or risking crashing the game.

### Use case 4: Easy modification and reloading

For behavior that needs to be **easily modifiable** and **reloadable** without patching the game executable.

### Use case 5: Physical separation of behavior

When behavior needs to be **physically separate from the rest of the executable**.

## General Examples

### Example 1: Simple Instruction Set

```cpp
enum Instruction {
  INST_SET_HEALTH      = 0x00,
  INST_SET_WISDOM      = 0x01,
  INST_SET_AGILITY     = 0x02,
  INST_PLAY_SOUND      = 0x03,
  INST_SPAWN_PARTICLES = 0x04
};
```
This enumerates a simple set of instructions where each operation is assigned a byte value. A spell can then be encoded as a list of these bytes.

```cpp
switch (instruction) {
  case INST_SET_HEALTH:
    // ...
    break;
  case INST_PLAY_SOUND:
    // ...
    break;
  // ... other cases
}
```
This shows how a virtual machine can interpret a single bytecode instruction by using a switch statement to dispatch to the corresponding game logic.

### Example 2: Stack-Based VM Instruction

```cpp
enum Instruction {
  INST_LITERAL       = 0x00,
  INST_SET_HEALTH    = 0x01,
  // ...
};

class VM {
private:
  void push(int value) { /* ... */ }
  int pop() { /* ... */ }
  void setHealth(int wizard, int amount) { /* ... */ }
public:
  void interpret(char bytecode[], int size) {
    for (int i = 0; i < size; i++) {
      char instruction = bytecode[i];
      switch (instruction) {
        case INST_SET_HEALTH: {
          int amount = pop();
          int wizard = pop();
          setHealth(wizard, amount);
          break;
        }
        case INST_LITERAL: {
          int value = bytecode[++i];
          push(value);
          break;
        }
        // ...
      }
    }
  }
};
```
This example demonstrates a simplified stack-based virtual machine. The `INST_LITERAL` instruction pushes a value onto the stack, and `INST_SET_HEALTH` pops the wizard and amount from the stack before setting the health.

## PROS and CONS

**PROS**

-   Provides **flexibility of data**, allowing behavior to be defined in separate data files, making modification and reloading easier without recompilation.
-   Enables **sandboxing** of behavior, preventing potentially harmful code from breaking the game engine.
-   Offers **better performance** compared to higher-level interpretations like the Interpreter pattern.
-   Results in a **smaller footprint** as bytecode is typically more compact than other representations of behavior.

**CONS**

-   It is the **most complex pattern** and should not be used lightly, requiring the implementation of a virtual machine.
-   Necessitates a **front-end (compiler or authoring tool)** to translate a higher-level representation of behavior into bytecode.
-   Presents **debugging challenges** as standard debugging tools are not directly applicable to custom bytecode.
-   Carries the **risk of language creep**, where the instruction set can grow in an ad-hoc way if its scope is not carefully controlled.

## Conclusion

The Bytecode pattern offers a powerful approach to defining game behavior by encoding it as instructions for a virtual machine, providing benefits like flexibility, sandboxing, and improved performance over direct interpretation. However, it introduces significant complexity, requiring the development of a VM and bytecode generation tools, and poses debugging challenges. This pattern is most suitable when a large amount of sandboxed, modifiable behavior is needed and the trade-offs in complexity are acceptable.