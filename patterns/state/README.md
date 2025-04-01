# State Pattern

📑 [Click here](./state.md) if you wanna read more about this pattern

## Definition

### Gang of Four's definition  

The **State Pattern** allows an object to change its behavior when its internal state changes. The object will appear to change its class.

### Robert Nystrom's definition  

The **State Pattern** encapsulates different behaviors for a specific state of an object in separate state classes. It lets you create objects that can transition through different states, each with its own specific behavior. The state machine can change its current state to simulate different behaviors of the object.

### AI-generated definition  

The **State Pattern** is a design pattern used to allow an object to alter its behavior based on its state. By encapsulating state-specific behaviors in distinct state classes, an object can transition between states and execute the behavior associated with the current state, allowing for flexibility and easier state management.

## Use Cases

### Game Character State Management

In a game, a character's actions change depending on whether they are standing, running, jumping, or ducking. Each state has its own behavior, and the character transitions between states based on player inputs.

### UI Workflow

A user interface (UI) element, such as a menu, has different states like **Main Menu**, **Settings Menu**, and **Game Screen**. Transitions occur when the user selects different options, and each menu state will have specific behavior.

### Network Protocols

A network protocol system, like a connection handler, may be in different states such as **Connecting**, **Connected**, and **Disconnected**. The behavior of the handler changes depending on its state.

## General Examples

### Example 1: Game Character State

A character in a game can have different states such as **RunningState**, **JumpingState**, and **DuckingState**. Depending on the user's input, the character transitions between these states.

<details>
<summary> code (👆 click here to show) </summary>

```js
class HeroineState {
  handleInput(heroine, input) {}
  enter(heroine) {}
}

class StandingState extends HeroineState {
  handleInput(heroine, input) {
    if (input === 'PRESS_DOWN') {
      return new DuckingState();
    }
  }

  enter(heroine) {
    heroine.setGraphics('IMAGE_STAND');
  }
}

class DuckingState extends HeroineState {
  handleInput(heroine, input) {
    if (input === 'RELEASE_DOWN') {
      return new StandingState();
    }
  }

  enter(heroine) {
    heroine.setGraphics('IMAGE_DUCK');
  }
}

class Heroine {
  constructor() {
    this.state = new StandingState();
  }

  handleInput(input) {
    const newState = this.state.handleInput(this, input);
    if (newState) {
      this.state = newState;
      this.state.enter(this);
    }
  }

  setGraphics(image) {
    console.log(`Character graphics set to: ${image}`);
  }
}

const heroine = new Heroine();
heroine.handleInput('PRESS_DOWN');
heroine.handleInput('RELEASE_DOWN');
```

</details>

### Example 2: UI Menu Navigation

An example where a UI system has states like **Main Menu**, **Options Menu**, and **Game Screen**. Each state handles input differently.

<details>
<summary> code (👆 click here to show) </summary>

```js
class MenuState {
  handleInput(menu, input) {}
  enter(menu) {}
}

class MainMenuState extends MenuState {
  handleInput(menu, input) {
    if (input === 'SELECT_OPTION') {
      return new OptionsMenuState();
    }
  }

  enter(menu) {
    console.log('Entered Main Menu');
  }
}

class OptionsMenuState extends MenuState {
  handleInput(menu, input) {
    if (input === 'SELECT_OPTION') {
      return new GameScreenState();
    }
  }

  enter(menu) {
    console.log('Entered Options Menu');
  }
}

class GameScreenState extends MenuState {
  handleInput(menu, input) {
    if (input === 'EXIT_GAME') {
      return new MainMenuState();
    }
  }

  enter(menu) {
    console.log('Entered Game Screen');
  }
}

class Menu {
  constructor() {
    this.state = new MainMenuState();
  }

  handleInput(input) {
    const newState = this.state.handleInput(this, input);
    if (newState) {
      this.state = newState;
      this.state.enter(this);
    }
  }
}

const menu = new Menu();
menu.handleInput('SELECT_OPTION');
menu.handleInput('SELECT_OPTION');
menu.handleInput('EXIT_GAME');
```

</details>

## PROS and CONS

<details><summary>PROS</summary>

- Makes the state transitions explicit and easier to manage.
- Simplifies the management of state-specific behavior by encapsulating it in separate classes.
- Encourages the separation of concerns, improving code maintainability.
- Useful in systems with well-defined states and transitions.

</details>

<details><summary>CONS</summary>

- Can lead to a large number of classes if there are many states.
- Complex interactions between states can make the code harder to manage.
- Not suitable for systems with dynamic states or systems that require a large amount of flexibility beyond predefined states.

</details>

## Conclusion

The **State Pattern** is an excellent choice when dealing with systems where an object’s behavior is strongly dependent on its state, and these states can be easily defined. It offers simplicity, clear structure, and better maintainability by encapsulating state-specific behavior. However, it may not be the best option for more dynamic systems where the number of states grows significantly or where flexibility is needed beyond simple state transitions.