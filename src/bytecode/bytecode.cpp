#include <iostream>
#include <vector>
#include <stdexcept>

// Define a simple instruction set for our spell VM
enum class Instruction {
    LITERAL,     // Push a literal integer onto the stack
    ADD,         // Pop two values, add them, push the result
    SUB,         // Pop two values, subtract (second - top), push the result
    MUL,         // Pop two values, multiply them, push the result
    DIV,         // Pop two values, divide (second / top), push the result
    SET_HEALTH,  // Pop health amount, pop wizard ID, set wizard health
    GET_HEALTH,  // Pop wizard ID, push wizard health
    PLAY_SOUND   // Pop sound ID, simulate playing a sound
};

// Represents a single bytecode instruction, possibly with an argument
struct Bytecode {
    Instruction instruction;
    int argument; // Optional argument for instructions like LITERAL
};

// helper function for debugging, gives you the name of instruction
std::string instructionToString(Instruction instruction) {
    switch (instruction) {
        case Instruction::LITERAL: return "LITERAL";
        case Instruction::ADD: return "ADD";
        case Instruction::SUB: return "SUB";
        case Instruction::MUL: return "MUL";
        case Instruction::DIV: return "DIV";
        case Instruction::SET_HEALTH: return "SET_HEALTH";
        case Instruction::GET_HEALTH: return "GET_HEALTH";
        case Instruction::PLAY_SOUND: return "PLAY_SOUND";
        default: return "UNKNOWN";
    }
}

// Our simple stack-based Virtual Machine for spells
class VM {
public:
    VM() : wizardHealths_{100, 80} {} // Initialize health for two wizards

    void interpret(const std::vector<Bytecode>& bytecode) {
        stack_.clear(); // Clear the stack before interpreting a new spell

        for (size_t i = 0; i < bytecode.size(); ++i) {
            const Bytecode& instruction = bytecode[i];

#ifdef DEBUG
            // Debug: Print the current instruction and stack state
            std::cout << "Executing Instruction: " << instructionToString(instruction.instruction)
                      << " (Argument: " << instruction.argument << ")" << std::endl;
            std::cout << "Stack before execution: ";
            printStack();
#endif

            switch (instruction.instruction) {
                case Instruction::LITERAL:
                    push(instruction.argument); // Push the literal value onto the stack
                    break;
                case Instruction::ADD: {
                    int operand2 = pop();
                    int operand1 = pop();
                    push(operand1 + operand2); // Pop two, add, push
                    break;
                }
                case Instruction::SUB: {
                    int operand2 = pop();
                    int operand1 = pop();
                    push(operand1 - operand2);
                    break;
                }
                case Instruction::MUL: {
                    int operand2 = pop();
                    int operand1 = pop();
                    push(operand1 * operand2);
                    break;
                }
                case Instruction::DIV: {
                    int operand2 = pop();
                    int operand1 = pop();
                    if (operand2 == 0) {
                        throw std::runtime_error("Division by zero!");
                    }
                    push(operand1 / operand2);
                    break;
                }
                case Instruction::SET_HEALTH: {
                    int health = pop();
                    int wizardId = pop();
                    if (wizardId >= 0 && wizardId < wizardHealths_.size()) {
                        wizardHealths_[wizardId] = health; // Set the health of the specified wizard
#ifdef DEBUG
                        std::cout << "Wizard " << wizardId << " health set to " << health << std::endl;
#endif
                    } else {
                        std::cerr << "Error: Invalid wizard ID: " << wizardId << std::endl;
                    }
                    break;
                }
                case Instruction::GET_HEALTH: {
                    int wizardId = pop();
                    if (wizardId >= 0 && wizardId < wizardHealths_.size()) {
                        push(wizardHealths_[wizardId]); // Push the health of the specified wizard onto the stack
#ifdef DEBUG
                        std::cout << "Pushed Wizard " << wizardId << " health (" << wizardHealths_[wizardId] << ") onto the stack." << std::endl;
#endif
                    } else {
                        std::cerr << "Error: Invalid wizard ID: " << wizardId << std::endl;
                    }
                    break;
                }
                case Instruction::PLAY_SOUND: {
                    int soundId = pop();
#ifdef DEBUG
                    std::cout << "Playing sound with ID: " << soundId << std::endl; // Simulate playing a sound
#endif
                    break;
                }
                default:
                    std::cerr << "Error: Unknown instruction." << std::endl;
                    return;
            }

#ifdef DEBUG
            // Debug: Print the stack state after execution
            std::cout << "Stack after execution: ";
            printStack();
            std::cout << std::endl;
#endif
        }

        std::cout << "Spell execution finished." << std::endl;
    }

