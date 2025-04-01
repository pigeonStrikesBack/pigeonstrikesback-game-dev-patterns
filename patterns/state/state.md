# Introduction to the State Pattern  

This chapter covers the **State design pattern**, but it also explores broader **finite state machines (FSMs)**, **hierarchical state machines**, and **pushdown automata**. These concepts are widely used in AI and compiler development but are often overlooked in other programming domains, including game development.  

The author introduces these ideas by applying them to a different kind of problem, demonstrating their relevance beyond AI. The connection to early AI research is highlighted, noting how techniques originally developed for natural language processing later became fundamental in compiler design.  

The chapter aims to provide a clear, high-level understanding of state machines and their importance in structuring game logic, even if some implementation details are left out.

## The Problem with Mutable State  

The initial implementation of handling the heroine’s movement in a platformer game quickly runs into **bugs and complexity issues**. The naive approach uses **boolean flags** (`isJumping_`, `isDucking_`, etc.) to track the character’s state, but this leads to:  

- **Conflicting states** (e.g., jumping while ducking).  
- **Unintended transitions** (e.g., switching to a standing graphic mid-air).  
- **More conditions needed** as new actions are added.  

Each time a new move is introduced (e.g., dive attack), another bug emerges, requiring yet another flag to fix it. This approach makes the code fragile and difficult to maintain.  

Experienced developers recognize **complex branching logic** and **mutable state** as error-prone, leading to **unpredictable behavior**. A better solution is needed—**one that encapsulates state transitions properly**.

# Finite State Machines (FSMs) to the Rescue  

To address the **bug-prone complexity** of handling different actions using boolean flags, we can use a **Finite State Machine (FSM)**.  

# **Key Concepts of FSMs:**  

1. **Fixed Set of States**
    
    The heroine can only be in one state at a time (e.g., standing, jumping, ducking, diving).  

2. **Exclusive State**

    Prevents conflicting states (e.g., standing and jumping at the same time).  

3. **Inputs & Transitions**

    Each state has predefined transitions triggered by inputs (e.g., pressing "down" while standing transitions to ducking).  

4. **Ignored Inputs**
    
    If an input isn't valid for a state, it's ignored (e.g., pressing "jump" while already mid-air won’t trigger another jump).  

## Analogy: Text Adventure Games (Zork-like)  

- **Rooms = States**  
- **Exits = Transitions**  
- **Navigation Commands = Inputs** 

Just like moving through a text adventure world, our heroine moves through different states using predefined paths.  

FSMs offer a structured way to **control game behavior** while avoiding **spaghetti code** and unintended interactions. Next, we'll look at how to implement this in code.

# Enums and Switches

The previous boolean-flag-based approach led to **invalid state combinations** (e.g., jumping and ducking at the same time). A better approach is to use an **enum**, ensuring that **only one state is active** at any time.  

## Using an Enum for States

Instead of multiple flags, we define a **single `state_` field** with valid states:  

```cpp
enum State {
  STATE_STANDING,
  STATE_JUMPING,
  STATE_DUCKING,
  STATE_DIVING
};
```

This ensures **valid states** and improves **code organization**.  

## Handling Input Using a Switch Statement

Instead of checking input first, we **switch on the state first**, grouping logic for each state:  

```cpp
void Heroine::handleInput(Input input) {
  switch (state_) {
    case STATE_STANDING:
      if (input == PRESS_B) {
        state_ = STATE_JUMPING;
        yVelocity_ = JUMP_VELOCITY;
        setGraphics(IMAGE_JUMP);
      } else if (input == PRESS_DOWN) {
        state_ = STATE_DUCKING;
        setGraphics(IMAGE_DUCK);
      }
      break;
      
    case STATE_JUMPING:
      if (input == PRESS_DOWN) {
        state_ = STATE_DIVING;
        setGraphics(IMAGE_DIVE);
      }
      break;

    case STATE_DUCKING:
      if (input == RELEASE_DOWN) {
        state_ = STATE_STANDING;
        setGraphics(IMAGE_STAND);
      }
      break;
  }
}
```
## Advantages of This Approach

✅ **Eliminates invalid states** → Only one state is active at a time.  
✅ **Improves readability** → All logic for a state is grouped together.  
✅ **Keeps state transitions explicit** → Prevents accidental bugs from overlapping state changes.  

## Limitations of the Switch Statement Approach  

1. **Scalability Issue** → Adding new features requires modifying multiple methods.  

2. **Scattered State-Specific Data** → Example: If we add a "charged attack" while ducking, we introduce a `chargeTime_` field that’s **only relevant in the ducking state**, but it still exists across all states.  

   ```cpp
   void Heroine::update() {
     if (state_ == STATE_DUCKING) {
       chargeTime_++;
       if (chargeTime_ > MAX_CHARGE) {
         superBomb();
       }
     }
   }
   ```

3. **Encapsulation Violation** → State logic is spread across different parts of the class, making it harder to maintain.  

## What's Next?

To properly **encapsulate state-specific behavior**, we need a **better abstraction**. The **State pattern** from the Gang of Four provides a cleaner way to manage state transitions.

# The State Pattern

The previous **switch-based FSM approach** had limitations:  

1. **Poor Scalability** – Adding new states requires modifying multiple functions.  

2. **Scattered State Logic** – State-specific logic (like `chargeTime_` for ducking) is stored in the main class, even when it only applies to one state.  

