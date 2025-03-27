# **Objective:**  
In this exercise, you'll create a simple game using **Phaser.js** that demonstrates the **Prototype Pattern**. You'll learn how to:  

1. **Clone game entities dynamically** (e.g., monsters that respawn after being destroyed).  
2. **Clone UI components properly** (e.g., a button prototype creating different functional buttons).  
3. **Optimize object creation** by reusing and cloning existing objects instead of creating new ones from scratch.  

# **Step-by-Step Exercise:**  

## **Step 1: Create a Base Game Object (Prototype Pattern Implementation)**  
- Implement a `GameEntity` class that defines the base behavior for all game objects.  
- Ensure it has a `clone()` method to replicate itself when needed.  

## **Step 2: Implement a Clonable Monster Class**  
- Create a `Monster` class that extends `GameEntity`.  
- Each monster should be **clickable**, allowing players to remove them from the scene.  
- Monsters should move in **a slow circular pattern** using sine and cosine functions based on elapsed time.  
- When a monster is destroyed, **a new cloned monster should appear**.  

## **Step 3: Implement UI Cloning with the Prototype Pattern**  
- Create a **Button** class that can be cloned using the Prototype Pattern.  
- Implement a **Restart Button** that restarts the scene.  
- Clone the Restart Button into a **Spawn Button**, which adds a new monster when clicked.  
- Ensure cloned buttons maintain distinct behaviors while still following the prototype structure.  

## **Step 4: Implementing Interaction & Game Logic**  
- Clicking a monster should **remove it from the scene** and replace it with a cloned version.  
- The `Spawn` button should **generate a new monster at a random position**.  
- The `Restart` button should **fully reset the game**.  

# **Exercise Summary:**  
By the end of this exercise, you will have successfully implemented the **Prototype Pattern** in Phaser.js to:  

- **Clone Monsters dynamically** (instead of creating new instances manually).  
- **Clone UI Buttons with different behaviors** (Restart vs. Spawn).  
- **Optimize object management** to improve performance and structure.  

This exercise provides a **real-world use case of the Prototype Pattern** in both **gameplay (monsters)** and **UI components (buttons)**, demonstrating efficient object cloning within a Phaser.js game. 🚀  