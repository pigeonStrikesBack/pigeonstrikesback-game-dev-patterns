### Summary: Singleton Introduction

This chapter takes a different approach from the rest—it focuses on **why you shouldn’t use the Singleton pattern** rather than how to use it.

The **Gang of Four** originally intended Singleton to be used **sparingly**, but the message got lost, especially in the game industry. Many developers overuse Singletons, often treating them as a quick fix for accessing shared data. However, this is like **using a splint to treat a bullet wound**—it may seem helpful but often causes more problems than it solves.

The rise of **object-oriented programming (OOP)** from procedural languages like C led to a common problem: **"How do I access an instance of an object?"** Instead of designing proper dependency management, many developers took the easy route—**making an instance global through a Singleton**. While convenient, this approach can lead to **tightly coupled, hard-to-maintain code**.

### Summary: The Singleton Pattern  

The **Singleton Pattern**, as defined by the **Gang of Four**, ensures that:  
1. A **class has only one instance**.  
2. There is a **global point of access** to that instance.  

#### **Restricting a Class to One Instance**  
Some classes **must** have only one instance to function correctly. This is often true when dealing with **external systems that maintain global state**—such as a **file system API**.  

Example:  
- A **file system wrapper** that performs asynchronous operations needs to track all file operations.  
- If multiple instances existed, one instance wouldn’t know about operations started by another, leading to conflicts.  
- **Singleton ensures that only one instance exists at compile time.**  

#### **Providing a Global Point of Access**  
If multiple systems (e.g., logging, content loading, and saving game state) need access to the file system wrapper, **Singleton provides a shared instance** that can be accessed from anywhere.  

#### **Classic Singleton Implementation (C++)**  
```cpp
class FileSystem
{
public:
  static FileSystem& instance()
  {
    // Lazy initialization
    if (instance_ == NULL) instance_ = new FileSystem();
    return *instance_;
  }

private:
  FileSystem() {}  // Private constructor prevents multiple instances
  static FileSystem* instance_;
};
```
- The `static instance_` variable ensures a single instance.  
- The **private constructor** prevents direct instantiation.  
- The **public static `instance()` method** provides access to the singleton.  
- **Lazy initialization** creates the instance only when needed.  

#### **Modern Thread-Safe Singleton (C++11+)**  
```cpp
class FileSystem
{
public:
  static FileSystem& instance()
  {
    static FileSystem *instance = new FileSystem();
    return *instance;
  }

private:
  FileSystem() {}
};
```
- Uses **local static variable initialization**, which is guaranteed to run only once, even with concurrency.  
- **Thread-safe initialization**, but the class itself may still need additional safeguards for multi-threaded access.  

While Singleton ensures safe initialization, **the thread-safety of operations on the singleton is a separate concern**.

### **Why We Use Singleton**  

At first glance, **Singleton** seems like a great solution. It allows our **file system wrapper** to be accessed globally without having to pass it around explicitly, and it ensures that only one instance exists. Some additional benefits include:  

#### **1. Saves Memory and CPU Cycles**  
- The **singleton instance is created only when needed**.  
- If the game never interacts with the file system, it won’t be instantiated at all.  

#### **2. Solves Static Initialization Order Issues**  
- An alternative to Singleton is using **static member variables**, but those get initialized **before** `main()` runs.  
- This means they can’t rely on runtime information (e.g., **configuration files**) or other statically initialized objects.  
- **Lazy initialization** ensures the singleton is created only when first accessed, so it can use runtime data safely.  

#### **3. Supports Subclassing (Platform-Specific Implementations)**  
- Singleton can be turned into a **base class with different implementations** for various platforms.  
- This allows an **abstract interface** while keeping platform-specific logic encapsulated.  