    // Get the current health of all wizards
    void printWizardHealth() const {
        for (size_t i = 0; i < wizardHealths_.size(); ++i) {
            std::cout << "Wizard " << i << " Health: " << wizardHealths_[i] << std::endl;
        }
    }

    std::vector<int> &getStack() {
        return stack_;
    }

    void printStack() const {
        if (stack_.empty()) {
            std::cout << "[Empty]" << std::endl;
        } else {
            for (int value : stack_) {
                std::cout << value << " ";
            }
            std::cout << std::endl;
        }
    }

private:
    void push(int value) {
        if (stack_.size() >= maxStackSize_) {
            throw std::runtime_error("Stack overflow!"); // Prevent stack overflow
        }
        stack_.push_back(value); // Push a value onto the stack
    }

    int pop() {
        if (stack_.empty()) {
            throw std::runtime_error("Stack underflow!"); // Ensure the stack is not empty before popping
        }
        int value = stack_.back();
        stack_.pop_back();
        return value; // Pop a value from the stack
    }

    std::vector<int> stack_; // The operand stack for our VM
    std::vector<int> wizardHealths_; // Simulate game state (wizard health)
    static const size_t maxStackSize_ = 128; // Limit the stack size
};



int main() {
    VM vm;

    std::cout << "Initial Wizard Health:" << std::endl;
    vm.printWizardHealth();
    std::cout << std::endl;

    // Example spell 1: Set player (wizard 0) health to 50
    std::cout << "Executing Spell 1: Set Player Health to 50" << std::endl;
    std::vector<Bytecode> spell1 = {
        {Instruction::LITERAL, 0},      // Push wizard ID 0 (player)
        {Instruction::LITERAL, 50},     // Push health value 50
        {Instruction::SET_HEALTH, 0}   // Set health
    };
    vm.interpret(spell1);
    vm.printWizardHealth();
    std::cout << std::endl;

    // Example spell 2: Increase player (wizard 0) health by 10
    std::cout << "Executing Spell 2: Increase Player Health by 10" << std::endl;
    std::vector<Bytecode> spell2 = {
        {Instruction::LITERAL, 0},      // Push wizard ID 0
        {Instruction::LITERAL, 0},      // Push wizard ID 0
        {Instruction::GET_HEALTH, 0},   // Get current health
        {Instruction::LITERAL, 10},     // Push value 10
        {Instruction::ADD, 0},          // Add current health and 10
        {Instruction::SET_HEALTH, 0}   // Set new health
    };
    vm.interpret(spell2);
    vm.printWizardHealth();
    std::cout << std::endl;

    // Example spell 3: Make opponent (wizard 1) lose 20 health and play a sound
    std::cout << "Executing Spell 3: Make Opponent Lose 20 Health and Play Sound 123" << std::endl;
    std::vector<Bytecode> spell3 = {
        {Instruction::LITERAL, 1},      // Push wizard ID 1
        {Instruction::LITERAL, 1},      // Push wizard ID 1 (opponent)
        {Instruction::GET_HEALTH, 0},   // Get opponent's current health
        {Instruction::LITERAL, 20},     // Push damage amount 20
        {Instruction::SUB, 0},          // Subtract 20 from health
        {Instruction::SET_HEALTH, 0},   // Set new health
        {Instruction::LITERAL, 123},    // Push sound ID 123
        {Instruction::PLAY_SOUND, 0}   // Play the sound
    };
    vm.interpret(spell3);
    vm.printWizardHealth();
    std::cout << std::endl;

    // Example of a calculation: (5 + 3) * 2
    std::cout << "Executing Spell 4: Calculation (5 + 3) * 2" << std::endl;
    std::vector<Bytecode> spell4 = {
        {Instruction::LITERAL, 5},
        {Instruction::LITERAL, 3},
        {Instruction::ADD, 0},
        {Instruction::LITERAL, 2},
        {Instruction::MUL, 0}
    };
    vm.interpret(spell4);
    if (!vm.getStack().empty()) {
        std::cout << "Calculation result on stack: " << vm.getStack().back() << std::endl;
    }
    std::cout << std::endl;

    return 0;
}


