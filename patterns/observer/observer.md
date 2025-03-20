# Observer (from "Game Programming Patterns" book)

## Intro

**1. Observer is foundational:**  
- It underpins MVC (Model-View-Controller), which is everywhere — from GUI apps to game architecture.  
- So common that it’s part of core libraries (Java) and language features (C# events).  

**2. History:**  
- Originated in Smalltalk in the 1970s (with some playful credit-stealing by Lispers in the 60s).  
- One of the original "Gang of Four" design patterns.  

**3. Why it's important in game dev:**  
- While common in general software, some game dev circles don’t emphasize it — but they should.  
- It helps you decouple systems so changes in one place automatically notify and update others without tight coupling.  

**4. Motivating idea:**  
- Observer lets you build a system where one part knows something has changed and other parts are automatically kept in sync.  

## Achievement Unlocked

**1. The Problem:**  
- Achievements can be triggered by wildly different systems (physics, combat, inventory, etc.).  
- Without Observer, achievement logic risks polluting code across the whole codebase (e.g., physics engine calling `unlockFallOffBridge()` — yikes!).  
- That tight coupling makes maintenance painful and messy.  

**2. The Goal:**  
- Keep each concern (like achievements) in its own clean, isolated space.  
- Avoid tangling achievement logic inside unrelated systems.  

**3. The Solution (Observer):**  
- Observer allows systems to simply *announce* that “something happened” (send a notification), without caring who listens or what happens next.  
- Example: Physics code just calls `notify(entity, EVENT_START_FALL);` — it doesn’t care if anyone’s listening or not.  
- The Achievement system registers as a listener and handles the logic for unlocking achievements when notified.  

**4. Benefits:**  
- Decoupled design: The physics engine is not tied to achievements.  
- Achievements can be added, changed, or removed without touching the physics code.  
- Systems stay clean and focused on their own domain.  
- The notifications are lightweight: If no one is listening, they can safely exist or be removed.  

## How it Works

### 1. **Observer Interface**
- Observers are classes that *want to know* when something interesting happens.
- They implement an interface with a method like:
```cpp
virtual void onNotify(const Entity& entity, Event event) = 0;
```
- The parameters (like entity and event) are flexible — they carry the "what happened" data.

### 2. **Concrete Observer Example (Achievements)**
- Observers (like `Achievements`) react to notifications inside `onNotify()`:
```cpp
void onNotify(const Entity& entity, Event event) {
    if (event == EVENT_ENTITY_FELL && entity.isHero() && heroIsOnBridge_) {
        unlock(ACHIEVEMENT_FELL_OFF_BRIDGE);
    }
}
```
- Observers keep their own state (like `heroIsOnBridge_`) and act on events.

---

### 3. **Subject**
- The subject is the object that *sends notifications* and holds a list of observers:
```cpp
Observer* observers_[MAX_OBSERVERS];
int numObservers_;
```
- Provides public methods:
```cpp
void addObserver(Observer* observer);
void removeObserver(Observer* observer);
```
- Important:  
  - The subject is **not coupled** to observers.  
  - It does not care who listens — only that it can notify.  

### 4. **Sending Notifications**
- The subject notifies all observers by looping through the list:
```cpp
void notify(const Entity& entity, Event event) {
    for (int i = 0; i < numObservers_; i++) {
        observers_[i]->onNotify(entity, event);
    }
}
```
- This system supports multiple observers independently.  
- No interference between observers (i.e., audio and achievements can both listen without overriding each other).

### 5. **Hooking into Systems (Observable Physics Example)**
- A system like `Physics` inherits from `Subject`:
```cpp
class Physics : public Subject {
    void updateEntity(Entity& entity);
};
```
- This allows the physics system to call `notify()` internally, while allowing others to register as observers.

### 6. **Alternative (Event System vs. Observer System)**
- Instead of inheriting Subject, composition can be used:
```cpp
physics.entityFell().addObserver(this);
```
- Observer system = observe the object doing the action.  
- Event system = observe the event stream or object representing the event.  
- The event system decouples the source and the concept of the event even further.

### 7. **Big Takeaway**  
> The Observer pattern is simple but powerful: one subject, multiple observers, no tight coupling. It’s the backbone of communication in many frameworks and games.

## It’s Too Slow

### 1. **Misconception: "Observer is Slow"**
- Many programmers *assume* Observer is slow because they associate it with heavy systems like:
  - Events
  - Messaging
  - Data binding  
- These systems *can* be slow (queues, allocations, deferred handling), but that’s not Observer.

### 2. **Reality Check: Observer is Lightweight**
- The real Observer pattern is:
  - Just a loop over observers and a call to a virtual method.
  - No message objects, no queuing, no allocation.
  - Negligible overhead — perfectly fine unless you're on a hot CPU path.

### 3. **Where Observer Works Best**
- It’s most suited for:
  - Non-performance-critical systems (like UI, achievement triggers, game state monitoring).
  - Places where you want decoupling and flexible communication.

## It’s Too Fast

### 1. synchronous calls
- Notifications are synchronous:  
  - The subject **waits** until all observers finish running their `onNotify()` calls.  
  - A slow observer can block the subject, causing delays or stuttering.

### 2. **Best Practices for Observers**
- Don’t do heavy work inside `onNotify()`.
- If slow work is needed, push it to a separate thread or queue.  
- UI developers’ golden rule: *"Stay off the UI thread"* — keep notifications quick.

### 6. **Threading Caution**
- Be careful mixing Observer with threading and locks:
  - If an observer grabs a lock the subject holds, you can deadlock.
  - In complex multithreaded systems, consider switching to an **Event Queue** for asynchronous handling.

✅ Bottom line:  
> The Observer pattern is light, fast, and simple — as long as you avoid blocking and handle slow work elsewhere. For multithreaded, asynchronous needs, move to an Event Queue.

## It Does Too Much Dynamic Allocation

### 1. **The Fear of Dynamic Allocation**  
- Even in garbage-collected or managed languages, dynamic allocation (and fragmentation) can hurt performance, especially in games that need to run for hours or days.
- Fragmented memory = certification nightmares.  

### 2. **The Reality Check**  
- The Observer pattern only allocates memory when wiring up observers — *not* when sending notifications.  
- If observers are mostly hooked up at initialization, dynamic allocation cost is negligible.

### 3. **If Allocation Is Still a Concern: Go Allocation-Free**  

#### **Linked Observer Lists**  
- Instead of having a dynamic array of observer pointers in `Subject`, you can:  
  - Give each `Observer` a `next_` pointer.  
  - The `Subject` keeps only a pointer to the head of the linked list of observers.  
- Registering an observer:  
```cpp
void Subject::addObserver(Observer* observer) {
  observer->next_ = head_;
  head_ = observer;
}
```
- Removing an observer involves unlinking it from the chain (requires list traversal).

- **Tradeoff:** The most recently added observer gets notified first (C, B, A order).  
  This shouldn’t matter if observers are truly independent.

### 4. **Limitation of Intrusive Lists**  
- An observer can only belong to **one** subject at a time.  
  If your system requires one observer to watch multiple subjects, this approach won’t work.

### 5. **Solution: Object Pool of List Nodes**  
- Instead of intrusive lists (where the observer *is* the node), use separate “list node” structs:
```cpp
struct ListNode {
  Observer* observer;
  ListNode* next;
};
```
- Multiple nodes can point to the same observer → observers can be part of multiple subjects.
- Avoid allocations by having a fixed-size pool of these `ListNode` objects ready to reuse.

- This pool-based design offers:  
  - No dynamic allocation during runtime.  
  - Observers that can subscribe to multiple subjects.

### 6. **Intrusive vs. Non-Intrusive Lists**  
- **Intrusive lists:**  
  - Node data *is inside* the object (Observer has `next_` pointer).  
  - Super efficient, but limited flexibility.
- **Non-intrusive lists:**  
  - Separate node objects.  
  - More flexible, but requires pool management for efficiency.

✅ **Bottom line:**  
> Dynamic allocation can be avoided by using either intrusive linked lists or a pool of reusable list nodes.  
> Which one to use depends on whether you need observers to watch multiple subjects and how flexible you want the design to be.  

## Remaining Problems  

### 1. **Destroying Subjects and Observers**  
- The sample code avoids this, but it’s a real problem:  
  - **If you delete an observer** without unregistering it, subjects end up with dangling pointers → crashes.  
  - **If you delete a subject**, observers may still think they’ll get notifications, leading to confused states.  

#### **Common solutions:**  
- Have observers unregister themselves from subjects in their destructor.  
- Have the subject send a “dying breath” notification on destruction so observers know to stop watching.  
- A safer (but more complex) solution:  
  - Make each observer track the subjects it observes and automatically unregister when destroyed.  
  - This requires bi-directional references, adding complexity.  

### 2. **Garbage Collection ≠ Automatic Safety**  
- GC languages are not immune.  
- Example: A UI element observes the player’s health.  
  - The UI gets closed but isn’t unregistered from the player’s observer list.  
  - It never gets garbage collected — it's still referenced!  
  - The result:  
    - **Zombie objects** wasting memory and CPU, responding to notifications they shouldn’t.  
    - This is known as the **lapsed listener problem**.  
- **Moral:** Always unregister observers, even in GC environments.

### 3. **Dynamic Coupling = Harder Debugging**  
- Observer pattern helps decouple systems.  
- Great for large, independent modules (like physics & achievements).  
- **Downside:**  
  - The communication flow is dynamic.  
  - To see “who’s calling who,” you need to inspect runtime state, not just code.  
  - Debugging or understanding cross-system bugs becomes harder because there’s no static reference you can jump to in your IDE.

### 4. **When *not* to use Observer**  
- If both sides of the communication are closely related, use explicit calls.  
- Observer is best for communication between *separate* modules that rarely need to be worked on together.  
- Inside a cohesive feature? Observer might just obscure things.  

### ✅ **Bottom line**  
> The Observer pattern solves coupling and communication problems elegantly, but it introduces lifecycle complexity and debugging difficulty.  
> Use it when separating large, independent systems — not for tight, internal module interactions.  
> Be disciplined with unregistration or risk memory leaks and zombie listeners.  

## Observers Today

### 1. **Observer Pattern Origins**  
- Designed in the 90s, during the height of OOP obsession.  
- Everything was **class-heavy**, with deep inheritance hierarchies.  
- Observer pattern fit that mold:  
  - You implemented an **Observer interface** with an `onNotify()` method.  
  - Subjects called that method to notify observers.  

### 2. **What’s changed?**  
- Coding culture has shifted toward **functional programming** and lighter designs.  
- Writing entire classes or interfaces just to handle a single notification feels:  
  - **Rigid**  
  - **Heavyweight**  
  - Awkward when you need different callbacks for different subjects.  

### 3. **Problems with the old style**  
- A single `onNotify()` method means:  
  - If you observe multiple subjects, you rely on the subject being passed as a parameter and switch based on it.  
  - This makes your observer logic messier and less elegant.  

### 4. **Modern approaches**  
- Instead of interfaces, most modern languages let you register **functions or methods** directly:  
  - **C#:** Has *events* and *delegates*, allowing methods to be registered as observers.  
  - **JavaScript:** Observers are often just **functions**, not objects.  
  - **Java (since JDK 8):** Now has lambdas and functional interfaces, making this lighter.  
  - **C++ (even without GC):** Has closures and can support registering member function pointers.  

### 5. **The functional style is lighter and more flexible:**  
- You don’t need to create full classes.  
- You can register different callbacks for different subjects without awkward branching.  
- In modern systems, you’re more likely to:  
  ```cpp
  subject.addObserver([this](const Entity& e, Event ev) {
      // Inline logic here
  });
  ```  
  rather than defining an entire observer class.

### ✅ **Bottom line**  
> The Observer pattern, originally built for class-heavy OOP, feels outdated in a world of closures and first-class functions.  
> Today, most systems prefer function-based observers: lighter, more flexible, and easier to manage.  
> If designing observer systems in 2025? Make them function-based — even in C++.  

## Observers Tomorrow

### 1. **The current state of observers**  
- Observer/event systems are *everywhere* in modern development.  
- But writing observers often gets repetitive:  
  - *"State changed → update the UI accordingly"*  
  - Example:  
    > "Hero health is 7? Set health bar width to 70px."  
- After doing this over and over, it becomes tedious and boilerplate-heavy.  

### 2. **Attempts to fix this**  
- Academics and engineers have tried to make things more declarative:  
  - **Dataflow programming**  
  - **Functional reactive programming (FRP)**  
- These aim to make state changes *automatically* propagate through a system without manually writing imperative code.  
- Some success in specific domains (audio, hardware design), but too complex or impractical for general use.  

### 3. **Data binding: the pragmatic compromise**  
- **Data binding** automates the boring part:  
  - You declare a link between some data and the UI or computed property.  
  - The framework takes care of updating things when the data changes.  
- It’s less radical than FRP, but super useful for UI-heavy applications.  
- Common in frameworks like:  
  - Angular, React (with state hooks), WPF, SwiftUI, Flutter.  
- Likely to make its way deeper into game UI systems — though maybe not into performance-critical parts of the engine.  

### 4. **Observers still have their place**  
- Data binding is great for declarative UI sync.  
- But for simpler, lower-level communication between unrelated systems?  
  - The good old **Observer pattern** still wins.  
  - It’s:  
    - **Simple**  
    - **Reliable**  
    - **Easy to reason about**  
- Often, boring but simple and proven solutions are the best choice.  

### ✅ **Bottom line**  
> Tomorrow’s code will use more data binding and declarative state handling to avoid tedious manual UI updates.  
> But underneath it all, for clean system-to-system communication and simple notifications, the Observer pattern isn’t going anywhere.  
> It may not be shiny or trendy, but it *just works*.  

# The Big Summary

## The Observer Pattern — Past, Present, and Future  

### **1. The Basics of Observers**  
The Observer pattern is a simple, powerful design solution:  
- A *subject* holds a list of *observers* and notifies them when its state changes.  
- This decouples systems and lets unrelated parts of a program communicate without tightly binding them together.  
- It’s fast, flexible, and surprisingly simple when done right.  

### **2. The Two Big Challenges**  

#### **a. Destroying subjects and observers**  
- If you delete an observer without unregistering it, subjects may still point to invalid memory — leading to crashes.  
- Likewise, destroying a subject can leave observers confused and expecting notifications that will never come.  
- Solutions:  
  - Have observers unregister themselves when destroyed (add cleanup logic in destructors).  
  - Subjects can send a final “goodbye” notification before being destroyed.  
  - A more automatic approach is to have the observer keep track of subjects and auto-unregister from all of them at destruction time.  

#### **b. The lapsed listener problem (even with garbage collection)**  
- In GC languages, forgetting to unregister observers can cause “zombie” objects that never get collected.  
- Example: A UI screen observes character health changes, but if not unregistered, it stays in memory forever.  
- Result: wasted CPU, memory bloat, and possibly buggy behavior.  
- Bottom line: GC doesn’t save you — manual discipline (or clever frameworks) is still required.  

### **3. The Maintainability Problem**  
- The Observer pattern decouples systems, but that makes the communication flow harder to reason about.  
- With static coupling, it’s easy to see who calls what.  
- With observers, you can only know who’s listening at runtime.  
- If two pieces of code belong to the same tightly integrated feature, explicit calls are often better.  
- Observers are best for bridging *separate domains* (e.g., physics and achievements) rather than linking code that should already be cohesive.  

### **4. Observers Today**  
- The pattern was designed in an OOP-heavy era (the '90s), where interfaces and classes ruled.  
- Today’s devs prefer *functional* and *lightweight* solutions.  
- Implementing entire observer classes for every event feels heavy and rigid.  
- Modern approaches lean on first-class functions, closures, and delegates (e.g., C# events, JavaScript callbacks).  
- If designing observers today, it would be function-based rather than interface-based — cleaner and more flexible.  

### **5. Observers Tomorrow**  

#### The Future Pain: Repetitive Observer Code  
- Most observer callbacks are repetitive UI updates:  
  - *“Health changed? Adjust the health bar.”*  
- This gets tedious and manual.  

#### The Evolution: Data Binding  
- **Data binding** automates that tedium:  
  - Declare relationships between state and UI.  
  - The framework handles updates.  
- Found in modern UI frameworks: React, Angular, SwiftUI, Flutter, WPF, etc.  
- It’s not suitable for core game engine code (due to performance overhead), but it’s becoming standard in UI layers.  

#### Observers will still remain  
- Observers are perfect for lightweight, decoupled notifications between unrelated systems.  
- They’re simple, proven, and reliable.  
- Even as frameworks evolve, observers will continue to be the behind-the-scenes glue.  

## Bottom Line  
- Observers are a classic solution that still works.  
- Garbage collection and fancy frameworks won’t save you from mismanagement — you must handle unregistering and destruction carefully.  
- Use observers to bridge different domains, but avoid them where direct, explicit coupling makes code clearer.  
- The future will likely lean more on data binding and declarative UI updates — but observers will always have a seat at the table for clean, simple event communication.