3. **Encapsulation Issues** – The heroine’s state management is **tightly coupled** with her behavior.  

The **State pattern** solves this by **encapsulating state-specific behavior into separate classes** and dynamically delegating behavior to them.  

## **Applying the State Pattern**  

### **1️⃣ Define a State Interface**  
Instead of using a switch, we define an **abstract base class** for all states:  

```cpp
class HeroineState {
public:
  virtual ~HeroineState() {}
  virtual void handleInput(Heroine& heroine, Input input) {}
  virtual void update(Heroine& heroine) {}
};
```
Now, each state **implements its own logic** without interfering with other states.  

### **2️⃣ Implement Concrete State Classes**  

Each **state gets its own class**, implementing the **state-specific behavior**:  

```cpp
class DuckingState : public HeroineState {
public:
  DuckingState() : chargeTime_(0) {}

  virtual void handleInput(Heroine& heroine, Input input) {
    if (input == RELEASE_DOWN) {
      // Change to standing state
      heroine.setGraphics(IMAGE_STAND);
      heroine.changeState(new StandingState());  
    }
  }

  virtual void update(Heroine& heroine) {
    chargeTime_++;
    if (chargeTime_ > MAX_CHARGE) {
      heroine.superBomb();
    }
  }

private:
  int chargeTime_;
};
```
- **Encapsulated State Data** → `chargeTime_` is now **inside** `DuckingState`, instead of cluttering the main `Heroine` class.  

- **Encapsulated Transitions** → `handleInput()` defines **when the state changes**, reducing scattered transition logic.  

### **3️⃣ Delegate to the Current State**  

Instead of a switch statement, `Heroine` **delegates behavior to the current state object**:  

```cpp
class Heroine {
public:
  void handleInput(Input input) {
    state_->handleInput(*this, input);
  }

  void update() {
    state_->update(*this);
  }

  void changeState(HeroineState* newState) {
    delete state_;
    state_ = newState;
  }

private:
  HeroineState* state_;
};
```

- The **state class handles state transitions**, keeping the main class clean.  

- The `changeState()` method swaps out the **current state dynamically**.  

## **Comparison to Similar Patterns**  

✅ **State Pattern** → Lets an object **change behavior dynamically** by switching state objects.  

✅ **Strategy Pattern** → Used for **decoupling behavior**, but doesn't change dynamically.  

✅ **Type Object Pattern** → Used when **multiple objects share the same behavior** via a common type object.  

## **Key Benefits of the State Pattern**  

✔ **Encapsulation** – Each state class **owns its own logic**, keeping the main class simple.  

✔ **Scalability** – New states can be added **without modifying** the `Heroine` class.  

✔ **Flexibility** – State transitions happen **inside** the state objects, avoiding long switch statements.  

This is **a major improvement** over the **switch-based FSM** and sets up a **clean, maintainable system** for handling character states in a game.

## **Where Do the State Objects Come From?**  

Now that we’ve replaced the `switch` statement with **state objects**, we need a way to **manage state instances**. Since enums are just values, they don’t require memory management. But our states are now **objects**, so we need a strategy for creating and storing them.  

### Option 1: Static States (Flyweight Pattern)

If a state **does not store any instance-specific data**, we can use a **single shared instance** for all FSMs.

- No need to **allocate** or **free** state objects.  

- Saves **memory** and **reduces object creation overhead**.  

- Works well for states that don’t need **unique instance data**.  

#### **Implementation**  

We define **static instances** inside the base class:

```cpp
class HeroineState {
public:
  static StandingState standing;
  static DuckingState ducking;
  static JumpingState jumping;
  static DivingState diving;
  
  virtual ~HeroineState() {}
  virtual HeroineState* handleInput(Heroine& heroine, Input input) { return nullptr; }
  virtual void update(Heroine& heroine) {}
};
```
Each state instance is shared across all FSMs:
```cpp
if (input == PRESS_B) {
  heroine.state_ = &HeroineState::jumping;  // Use shared instance
  heroine.setGraphics(IMAGE_JUMP);
}
```

#### **Pros:**

✅ No dynamic allocation

✅ Saves memory

✅ No risk of memory leaks

#### **Cons:**

❌ Can’t store instance-specific data (e.g., `chargeTime_`).  

### **Option 2: Instantiated States (Dynamic Allocation)**

Some states **store instance-specific data** and **can’t be shared**. For example, `DuckingState` has `chargeTime_`, which is different for each heroine.  

#### **Implementation**

Instead of using a static instance, we **create a new object** when entering the state:

```cpp
class StandingState : public HeroineState {
public:
  virtual HeroineState* handleInput(Heroine& heroine, Input input) {
    if (input == PRESS_DOWN) {
      return new DuckingState();  // Create new instance
    }
    return nullptr;  // Stay in the same state
  }
};
```
The `Heroine` class **manages the transition** and deletes the old state safely:

```cpp
void Heroine::handleInput(Input input) {
  HeroineState* newState = state_->handleInput(*this, input);
  if (newState != nullptr) {
    delete state_;   // Free old state
    state_ = newState;
  }
}
```

- **Pros:** ✅ Allows state-specific data, ✅ Supports multiple heroines with independent states.  

- **Cons:** ❌ Higher memory usage, ❌ Risk of fragmentation if frequently allocated/deallocated.  

### **Which One to Use?**