##### **Abstract File System Interface**  
```cpp
class FileSystem
{
public:
  virtual ~FileSystem() {}
  virtual char* readFile(char* path) = 0;
  virtual void  writeFile(char* path, char* contents) = 0;
};
```
##### **Platform-Specific Implementations**  
```cpp
class PS3FileSystem : public FileSystem
{
public:
  virtual char* readFile(char* path) { /* Sony file IO API */ }
  virtual void writeFile(char* path, char* contents) { /* Sony file IO API */ }
};

class WiiFileSystem : public FileSystem
{
public:
  virtual char* readFile(char* path) { /* Nintendo file IO API */ }
  virtual void writeFile(char* path, char* contents) { /* Nintendo file IO API */ }
};
```
##### **Making FileSystem a Singleton**  
```cpp
class FileSystem
{
public:
  static FileSystem& instance();

  virtual ~FileSystem() {}
  virtual char* readFile(char* path) = 0;
  virtual void writeFile(char* path, char* contents) = 0;

protected:
  FileSystem() {}
};
```
##### **Platform-Specific Singleton Instantiation**  
```cpp
FileSystem& FileSystem::instance()
{
  #if PLATFORM == PLAYSTATION3
    static FileSystem *instance = new PS3FileSystem();
  #elif PLATFORM == WII
    static FileSystem *instance = new WiiFileSystem();
  #endif

  return *instance;
}
```
- This allows **the entire codebase to access** `FileSystem::instance()` without being tied to any specific platform.  
- Platform dependencies are encapsulated **inside the singleton implementation** rather than scattered throughout the code.  

### **Conclusion**  
At this stage, **Singleton appears to be an elegant solution** for our file system wrapper:  
✅ **Global access** for convenience.  
✅ **Lazy initialization** for efficiency.  
✅ **Encapsulation of platform-specific code** for maintainability.  

Everything seems perfect—**but is it really?** 🚨  
The next section will discuss **the problems with Singleton** and why it might not be as great as it seems.

### **Why We Regret Using Singleton**  

At first, **Singleton** seems like a perfect solution, but over time, it reveals serious **design flaws** that cause more problems than they solve.  

## **1. Singleton = Global Variable** 🚨  
One of the biggest issues with Singletons is that they are **just global variables wrapped in a class**.  

### **Problems with Global Variables**  
🔴 **Harder to Debug & Reason About**  
- If a function does not access global state, we can understand its behavior by looking at its **body and arguments**.  
- Functions that don’t rely on global state are called **pure functions**—they are easier to debug, optimize, and test.  
- When a function accesses a **global instance**, debugging becomes **a nightmare**. You need to search the **entire codebase** to track down what modifies that global state.  

🔴 **Encourages Tight Coupling**  
- A **globally accessible** Singleton tempts programmers to take shortcuts.  
- Example: A new developer wants **boulders** to make sounds when they hit the ground. Instead of following proper architecture, they **directly reference** `AudioPlayer::instance()`.  
- Now, **physics is tightly coupled to audio**, breaking modularity.  

🔴 **Not Thread-Safe**  
- In modern **multi-threaded games**, global state leads to **race conditions** and **deadlocks**.  
- Multiple threads can access the Singleton instance, leading to unpredictable behavior.  

> **Singletons don’t solve any of these issues**—they **are** global variables with extra steps.  

## **2. Solving Two Problems, Even When We Only Have One**  
The **Gang of Four**’s Singleton pattern combines **two** ideas:  
✅ **Ensuring a single instance**  
✅ **Providing global access**  

But do we always need both? **Usually not.**  

### **Example: Logging System**  
- A logging system should be **easily accessible** from anywhere in the codebase.  
- The obvious solution? **Make it a Singleton.**  
- But this locks us into having **only one** logger.  

🔴 **Problem: We Can’t Have Multiple Loggers Later**  
- Suppose we later need separate logs for **UI, physics, audio, and network**.  
- We can’t, because the Singleton enforces a **single instance**.  
- Now, we need to **refactor every call** from `Log::instance().write()` to something else—**a massive rewrite.**  

> **Singleton restricts us in ways we didn’t expect**—we get **global access**, but at the cost of **flexibility**.  

