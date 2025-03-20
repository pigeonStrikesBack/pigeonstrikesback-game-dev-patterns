# Observer Pattern

Want a more complete explanation? [read this](./observer.md)

## Definition

### Gang of Four's Definition
The Observer pattern is a behavioral design pattern where an object (subject) maintains a list of dependents (observers) that need to be notified of any changes to the subject's state. This allows one-to-many dependency relationships without tightly coupling the subject and the observers.

### Robert Nystrom's Definition (Summarized)
The Observer pattern provides a simple and efficient way to keep different parts of a program in sync with each other. Observers subscribe to subjects and are automatically notified when the state of the subject changes, ensuring that various systems react to changes without requiring explicit communication.

### AI-generated Definition
The Observer pattern decouples the observer (listener) and the subject (object being observed). It allows objects to subscribe and react to events in a system dynamically, facilitating flexible communication between disparate components. This is particularly useful in systems where one event can affect multiple components or require simultaneous updates across different systems.

## Use Cases
The Observer pattern is particularly useful in scenarios where:
- Multiple components need to be updated or notified of a change in another component’s state.
- Components need to act upon events (e.g., UI updates when game state changes).
- Loose coupling is needed to allow for changes to be made to the system without affecting other components.
- Common use cases in games include:
  - Achievement systems reacting to player actions.
  - UI components (like health bars, score counters) reacting to changes in game state.
  - Event-driven systems that listen to game events (e.g., level-ups, item pickups).

## General Examples

### Example 1: Game Achievement System

**Problem:** You have various game mechanics like combat, physics, and inventory, and you want to trigger achievements based on specific events, such as a character falling off a bridge.

**Solution (Observer):** The physics engine notifies the achievement system when certain events (e.g., falling off a bridge) occur. The achievement system listens to this event and unlocks the appropriate achievement.

```javascript
// Observer Interface
class Observer {
  onNotify(entity, event) {
    throw new Error('onNotify method should be implemented');
  }
}

// Concrete Observer - Achievement System
class AchievementSystem extends Observer {
  onNotify(entity, event) {
    if (event === 'ENTITY_FELL' && entity.isHero && entity.isOnBridge) {
      this.unlock('FELL_OFF_BRIDGE');
    }
  }

  unlock(achievement) {
    console.log(`Achievement unlocked: ${achievement}`);
  }
}

// Subject Interface
class Subject {
  constructor() {
    this.observers = [];
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  removeObserver(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  notify(entity, event) {
    this.observers.forEach(observer => observer.onNotify(entity, event));
  }
}

// Concrete Subject - Physics System
class PhysicsSystem extends Subject {
  updateEntity(entity) {
    // physics logic
    this.notify(entity, 'ENTITY_FELL');
  }
}

// Usage example
const physicsSystem = new PhysicsSystem();
const achievementSystem = new AchievementSystem();

physicsSystem.addObserver(achievementSystem);

// Simulating a scenario where the hero falls off a bridge
const hero = { isHero: true, isOnBridge: true };
physicsSystem.updateEntity(hero);
```

### Example 2: UI System Responding to Game State Changes

**Problem:** You have various UI components (health bar, score counter, etc.) that need to update in response to game state changes.

**Solution (Observer):** Each UI component listens to the game state (the subject) and updates itself when the game state changes (e.g., health or score changes).

```javascript
// Concrete Observer - Health UI
class HealthUI extends Observer {
  onNotify(entity, event) {
    if (event === 'HEALTH_CHANGED') {
      this.updateHealthBar(entity.health);
    }
  }

  updateHealthBar(health) {
    console.log(`Health bar updated: ${health}`);
  }
}

// Concrete Observer - Score UI
class ScoreUI extends Observer {
  onNotify(entity, event) {
    if (event === 'SCORE_CHANGED') {
      this.updateScoreDisplay(entity.score);
    }
  }

  updateScoreDisplay(score) {
    console.log(`Score display updated: ${score}`);
  }
}

// Subject - GameState
class GameState extends Subject {
  constructor() {
    super();
    this.health = 100;
    this.score = 0;
  }

  changeHealth(newHealth) {
    this.health = newHealth;
    this.notify(this, 'HEALTH_CHANGED');
  }

  changeScore(newScore) {
    this.score = newScore;
    this.notify(this, 'SCORE_CHANGED');
  }
}

// Usage example
const gameState = new GameState();
const healthUI = new HealthUI();
const scoreUI = new ScoreUI();

gameState.addObserver(healthUI);
gameState.addObserver(scoreUI);

// Simulating a change in health and score
gameState.changeHealth(80);
gameState.changeScore(100);
```

## PROS and CONS

<details><summary>PROS</summary>

- **Decoupling:** The Observer pattern provides a decoupled design, where the subject doesn’t need to know what observers are doing or how many observers there are. This leads to better maintainability and scalability of the system.
- **Flexibility:** New observers can be added at runtime without modifying the subject or other observers. This allows for dynamic behavior in response to events.
- **Loose Coupling:** Subjects and observers are loosely coupled, meaning changes in one part of the system (e.g., the subject) don’t necessarily affect others (e.g., observers), making the system more flexible to change.
- **Reusability:** Observers can be reused across different subjects, reducing code duplication and promoting reusability.
- **Simplifies Communication:** Ideal for systems that require one-to-many communication without the need for direct interaction between objects.

</details>

<details><summary>CONS</summary>

- **Performance Concerns:** If not carefully managed, the Observer pattern can lead to performance issues, particularly in systems with a large number of observers or frequent notifications.
- **Tight Dependency on Notifications:** Observers may become tightly dependent on the notifications, which can lead to complicated dependencies and unintended side effects.
- **Potential Memory Leaks:** If observers aren’t properly deregistered, they can cause memory leaks or zombies in garbage-collected systems.
- **Difficulty in Debugging:** Because communication is dynamic, debugging can be harder. It may not be immediately clear who is listening to which events.
- **Overuse of the Pattern:** In scenarios where components are tightly coupled, using the Observer pattern can add unnecessary complexity and reduce clarity.
</details>

---

## Conclusion

The **Observer pattern** is a powerful and flexible solution for decoupling components in a system, enabling multiple observers to listen for events and act accordingly. It shines in scenarios where components need to respond to changes without being tightly coupled, such as in game development, user interface updates, or event-driven architectures. However, it’s essential to carefully manage observer lifecycles and performance to avoid issues like memory leaks and inefficient communication.

By understanding the **pros** and **cons** of the Observer pattern and applying it judiciously, you can harness its power while mitigating potential pitfalls, ensuring that your code remains maintainable, scalable, and performant.