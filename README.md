# Game Programming Patterns - Implementations in C++ and JavaScript

This repository contains practical implementations of **Design Patterns** for game development, inspired by the book [Game Programming Patterns by Robert Nystrom](https://gameprogrammingpatterns.com/).

Each pattern is accompanied by:

- 📖 A theoretical explanation from the book  
- 🎮 Examples of use in video games  
- 💻 Practical implementations in **C++** (with some legacy JavaScript examples being migrated)

---

## 📂 Repository Structure

The repository is organized into several sections:

### 1. `patterns/` - Theory and Use Cases

Includes clear explanations of each **design pattern**, along with references to how they’re used in real games.

Example:

`command/` pattern

- Contains a `README.md` with the **Command Pattern theory and use cases**

### 2. `src/` - C++ Implementations

Modern implementations of the patterns in **C++**, ideal for performance-sensitive and low-level control use cases in game development.

- Visual implementations may use [**Raylib**](https://www.raylib.com/) or the [**raylib-cpp**](https://github.com/RobLoach/raylib-cpp) wrapper.
- Each pattern is isolated in its own subfolder.

### 3. `javascript/` - Legacy JavaScript Implementations (Being Migrated)

- Contains original implementations in **JavaScript**.
- These are gradually being ported to C++ (in `src/`), prioritizing patterns that benefit more from low-level handling.

---

## 📌 Implemented Patterns

| Legend | Meaning |
| ------ | ------- |
| ✅     | Implemented |
| 🚧     | Work In Progress |

### Design Patterns Revisited

> [Design Patterns: Elements of Reusable Object-Oriented Software](https://isbndb.com/book/9780201633610)  
> Revisited by [Robert Nystrom](https://stuffwithstuff.com/)

| Pattern             | C++ (`src/`) | JS (`javascript/`) |
|---------------------|--------------|---------------------|
| Command             | 🚧            | ✅                  |
| Flyweight           | 🚧            | ✅                  |
| Observer            | 🚧            | ✅                  |
| Prototype           | 🚧            | ✅                  |
| Singleton           | 🚧            | ✅                  |
| State               | 🚧            | ✅                  |

### Sequencing Patterns

| Pattern | C++ (`src/`) |
| --- | --- |
| Double Buffer | ✅ |
| Game Loop | ✅ |
| Update Method | ✅ |

### Behavioral Patterns

| Pattern | C++ (`src/`) |
| --- | --- |
| Bytecode | 🚧 |
| Subclass Sandbox | 🚧 |
| Type Object | 🚧 |

### Decoupling Patterns

| Pattern | C++ (`src/`) |
| --- | --- |
| Component | 🚧 |
| Event Queue | 🚧 |
| Service Locator | 🚧 |

### Optimization Patterns

| Pattern | C++ (`src/`) |
| --- | --- |
| Data Locality | 🚧 |
| Dirty Flag | 🚧 |
| Object Pool | 🚧 |
| Spatial Partition | 🚧 |

---

### Each pattern includes:

- 📖 A **detailed explanation**
- 🎮 **Usage examples** in video games
- 💻 **Practical implementations** in **C++ (`src/`)** or **JavaScript (`javascript/`)**  

---

## 🛠️ How to Use This Repository

### 1. Clone the Repository

```bash
git clone https://github.com/pigeonStrikesBack/pigeonstrikesback-game-dev-patterns.git
cd pigeonstrikesback-game-dev-patterns
```

### 2. Explore the Theory

Start with the theory in `patterns/` to understand how each pattern works in a game context.

### 3. Try the Code

- For **C++** examples (`src/`):  
  Build and run them using your C++ toolchain. If visuals are included, make sure [Raylib](https://www.raylib.com/) or [raylib-cpp](https://github.com/RobLoach/raylib-cpp) is properly set up.

- For **JavaScript** examples (`javascript/`):  
  You can run them in your browser using the provided `index.html` files.

---

## 🎯 Project Goals

- Explore and implement classic and modern **Game Programming Patterns**
- Focus on **performance**, **readability**, and **reusability**
- Transition from high-level scripting (JS) to low-level systems (C++) to better reflect real-world game development