| **Method**          | **Best For**                          | **Pros**                                        | **Cons** |
|--------------------|----------------------------------|----------------------------------|------------|
| **Static States**  | States **without instance data** | ✅ Saves memory, ✅ No allocation overhead  | ❌ Can’t store state-specific data |
| **Instantiated States** | States with **unique data per instance** | ✅ Supports multiple heroines, ✅ Allows data storage | ❌ Uses more memory, ❌ Requires careful cleanup |

For **simple states** (e.g., standing, jumping), use **static instances**.  

For **complex states** (e.g., ducking with `chargeTime_`), use **instantiated states**.  

If **fragmentation** becomes an issue, consider using an **Object Pool** to reuse state objects instead of constantly allocating and deleting them.

## **Enhancing the State Pattern with Enter and Exit Actions**  

The **State pattern** is all about encapsulating state-specific **behavior** and **data** in a single class. However, one problem remains:  

👉 *State transitions often require additional actions, like updating the heroine’s sprite when switching states.*  

Right now, **the previous state** is responsible for handling the transition’s side effects, like setting the heroine’s graphics. Instead, we want each state to **fully control its own behavior**, including **what happens when it starts** (entry action) and **what happens when it ends** (exit action).  

### **Implementing Enter Actions**  

Each state **sets up** the heroine’s graphics when she enters.  
We add an **`enter()`** method in the base class:

```cpp
class HeroineState {
public:
  virtual ~HeroineState() {}
  virtual void enter(Heroine& heroine) {}  // Runs on state entry
  virtual void exit(Heroine& heroine) {}   // Runs on state exit
  virtual HeroineState* handleInput(Heroine& heroine, Input input) { return nullptr; }
  virtual void update(Heroine& heroine) {}
};
```

Each state **implements its own `enter()` method**:

```cpp
class StandingState : public HeroineState {
public:
  virtual void enter(Heroine& heroine) override {
    heroine.setGraphics(IMAGE_STAND);
  }
};
class JumpingState : public HeroineState {
public:
  virtual void enter(Heroine& heroine) override {
    heroine.setGraphics(IMAGE_JUMP);
  }
};
```

### **Modifying State Transitions**

Instead of letting the **old state** set the new graphics, we now:  
1. Call `exit()` on the **current state** before switching.  

2. Delete the old state.  

3. Assign the **new state**.  

4. Call `enter()` on the **new state**.  

Updated `Heroine::handleInput()`:

```cpp
void Heroine::handleInput(Input input) {
  HeroineState* newState = state_->handleInput(*this, input);
  if (newState != nullptr) {
    state_->exit(*this);  // Call exit action on the old state
    delete state_;
    state_ = newState;
    state_->enter(*this);  // Call enter action on the new state
  }
}
```

#### **Example Transition (Ducking → Standing)**

Previously, `DuckingState` set the standing sprite:
```cpp
HeroineState* DuckingState::handleInput(Heroine& heroine, Input input) {
  if (input == RELEASE_DOWN) {
    heroine.setGraphics(IMAGE_STAND);  // ❌ Old approach
    return new StandingState();
  }
  return nullptr;
}
```
Now, `StandingState::enter()` **takes care of it**:
```cpp
HeroineState* DuckingState::handleInput(Heroine& heroine, Input input) {
  if (input == RELEASE_DOWN) {
    return new StandingState();  // ✅ No need to set graphics here
  }
  return nullptr;
}
```
---

### **Implementing Exit Actions (Optional)**

Some states may need cleanup before transitioning.  
Example: **DuckingState tracks `chargeTime_`** but should reset it when exiting.

```cpp
class DuckingState : public HeroineState {
public:
  virtual void enter(Heroine& heroine) override {
    chargeTime_ = 0;  // Reset charge timer on entry
    heroine.setGraphics(IMAGE_DUCK);
  }

  virtual void exit(Heroine& heroine) override {
    heroine.resetChargeBar();  // Example cleanup action
  }

  virtual void update(Heroine& heroine) override {
    chargeTime_++;
    if (chargeTime_ > MAX_CHARGE) {
      heroine.superBomb();
    }
  }

private:
  int chargeTime_;
};
```

Now, when the heroine **leaves the ducking state**, `exit()` makes sure any **temporary data is cleared**.  

## **Why Is This Useful?**

### ✅ **Encapsulation**  

Each state **fully owns** its own behavior.  

### ✅ **Avoids Code Duplication**  

- The same **entry action** runs no matter **which state the heroine is coming from**.  

- If multiple states transition to `StandingState`, they all **automatically get the right graphics**.  

### ✅ **Better Maintainability**  

- If we need to **add more setup/cleanup behavior**, we just modify `enter()` or `exit()`, instead of searching for all state transitions in `handleInput()`.  

## **Final Thoughts**

By adding **enter and exit actions**, we make our **state transitions cleaner and more encapsulated**. This makes our **FSM more robust, reusable, and scalable**. 🚀

### **The Catch: Limitations of FSMs**

While **Finite State Machines (FSMs)** are effective at managing simple, well-defined behaviors (like controlling the heroine’s states), **they are not a one-size-fits-all solution**. As we’ve seen, FSMs help by providing a **constrained, predictable structure**, but their greatest strength comes with a major trade-off: **they lack flexibility**.

### **Why FSMs Aren't Turing Complete**

FSMs are simple models of computation, and **Turing completeness** means a system can simulate a **Turing machine**, which is a much more powerful and expressive model of computation. Turing machines can handle **arbitrary complexity**, and can be programmed to solve any problem that can be described algorithmically (assuming sufficient resources).

