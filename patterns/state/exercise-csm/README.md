Objective:

Implement a Concurrent State Machine (CSM) for the character, where multiple states (e.g., movement and jumping) can occur simultaneously. This demonstrates how to use multiple FSMs working together.

Key Concepts:

Concurrent State Machine (CSM): Unlike FSMs, CSMs allow multiple states to be active at once. For instance, you can move left and right while also jumping at the same time.

Separate FSMs: One FSM handles horizontal movement, and another FSM handles jumping. These two FSMs can run concurrently without affecting each other.