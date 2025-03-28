# Singleton Pattern

📑 [Click here](./singleton.md) if you wanna read more about this pattern

## Definition

### Gang of Four's definition  

Ensure a class has only one instance and provide a global point of access to it.

### Robert Nystrom's definition  

Singleton ensures a single instance of a class but can introduce unnecessary global state, making code harder to maintain.

### AI-generated definition  

The Singleton pattern restricts the instantiation of a class to a single object and provides a controlled access point to it.

## Use Cases

### Centralized Resource Management  

Singleton is useful when managing access to a shared resource, such as a file system or logging service.

### Game State Management  

In game development, Singleton can be used for managing game state, audio systems, or input handlers.

## General Examples

### Example 1: Logger  

A simple logger that ensures only one instance is used throughout the application.

<details>
<summary> code (👆 click here to show) </summary>

```js
class Logger {
  constructor() {
    if (!Logger.instance) {
      Logger.instance = this;
    }
    return Logger.instance;
  }

  log(message) {
    console.log(`[LOG]: ${message}`);
  }
}

const logger1 = new Logger();
const logger2 = new Logger();

logger1.log("Hello, World!");
console.log(logger1 === logger2); // true
```

</details>

### Example 2: Game Settings  

A Singleton for managing game configuration settings.

<details>
<summary> code (👆 click here to show) </summary>

```js
class GameSettings {
  constructor() {
    if (!GameSettings.instance) {
      this.settings = { difficulty: "normal", volume: 50 };
      GameSettings.instance = this;
    }
    return GameSettings.instance;
  }

  setSetting(key, value) {
    this.settings[key] = value;
  }

  getSetting(key) {
    return this.settings[key];
  }
}

const settings1 = new GameSettings();
const settings2 = new GameSettings();

settings1.setSetting("difficulty", "hard");

console.log(settings2.getSetting("difficulty")); // "hard"
console.log(settings1 === settings2); // true
```

</details>

## PROS and CONS

<details><summary>PROS</summary>

- Ensures a single instance of a class, preventing duplication.
- Centralized access to shared resources.
- Lazy initialization can improve performance.

</details>

<details><summary>CONS</summary>

- Introduces global state, making debugging harder.
- Increases coupling between classes, reducing flexibility.
- Difficult to manage in multi-threaded applications.

</details>

## Conclusion

The Singleton pattern is useful for managing shared resources but should be used cautiously due to its potential downsides, such as increased coupling and global state management. Alternative approaches, like dependency injection or service locators, can sometimes be better choices.

[Exercise](./exercise/README.md)