In contrast, **FSMs** can only model systems with a **fixed set of states and transitions**, making them inherently limited. You cannot, for example, model complex behaviors that require dynamic, context-dependent decisions or unbounded memory.

FSMs are great for certain problems where the rules are **finite** and **clearly defined**. But when the behavior becomes **more intricate**, FSMs can become **over-complicated, rigid, and hard to maintain**.

### **What Happens When FSMs Hit Their Limits?**

While FSMs excel in **simple scenarios**, they struggle when applied to complex systems such as **game AI** or any problem where the logic is **context-dependent**, **non-linear**, or **involves unpredictable states**. Here’s what you run into:

1. **State Explosion**  
   When trying to handle a large number of behaviors or states, the number of state transitions grows exponentially. The state transition diagram becomes **overwhelmingly large** and hard to manage.

   Imagine having a game character that needs to handle multiple interactions: moving, fighting, reacting to environment changes, etc. Each of those requires distinct states and possibly many transitions. If you have even just **two or three states** for each behavior, you'll quickly end up with a **combinatorial explosion of states and transitions**.

2. **Hardcoded Transitions**  
   With FSMs, you define transitions between states manually, which leads to **hardcoded logic**. If you want to add new behaviors or interactions (such as new attack moves or environmental responses), it becomes challenging. You’d need to update **multiple transitions** in various states, making the system difficult to scale and maintain.

3. **Limited Memory**  
   FSMs don’t have a concept of **long-term memory**. Each state transition is based only on the current state and input, which doesn’t provide enough context for more **complex decision-making**. For instance, in game AI, a character might need to make decisions based on **long-term strategies**, **previous actions**, or **historical context**, which FSMs struggle to handle.


# **How to Dodge FSM's Limitations**

Though FSMs have limitations, there are ways to work around them or combine FSMs with other techniques to make them more flexible.

## **1. Hierarchical State Machines (HSMs)**

A **hierarchical state machine** is a way to organize complex FSMs. Instead of defining all states at the same level, you can **group related states together** and build state transitions within those groups. This allows you to manage complexity by **reducing the number of transitions** visible at any given moment.

- **Example**: In a game, a character might have a `Combat` state with sub-states like `Attacking`, `Defending`, and `Idle`. Inside each of these, you could have more granular states, keeping the overall system organized.

## **2. State Machines with Actions or Behaviors**  

Sometimes FSMs are used in combination with **action-oriented or behavior-based systems**. Instead of modeling every decision and interaction with states, you can define high-level **behaviors** (like `Patrol`, `Attack`, or `Evade`) and let those behaviors be controlled by higher-level logic.

- **Example**: A character in a game might have **multiple AI behaviors**, and the state machine only handles the transition between these behaviors (like switching from `Patrol` to `Chase`), while the behaviors themselves are handled by separate systems.

## **3. Combining FSM with Event-Driven or Rule-Based Systems**  

FSMs can be enhanced with **event-driven programming** or **rule-based systems** that allow more complex behaviors. Instead of hardcoding all transitions, these systems can define rules that are more flexible and can react to various inputs or states.

- **Example**: A character’s actions could be driven by a set of **rules** (such as a decision tree or a set of conditions), and the FSM is only responsible for the transitions between the broader states.

## **4. Behavior Trees**  

Behavior Trees are often used in game AI to model **more complex decision-making**. A behavior tree can represent a hierarchy of tasks, with **branches** representing different decision points, making it easier to model complex actions without resorting to unwieldy FSMs.

## **Conclusion: When to Use FSMs**

FSMs are powerful for certain types of problems, but they start to show their limits when the system becomes more **dynamic, complex**, or requires **unbounded memory**.

- **Use FSMs** for simple, well-defined behaviors with a **fixed set of states** and transitions.
- When you need **greater flexibility**, consider using **hierarchical state machines**, **behavior trees**, or **event-driven systems** to augment or replace FSMs.

FSMs will always be a **tool in your toolkit**, but they’re not the **only tool** for managing complexity in software design.

# **Concurrent State Machines: Managing Multiple State Machines**

In complex systems like a game where a character has multiple actions and can be in different states simultaneously (for example, moving, jumping, ducking, or carrying a weapon), managing all the states with a single **Finite State Machine (FSM)** can quickly become unwieldy. Adding a new feature—such as a weapon—requires an **exponential increase** in the number of states, leading to combinatorial explosion.

Let's look at a concrete example and then explore how **Concurrent State Machines** (CSMs) can solve this issue.


## **The Problem: State Explosion**

Imagine a heroine in a game who can:

- Run
- Jump
- Duck
- Dive

Each of these actions can have states like **standing**, **in the air**, or **on the ground**, and when you introduce a weapon, you also need to model whether the heroine is:

- **Armed** (with a weapon)
- **Unarmed**

Without using concurrent state machines, you would need to double the number of states for each action. For example, here’s a breakdown:

1. **Unarmed States**:
   - Standing
   - Jumping
   - Ducking
   - Diving

2. **Armed States** (with a gun):
   - Standing with gun
   - Jumping with gun
   - Ducking with gun
   - Diving with gun

To manage these states, you now need **8 states** (instead of 4) to handle the same set of actions, and as you add more weapons or features, the state count grows rapidly. This also leads to redundancy—most of the states are identical except for the handling of firing the weapon.