## **3. Lazy Initialization is a Problem in Games**  
Many Singletons use **lazy initialization**:  
```cpp
class FileSystem {
public:
  static FileSystem& instance() {
    static FileSystem *instance = new FileSystem();
    return *instance;
  }
private:
  FileSystem() {}
};
```
- In **desktop applications**, lazy initialization is fine.  
- But in **games**, initialization must be **carefully controlled** for performance reasons.  

🔴 **Problem: Uncontrolled Load Times**  
- If `AudioSystem` initializes **the first time a sound plays**, that could be **in the middle of combat**, causing **frame drops**.  
- We want to initialize systems **at the right time**—not whenever they’re first accessed.  

🔴 **Problem: Heap Fragmentation**  
- Games carefully manage **memory layout** to prevent fragmentation.  
- If a system randomly initializes itself in the middle of execution, it can cause **unexpected memory fragmentation**.  

### **Solution: Static Initialization Instead?**  
To avoid lazy initialization, some games do this instead:  
```cpp
class FileSystem {
public:
  static FileSystem& instance() { return instance_; }
private:
  FileSystem() {}
  static FileSystem instance_;
};
```
🔴 **But This Removes Key Singleton Benefits**  
- No more **polymorphism**—we can’t have different `FileSystem` implementations.  
- It **must be initialized at compile time**, removing **flexibility**.  
- We can’t **free its memory** when it’s no longer needed.  

### **Better Alternative: Just Use a Static Class**  
If you **don’t need an instance**, **why use Singleton at all?**  
Instead of this:  
```cpp
FileSystem::instance().readFile("data.txt");
```
Just do this:  
```cpp
FileSystem::readFile("data.txt");
```
✅ **Easier to use**  
✅ **No unnecessary instance management**  
✅ **Makes it clear that it’s just a static utility class**  

## **Conclusion: Should You Ever Use Singleton?**  
🚫 **Avoid Singleton when possible.**  
✅ Use **dependency injection** instead—pass the needed object explicitly.  
✅ Use **static functions** if no instance is needed.  
✅ If you truly need a single instance, consider **carefully managing its lifetime** rather than using lazy initialization.  

Singleton seems convenient at first, but over time, it leads to **tight coupling, hard-to-debug code, and performance problems**—things we **definitely** want to avoid in game development.

### Summary of Alternatives to Singleton  

#### **Check if You Need the Class at All**  
Many singletons in game development are just “managers” that oversee objects unnecessarily. Often, they can be eliminated by moving their functionality into the objects they manage. For example, a `BulletManager` can be removed if `Bullet` handles its own logic.  

#### **To Limit a Class to a Single Instance**  
Instead of using a Singleton, a class can enforce single instantiation without global access by using a static boolean flag with `assert()`. This ensures that multiple instances aren’t created while keeping the class’s scope limited.  

#### **To Provide Convenient Access to an Instance**  
- **Pass It In:** The simplest solution is to pass required objects as parameters where needed (dependency injection).  
- **Use a Base Class:** If multiple objects need access to the same resource, a base class can provide protected access to it.  
- **Use an Existing Global Object:** Instead of making multiple singletons, store objects inside an already global class (e.g., `Game`) and access them through it.  
- **Service Locator Pattern:** A dedicated class can store and retrieve global services as needed.  

Each alternative maintains better encapsulation, reducing the downsides of singletons while keeping access flexible.

### **What’s Left for Singleton?**  

In practice, the full Singleton pattern (as described by the Gang of Four) is rarely necessary in game development. Instead, alternatives like **static classes** or **runtime checks** (using a static flag) are usually sufficient for ensuring only one instance of a class exists.  

For managing shared state while avoiding global access, patterns like **Subclass Sandbox** and **Service Locator** offer better flexibility. The **Subclass Sandbox** allows instances to share state without making it globally available, while the **Service Locator** provides global access but allows more control over configuration.  

Ultimately, Singleton should be a last resort rather than a default choice.



