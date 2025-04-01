Objective:

Implement a Hierarchical State Machine (HSM), where the character’s state can be nested within another state (e.g., walking and firing). The movement logic should be separated from firing logic, but both should work simultaneously based on input.

Key Concepts:

Hierarchical State Machine (HSM): HSMs allow states to be nested within other states. For example, the "firing" state can be part of the "walking" or "jumping" state, and the state transitions reflect these relationships.

State Inheritance: In this example, firing is handled as a substate of walking or jumping, which reduces redundancy and makes the system more maintainable.