/*
**Explanation:**

1.  **Instruction Set (`enum class Instruction`)**: We define a simple set of instructions that our virtual machine will understand. These include pushing literal values onto the stack (`LITERAL`), basic arithmetic operations (`ADD`, `SUB`, `MUL`, `DIV`), setting and getting wizard health (`SET_HEALTH`, `GET_HEALTH`), and playing a sound (`PLAY_SOUND`).

2.  **Bytecode (`struct Bytecode`)**: A `Bytecode` structure holds an `Instruction` and an optional integer `argument`. This allows us to represent instructions that require immediate data, like pushing a specific number onto the stack (`LITERAL`).

3.  **Virtual Machine (`class VM`)**:
    *   It maintains a `stack_` (a `std::vector` of integers) which is central to the operation of a stack-based VM. Instructions will push operands onto this stack and pop results off of it.
    *   `wizardHealths_` simulates a small part of the game state, storing the health of two wizards.
    *   `push(int value)` adds a value to the top of the stack, with a check for stack overflow.
    *   `pop()` removes and returns the top value from the stack, with a check for stack underflow.
    *   `interpret(const std::vector<Bytecode>& bytecode)` is the core of the VM. It iterates through the provided bytecode instructions and executes them one by one using a `switch` statement. Each case in the `switch` corresponds to an instruction, popping operands from the stack, performing the operation, and pushing the result back onto the stack (if applicable). For `SET_HEALTH` and `GET_HEALTH`, it interacts with the `wizardHealths_` array. `PLAY_SOUND` simulates playing a sound based on an ID.
    *   `printWizardHealth()` is a utility function to display the current health of the wizards.

4.  **`main()` Function**:
    *   An instance of the `VM` is created.
    *   Initial wizard health is printed.
    *   Several example spells are defined as `std::vector<Bytecode>`.
    *   Each spell is interpreted by calling `vm.interpret()`.
    *   After each spell, the wizard health is printed to show the effects.
    *   An example of a pure calculation using the stack is also demonstrated.

**Expected Output:**

Initial Wizard Health:
Wizard 0 Health: 100
Wizard 1 Health: 80

Executing Spell 1: Set Player Health to 50
Wizard 0 health set to 50
Spell execution finished.
Wizard 0 Health: 50
Wizard 1 Health: 80

Executing Spell 2: Increase Player Health by 10
Pushed Wizard 0 health (50) onto the stack.
Wizard 0 health set to 60
Spell execution finished.
Wizard 0 Health: 60
Wizard 1 Health: 80

Executing Spell 3: Make Opponent Lose 20 Health and Play Sound 123
Pushed Wizard 1 health (80) onto the stack.
Wizard 1 health set to 60
Playing sound with ID: 123
Spell execution finished.
Wizard 0 Health: 60
Wizard 1 Health: 60

Executing Spell 4: Calculation (5 + 3) * 2
Spell execution finished.
Calculation result on stack: 16

This simple example demonstrates the fundamental concepts of a stack-based bytecode VM for executing spells. More complex VMs would have a richer instruction set, support different data types, and potentially include control flow instructions. You would also need a front-end (like a simple parser) to translate a higher-level spell description into this low-level bytecode.
*/