## **The Solution: Concurrent State Machines**

The key idea here is to **separate** the state machines for the two distinct sets of states: the heroine's **actions** and her **equipment** (whether she is armed or unarmed). This allows us to keep the logic separate, reducing redundancy and making the system more maintainable.

### **Separate State Machines for Actions and Equipment**

1. **Action State Machine (What she's doing)**:
   - States like **Standing**, **Jumping**, **Ducking**, etc.

2. **Equipment State Machine (What she's carrying)**:
   - States like **Unarmed** and **Armed**.

With **two state machines**, we no longer need to combine the states into one big, bloated machine. Instead, we keep the states **independent**.


### **Heroine Class with Two State Machines**

To implement this, we modify the `Heroine` class to contain references to **two state machines**: one for the heroine's actions (e.g., standing, jumping) and one for her equipment (e.g., armed, unarmed).

```cpp
class Heroine {
public:
    // Other code...
    
    void handleInput(Input input) {
        // Handle the input for both action and equipment state machines
        state_->handleInput(*this, input);  // Delegate to the action state machine
        equipment_->handleInput(*this, input);  // Delegate to the equipment state machine
    }

    // Other methods...

private:
    HeroineState* state_;      // Action state machine
    HeroineState* equipment_;  // Equipment state machine (e.g., armed, unarmed)
};
```

Here, we have two state machines:
- **`state_`**: This is the original state machine for handling actions like running, jumping, etc.
- **`equipment_`**: This state machine handles whether the heroine is armed or unarmed, and might include other features like carrying different types of weapons.

### **How It Works: Input Delegation**

Each time an input is processed, we delegate the handling of that input to **both state machines**. Each state machine handles its own transition logic independently, so the heroine’s actions and her equipment state can change independently of each other.

```cpp
void Heroine::handleInput(Input input) {
    // Delegate input to both state machines
    state_->handleInput(*this, input);
    equipment_->handleInput(*this, input);
}
```

However, there might be some cases where both state machines interact. For instance, if the heroine is **jumping**, she might not be able to fire her weapon, so the equipment state machine (firing logic) needs to check if the action state machine (jumping) is in the jumping state.

In those cases, the state machines might need to communicate or coordinate by **checking the state** of the other machine before responding.


### **Handling Interaction Between State Machines**

In some cases, the two state machines might need to **interact**. For instance, the heroine cannot fire her weapon if she is jumping or diving. You can manage these interactions by **querying the other state machine** for its current state within the state transitions:

```cpp
HeroineState* EquipmentState::handleInput(Heroine& heroine, Input input) {
    if (input == PRESS_FIRE) {
        // If the heroine is jumping or diving, she can't fire
        if (heroine.state_->isJumping() || heroine.state_->isDiving()) {
            return nullptr;  // No transition, can't fire while jumping or diving
        }
        // Otherwise, fire the weapon
        heroine.fireWeapon();
    }
    return nullptr;  // Stay in the current equipment state
}
```

### **Benefits of Concurrent State Machines**

1. **Reduced State Explosion**:
   By separating the logic for **what she’s doing** and **what she’s carrying**, the number of states is reduced. Instead of a combinatorial explosion of states, you have two independent state machines that operate in parallel.

2. **Maintainability**:
   Each state machine is now simpler and more maintainable, with distinct responsibilities. The code for managing actions and the code for managing equipment don’t overlap and can evolve independently.

3. **Scalability**:
   As new features are added (e.g., new equipment or actions), the system scales more easily. You only need to add new states to the respective state machine without worrying about the other machine.


### **Conclusion: Concurrent State Machines in Practice**

Concurrent State Machines offer a **cleaner, more scalable solution** for situations where multiple independent behaviors or state systems exist. Rather than combining everything into a single FSM, you separate concerns into **multiple state machines** that can run concurrently.

This approach is especially useful when you have multiple **independent state variables**, like the heroine’s actions and her equipment, allowing each state machine to handle its own transitions while maintaining independence and reducing redundancy.

# **Hierarchical State Machines: Improving Code Reusability and Flexibility**

When you are designing more complex state machines (FSMs) for a system, such as a game character with multiple actions and behaviors, you might find yourself duplicating a lot of similar logic across various states. For example, a heroine might have **standing**, **walking**, **running**, and **sliding** states, and in each of these states, the same inputs (e.g., pressing a button to jump or duck) might trigger similar behaviors. Without any structure for reuse, this can result in repetitive code and maintenance challenges.

## **The Challenge of Code Duplication**

In a simple state machine setup, we might end up writing similar input-handling code in **each state** (e.g., handling jumping or ducking across standing, walking, running, and sliding states). If we don't have a way to share this code, we end up repeating it, which leads to **code duplication** and a **higher risk of bugs** when changes are needed.

## **The Solution: Hierarchical State Machines (HSMs)**

A **Hierarchical State Machine (HSM)** helps solve this problem by allowing states to have **superstates** (parent states) and **substates** (child states). This forms a hierarchy, where common behaviors can be **factored out** into the parent state (superstate), and the more specific behaviors are handled in the child state (substate).

With a **hierarchical structure**, when an event or input is triggered, the machine first checks the current **substate** for handling. If the substate doesn’t handle the input, it “rolls up” to the **superstate**, checking if the superstate can handle it, and so on. This is very similar to **method inheritance** in object-oriented programming, where child classes inherit behavior from parent classes and can override it as needed.


## **How HSMs Work: Example of Hierarchical States**

Let’s explore how this works in the context of a heroine with different ground-based states. The heroine can be in one of the following states on the ground:
- **Standing**
- **Walking**
- **Running**
- **Sliding**

For all of these states, pressing the **B button** should cause the heroine to **jump**, and pressing **Down** should cause her to **duck**.

Without a hierarchy, you would have to duplicate the jumping and ducking logic in each of the states. But with a hierarchical approach, you can create a **base class** (superstate) that handles the shared behaviors, and then subclass it for specific behaviors (substates).

### **Base Class for Shared Ground Behaviors (Superstate)**

Let’s create a superstate called `OnGroundState` that handles the jumping and ducking behavior that is common across all ground states.

```cpp
class OnGroundState : public HeroineState
{
public:
  virtual void handleInput(Heroine& heroine, Input input)
  {
    if (input == PRESS_B)
    {
      // Jump behavior (same for standing, walking, running, etc.)
      heroine.jump();
    }
    else if (input == PRESS_DOWN)
    {
      // Duck behavior (same for standing, walking, running, etc.)
      heroine.duck();
    }
  }
};
```

Here, the `OnGroundState` class defines the logic for common actions (jumping and ducking). Any state where the heroine is on the ground (like standing, walking, etc.) can inherit from this class and reuse the code for these actions.


### **Substates (Specific States)**

Now, for each specific behavior (e.g., **Standing**, **Walking**, **Running**, **Sliding**), we can create **substates** that inherit from `OnGroundState`. These substates can override the `handleInput` method to add their own specific behavior while reusing the shared behavior from the superstate.

#### **Ducking State as a Substate**

```cpp
class DuckingState : public OnGroundState
{
public:
  virtual void handleInput(Heroine& heroine, Input input)
  {
    if (input == RELEASE_DOWN)
    {
      // Transition to standing state when releasing the down key
      heroine.setState(new StandingState());
    }
    else
    {
      // If not handled, delegate to the superstate (OnGroundState)
      OnGroundState::handleInput(heroine, input);
    }
  }
};
```

Here, the `DuckingState` inherits from `OnGroundState`, and when the heroine is ducking, it can still handle jumping or ducking via the base class. But if there’s a specific condition, like releasing the down button, it handles that separately (transitioning to the `StandingState`).

#### **Standing State**

```cpp
class StandingState : public OnGroundState
{
public:
  virtual void handleInput(Heroine& heroine, Input input)
  {
    if (input == PRESS_B)
    {
      // Jump when in standing state
      heroine.jump();
    }
    else if (input == PRESS_DOWN)
    {
      // Start ducking when pressing down
      heroine.setState(new DuckingState());
    }
    else
    {
      // If not handled, delegate to the superstate (OnGroundState)
      OnGroundState::handleInput(heroine, input);
    }
  }
};
```

In the `StandingState`, we override the `handleInput` to add more specific logic, like starting the ducking action when pressing down. But if we don’t handle it, we delegate back to `OnGroundState`.


## **Benefits of Hierarchical State Machines**

1. **Code Reuse**:
   The common behaviors (like jumping and ducking) are only defined once in the `OnGroundState`, and all subclasses inherit this behavior. This reduces code duplication and the risk of inconsistencies.

2. **Flexibility**:
   Specific states can still add their unique behaviors while leveraging the shared functionality from the superstate. For example, the `DuckingState` or `StandingState` can override the `handleInput` method to handle more specific transitions or conditions.

3. **Clear Structure**:
   Hierarchical state machines offer a **clearer, more maintainable structure** for managing complex systems. You can extend the behavior of states without having to deal with a massive state machine with duplicated logic.

4. **Scalability**:
   As you add more complex behaviors (e.g., new states for actions like “jumping with a weapon” or “running with a shield”), the hierarchical structure will help you organize and manage the complexity in a modular way.


## **Implementing the HSM with a Stack (Alternative Approach)**

If you're not using the Gang of Four’s State pattern and want to model the hierarchy explicitly, you can use a **stack** of states to represent the current state and its superstates. The stack keeps track of the current state and allows for "rolling up" the hierarchy when needed.

- The **current state** is on the top of the stack.
- The **superstates** are underneath the current state.

This structure allows for an explicit representation of the state hierarchy and can be traversed when handling inputs, similar to walking up the class inheritance chain.


## **Conclusion: Hierarchical State Machines in Action**

Hierarchical State Machines provide a powerful way to manage complex state transitions and shared behaviors. By using **inheritance** or an **explicit stack structure**, you can easily share common functionality between states (e.g., jumping, ducking) while allowing for specialized behavior in specific substates. This reduces redundancy, increases maintainability, and scales better as your system grows in complexity.

# **Pushdown Automata: Adding Memory to Finite State Machines**

In a **finite state machine (FSM)**, the machine has no concept of **history** — once you transition from one state to another, you lose any memory of where you were. This lack of memory can be a problem in more complex systems. A **Pushdown Automaton (PDA)** extends an FSM by using a **stack** to store states, allowing the system to have a **history** of states and providing more flexibility, especially in scenarios where you need to return to a previous state after completing a transition.

## **The Problem with FSMs and History**

In a typical FSM, once you transition from one state to another, the previous state is lost. For example, if our heroine fires a gun while she's in different states like standing, running, or jumping, we need the system to remember the exact state she was in before firing so that it can return to the same state once the firing sequence is complete.

Without memory of the previous state, we would be forced to create separate states for every combination — firing while standing, firing while running, firing while jumping, and so on. This is inefficient and cumbersome, especially as the number of states grows.

## **Introducing Pushdown Automata (PDA)**

A **Pushdown Automaton (PDA)** extends the FSM by using a **stack** of states. Unlike the FSM, which only has a single pointer to the current state, a PDA allows you to **push** and **pop** states onto and from the stack.

- **Push**: When you transition into a new state, you push the current state onto the stack and set the new state as the current one.

- **Pop**: When you finish the new state (e.g., after firing the gun), you pop the state from the stack, and the previous state becomes the current one again.

This allows the PDA to **remember** the previous state and **return to it** after completing an intermediate state, like firing the gun, without the need for a large number of hardcoded combinations.

### **Example: Heroine Firing a Gun with a Pushdown Automaton**

Let’s break this down with the example of the heroine firing her gun. We want to handle the scenario where the heroine can be in different states, such as **standing**, **running**, **jumping**, or **ducking**, and can fire her weapon from any of these states.

#### **Without a Pushdown Automaton (FSM)**

Without a PDA, we would need to create separate states for each combination of firing actions. This means that we would have the following states:
- **Firing while standing**
- **Firing while running**
- **Firing while jumping**
- **Firing while ducking**

Each of these states would be responsible for managing the transition back to its respective base state after firing. This approach leads to a **lot of redundancy** and makes the code harder to maintain.

#### **With a Pushdown Automaton (PDA)**

Instead of creating all those redundant states, we can use a **single firing state**. When the heroine presses the fire button, we push the **FiringState** onto the stack, and when the firing sequence completes, we pop the **FiringState** off the stack and automatically return to the state she was in before firing.

Here’s how this can be structured:

1. **Heroine’s State Stack**: The heroine has a stack of states. Initially, she is in a `StandingState` (or any other state).
2. **Pushing the FiringState**: When she presses the fire button, we push the `FiringState` onto the stack.
3. **Popping the FiringState**: After the firing animation or sequence is done, we pop the `FiringState` off the stack, and the PDA automatically returns to the previous state (e.g., `StandingState`, `RunningState`, etc.).


## **How It Works: Example Code**

Let’s see a basic code structure for this using a Pushdown Automaton approach.

### **Heroine Class with a State Stack**

```cpp
class Heroine {
private:
    std::stack<HeroineState*> stateStack;  // Stack to store states

public:
    // Method to handle input, transitions, and push/popping states
    void handleInput(Input input) {
        // If the fire button is pressed, push the firing state onto the stack
        if (input == PRESS_FIRE) {
            stateStack.push(new FiringState());
        }
        
        // Handle the input for the current state (top of the stack)
        stateStack.top()->handleInput(*this, input);
    }

    // Transition to the next state (e.g., after firing is done)
    void transitionToState(HeroineState* newState) {
        // Pop the firing state off the stack when firing is complete
        if (!stateStack.empty()) {
            delete stateStack.top();
            stateStack.pop();
        }

        // Push the new state onto the stack
        stateStack.push(newState);
    }

    // Get the current state (top of the stack)
    HeroineState* getCurrentState() {
        return stateStack.top();
    }
};
```

### **States**

1. **FiringState** (Represents the firing behavior)

```cpp
class FiringState : public HeroineState {
public:
    void handleInput(Heroine& heroine, Input input) override {
        // Handle firing animation and logic
        if (input == FIRE_DONE) {
            // Firing complete, pop this state and transition back to previous state
            heroine.transitionToState(new StandingState());  // Example: return to standing
        }
    }
};
```

2. **StandingState** (Represents the heroine standing still)

```cpp
class StandingState : public HeroineState {
public:
    void handleInput(Heroine& heroine, Input input) override {
        if (input == PRESS_B) {
            // Jump behavior when standing
            heroine.transitionToState(new JumpingState());
        }
        // Handle other standing behaviors
    }
};
```


## **Benefits of Using a Pushdown Automaton**

1. **Memory of Previous States**:
   The PDA allows the heroine to "remember" where she was before firing, so we don’t need to duplicate states like **firing while standing**, **firing while jumping**, etc. The PDA automatically returns to the state she was in.

2. **Simpler State Transitions**:
   With the stack-based memory, we can use a **single firing state** across all the states, reducing redundancy. The system handles returning to the previous state automatically after the firing sequence.

3. **More Flexibility**:
   If we need to add more intermediate states or complex behavior (e.g., other actions or animations), we can easily push additional states onto the stack without having to redesign the entire state machine.


## **Conclusion**

The **Pushdown Automaton (PDA)** extends the **Finite State Machine (FSM)** by introducing a stack to store states. This allows for **history tracking** and the ability to **return to previous states**, making it especially useful when dealing with temporary actions or transitions like firing a weapon, where you want to return to the previous state after the action is completed.

In the heroine example, instead of creating a vast number of firing states for each possible action, we use a **single firing state** and let the PDA **push** and **pop** states from the stack as needed. This approach greatly simplifies the state management and reduces redundancy, making the system more maintainable and scalable.

# **How Useful Are Finite State Machines (FSMs)?**

While **Finite State Machines (FSMs)**, **Pushdown Automata (PDAs)**, and other simple systems are fundamental concepts in automata theory, their utility can be limited in certain applications, especially when it comes to more complex systems like **game AI**. The field of AI, especially in modern games, has evolved to include more advanced approaches such as **behavior trees** and **planning systems** that handle complexity in ways FSMs cannot. However, this doesn't mean FSMs are obsolete. They remain a **valuable tool** for certain problems, especially when the structure of the problem fits within the limitations of FSMs.

## **When Are Finite State Machines Useful?**

FSMs are particularly useful in situations where the system's behavior can be modeled in a relatively **simple and structured way**, and where complexity does not spiral out of control. Specifically, FSMs are beneficial when:

1. **Entity Behavior Depends on Internal State**:
   If you have an entity (like a character in a game, or a device in a control system) whose behavior changes based on its internal state, an FSM is a natural fit. The FSM keeps track of the current state and transitions between them based on inputs or events.

2. **State Space is Limited**:
   FSMs work best when the number of possible states is relatively small and well-defined. They are best suited for scenarios where there are **distinct, manageable states** to transition between, and where you can predict the different states an entity can be in. If the number of states grows exponentially, FSMs become less practical.

3. **System Responds to Events Over Time**:
   FSMs are also effective for systems where the entity responds to a series of **discrete inputs or events** over time. Each event triggers a transition from one state to another, and FSMs naturally provide a way to model this.

## **Applications of FSMs in Games**

While FSMs may not be the most cutting-edge solution for complex AI, they are still **widely used** in many aspects of game development, particularly in scenarios where **predictable, well-defined state changes** occur:

1. **AI Behavior**:
   - **Non-Player Characters (NPCs)**: FSMs are still commonly used for NPCs, especially in situations where NPCs have a finite set of behaviors. For example, an NPC might have states like **patrolling**, **chasing**, **attacking**, and **idle**, and transitions between these states would occur based on inputs like the player's proximity, NPC health, etc.
   - **Simple Enemy Patterns**: In many older games, FSMs were used for basic enemy behavior patterns, where enemies would switch between states like **searching**, **pursuing**, and **attacking**.

2. **User Input Handling**:
   - **Menu Navigation**: In menus or user interfaces, FSMs are an excellent way to handle the transitions between different screens or interactions. A **menu system** might have states like **main menu**, **options menu**, **gameplay**, and **pause**, with transitions based on user actions like button presses.
   - **Character Actions**: For character controllers (e.g., in platformers), FSMs are often used to handle **animations** and **actions** like **walking**, **jumping**, **attacking**, etc. The character’s state would change in response to player input, with each state having its own set of behaviors.

3. **Parsing and Language Recognition**:
   - FSMs are often used in **parsing** contexts, such as in **compilers** or **interpreters** for programming languages. Lexical analyzers and parsers often use FSMs to recognize tokens or syntactic structures in source code.
   - Similarly, FSMs are used in **regular expression** matching, where they efficiently recognize patterns in text.

4. **Network Protocols**:
   - FSMs are great for modeling **communication protocols** where the system must respond to different messages or events in a certain sequence. For example, a **protocol** might have states like **waiting for handshake**, **handshake complete**, **data transfer**, and **error handling**, with transitions depending on the messages received.

5. **Asynchronous Behavior**:
   - FSMs can help manage **asynchronous behavior**, such as a task queue where each task has a state (e.g., **pending**, **processing**, **completed**, **failed**). FSMs ensure the tasks transition through states correctly.


## **Limitations of FSMs**

Despite their usefulness, FSMs come with limitations that can make them unsuitable for more **complex problems**:

1. **Limited Scalability**:
   As the number of states increases, FSMs become more difficult to manage and more error-prone. The **state explosion problem** can occur when you have a large number of possible states or when you try to represent **complex behaviors** with just a few states.

2. **Lack of Memory**:
   An FSM does not have memory beyond its current state. In certain applications (e.g., more complex AI), it can be difficult to track the history of actions or decisions made in the past without using additional constructs like a **Pushdown Automaton (PDA)**.

3. **Rigid Structure**:
   FSMs enforce a very rigid structure. While they are great for scenarios with predictable transitions, they can struggle in environments that require **flexibility** or **adaptive decision-making**, which is why systems like **behavior trees** or **planning systems** are often preferred in more advanced AI.


### **When Not to Use FSMs**

While FSMs are effective in many situations, they aren’t always the right tool for the job. Consider alternative systems if:

- **State Transitions are Complex**: If your system involves complex transitions between states that can't be easily described in terms of simple rules, FSMs can become too cumbersome. In such cases, more sophisticated systems like **behavior trees** might offer better flexibility.
  
- **History is Important**: If the system needs to remember past events and decisions over time, and these past events heavily influence future behavior, systems with more memory (like **PDA** or **behavior trees**) might be more appropriate.

- **State Explosion**: If your system requires an extremely large number of states or dynamic state generation (e.g., procedural content generation), FSMs can become unwieldy.


# **Conclusion: Where FSMs Shine**

Even though FSMs may seem limited compared to more advanced systems like behavior trees, they remain a **powerful tool** for specific types of problems. FSMs excel in situations where:

- Behavior changes based on a small number of distinct, well-defined states.
- Systems react to a sequence of inputs or events over time.
- The problem at hand does not require complex memory or decision-making beyond simple state transitions.

In these cases, FSMs provide a clean, efficient way to model and manage behavior. However, for more complex AI or dynamic systems, exploring other models such as behavior trees or planning systems is likely to provide better scalability and flexibility.