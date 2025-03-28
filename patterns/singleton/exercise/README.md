## Description

This project is a simple 2D game built with the **Phaser 3** framework. It demonstrates key programming concepts, such as the **Singleton pattern**, the **Observer pattern**, and modular design principles. The gameplay involves interacting with enemies by clicking on them to earn points, unlocking achievements, and managing game systems efficiently.

## Key Features

### Singleton Pattern: **GameManager**
The **GameManager** class is implemented as a Singleton to ensure there is only one central instance responsible for managing the game's state and systems. It includes:
- **[EventManager](js/EventManager.js)**: A custom event system based on the Observer pattern to handle events like score updates and enemy kills.
- **[AudioManager](js/AudioManager.js)**: A centralized audio system to manage preloaded sounds and playback.
- **[AchievementManager](js/AchievementManager.js)**: A system for tracking player progress and unlocking achievements based on predefined criteria.

The Singleton pattern ensures that game systems remain consistent, with one authoritative instance shared across all scenes. The full implementation of the **GameManager** can be found [here](js/GameManager.js).

### Additional Features:
- **Event-Driven Architecture**: The [`EventManager`](js/EventManager.js) allows modular components like the `GameScene`, [`AudioManager`](js/AudioManager.js), and [`AchievementManager`](js/AchievementManager.js) to communicate via events.
- **Reset Mechanism**: The [`GameManager`](js/GameManager.js) and all sub-managers now include a `reset()` function to clean up state and prepare for a restart.
- **Achievement System**: Unlock achievements at different score milestones, with both visual and audio feedback.
- **Enemy Behavior**: Enemies, defined in [`GameObjects.js`](js/GameObjects.js), move in circular paths, spawn up to a maximum of 10 at a time, and are destroyed upon player interaction.
- **Dynamic UI**: A live-updating score label and achievement notifications add interactivity and polish to the game.

## File Structure

The project is structured into modular JavaScript files, each handling specific aspects of the game:

1. **[`AudioManager.js`](js/AudioManager.js)**: Manages sound assets, including playback and reset functionality.
2. **[`EventManager.js`](js/EventManager.js)**: Implements a custom event system using the Observer pattern.
3. **[`GameManager.js`](js/GameManager.js)**: A Singleton class that centralizes game-wide logic and acts as a hub for game systems.
4. **[`AchievementManager.js`](js/AchievementManager.js)**: Tracks player progress and triggers achievements based on the score.
5. **[`UI.js`](js/UI.js)**: Defines reusable UI components, such as buttons.
6. **[`GameObjects.js`](js/GameObjects.js)**: Contains the `Enemy` class, which manages enemy movement, interaction, and cleanup.
7. **[`Scenes.js`](js/Scenes.js)**: Defines the game's flow, including an initialization (`InitScene`) and the main gameplay (`GameScene`) scene.

## How the Game Works

1. **Initialization**: The [`InitScene`](js/Scenes.js) preloads assets and initializes the [`GameManager`](js/GameManager.js), ensuring only one instance is shared across scenes.
2. **Gameplay**:
   - Enemies, defined in [`GameObjects.js`](js/GameObjects.js), spawn dynamically in the `GameScene` (up to 10 on screen at a time).
   - Players interact with enemies by clicking them, which awards points and destroys the enemy.
   - Achievements are unlocked when the score reaches milestones (e.g., 50, 100, 500).
   - Dynamic UI updates include a live score label and achievement notifications.
3. **Reset**: A restart button resets the game state using the [`GameManager.reset()`](js/GameManager.js) function.

## Lessons Learned

This project demonstrates how design patterns like the Singleton and Observer patterns can make game development more maintainable and scalable. By modularizing the codebase and using event-driven communication, the project achieves efficient and organized gameplay mechanics.