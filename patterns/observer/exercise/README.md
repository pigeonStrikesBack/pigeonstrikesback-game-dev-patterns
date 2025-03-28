## Observer-Based Game UI and Achievement System
This exercise demonstrates the implementation of an **Observer-based UI System** and an **Achievement System** within a Phaser-based game. The game features an interactive monster-killing mechanic, where achievements are unlocked based on player progress.

## Features Implemented
### 1. Observer System
- A generic `Observer` class that allows UI elements and achievement tracking to react to game events dynamically.

### 2. UI System
- The `UISystem` class manages the display of:
  - **Monsters on Screen**
  - **Monsters Killed**
- Uses the `Observer` pattern to update UI in real time.

### 3. Achievement System
- The `AchievementSystem` tracks the number of monsters killed and unlocks milestones.
- Displays achievement notifications and plays a sound when an achievement is unlocked.

### 4. Interactive Game Entities
- **Monsters** move in a circular pattern and can be clicked to be "killed."
- **Buttons** allow for restarting the game and spawning more monsters.

### 5. Main Game Loop
- Manages monster spawning, UI updates, and achievement tracking.

## How It Works
1. **Killing a Monster**
   - Clicking a monster reduces its health to zero, triggering `removeMonster`.
   - The monster is removed, a new one spawns, and the UI updates.
   - If a milestone is reached, an achievement notification appears.
   
2. **Achievement Notifications**
   - After certain numbers of kills (1, 10, 25, 50, 100, etc.), a message appears.
   - An achievement sound plays.

3. **Observer Pattern Usage**
   - `UISystem` listens for game updates and refreshes the UI automatically.
   - `AchievementSystem` listens for kills and unlocks achievements accordingly.

## Summary
This exercise showcases how the **Observer Pattern** enhances game design by:
- Decoupling UI updates from game logic.
- Managing achievements dynamically.
- Keeping the game loop clean and efficient.


