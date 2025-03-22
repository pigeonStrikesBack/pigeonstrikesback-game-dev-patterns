# Prototype Pattern 

> this is [Game Programming Patterns]()'s book summary, all rights goes to Nyam vattelapesca TODO: fix this

## **1. Historical Background & Introduction**

- The term "prototype" is now widely used, but this chapter brings us back to its origins in *Design Patterns* by the Gang of Four.  
- One of the first practical uses of the prototype pattern was in Ivan Sutherland’s **Sketchpad project (1963)** — a legendary piece of work that laid the foundation for:  
  - CAD (Computer-Aided Design)  
  - Interactive graphics  
  - Object-oriented programming concepts  

### **2. Key point:**  

> While others were busy with pop culture (Dylan, Beatles), Sutherland was revolutionizing computing with the concept of duplicating complex objects via prototypes rather than recreating them from scratch.  

### **3. What this implies for the pattern:**  

- The Prototype pattern is about **cloning an existing object** instead of instantiating a new one.  
- This allows the creation of complex objects without repeating their construction process.  

## The Prototype Pattern  

### **1. The Problem Setup**  
- In a Gauntlet-style game, we have monsters (Ghost, Demon, Sorcerer, etc.) spawned by dedicated *spawner* classes.  
- Initially, each monster has its own spawner (GhostSpawner, DemonSpawner, etc.), resulting in:  
  - Parallel class hierarchies  
  - Lots of boilerplate code  
  - Repetition and redundancy  

### **2. The Prototype Pattern Solution**  
- Instead of separate spawners, each monster **clones itself** to create new instances.  
- This eliminates duplicate spawner classes.  
- Key idea:   
> If you have one ghost, you can create more ghosts by cloning it.  

### **3. Implementation Highlights**  
- Add a `clone()` method in the base `Monster` class:  
```cpp
class Monster {
public:
  virtual ~Monster() {}
  virtual Monster* clone() = 0;
};
```
- Each monster subclass implements `clone()`, copying its internal state:  
```cpp
class Ghost : public Monster {
public:
  Ghost(int health, int speed) : health_(health), speed_(speed) {}
  virtual Monster* clone() { return new Ghost(health_, speed_); }
private:
  int health_;
  int speed_;
};
```
- The `Spawner` class now takes a prototype and uses `clone()` to spawn monsters:  
```cpp
class Spawner {
public:
  Spawner(Monster* prototype) : prototype_(prototype) {}
  Monster* spawnMonster() { return prototype_->clone(); }
private:
  Monster* prototype_;
};
```
- Example usage:  
```cpp
Monster* ghostPrototype = new Ghost(15, 3);
Spawner* ghostSpawner = new Spawner(ghostPrototype);
```
- Bonus: Different prototypes can be configured with different states, so you could have fast ghosts, weak ghosts, or tanky ghosts.  

### **4. Key takeaway:**  
> Prototype pattern elegantly solves the redundancy of parallel spawner classes, using cloning to both preserve class and state.  

## Does it really help?  

### **1. Does it really help?**  

#### - ✅ **Pros:**  
  - Removes the need for a separate spawner class for each monster type.  
  - Cleaner instantiation via `clone()`.  

#### - ❗ **But…**  
  - You still need to implement `clone()` in every subclass, which might be just as much work as writing individual spawners.  
  - Writing `clone()` properly introduces complexity:  
    - **Deep clone or shallow clone?**  
      - Example: If a Demon holds a pitchfork, do you also clone the pitchfork or just reference it?  
      - Deep clones can get complicated and error-prone.  

### **2. The problem with big class hierarchies**  
- The Prototype pattern assumes large, separate classes for every monster type.  
- In modern game dev (and software design in general), this is discouraged:  
  - Large hierarchies are difficult to maintain and scale.  
  - Modern engines favor:  
    - **Component-based design:** Compose entities from reusable behaviors.  
    - **Type Object pattern:** Store entity attributes in data rather than separate classes.  

### **3. Takeaway:**  
> While the Prototype pattern is clever and elegant, it can feel contrived in scenarios with large hierarchies. In real-world use cases, it often gets replaced by more dynamic, data-driven designs.  

## Spawn Functions  

### **1. Another approach: Spawn functions**  
- Instead of writing separate spawner classes or using prototypes with `clone()`, you can just write **spawn functions**:  
```cpp
Monster* spawnGhost() {
  return new Ghost();
}
```
- These functions are simple factories for each monster type.  

### **2. Storing spawn functions inside the spawner**  
- The `Spawner` class now holds a **function pointer** (or callback) to a spawn function:  
```cpp
typedef Monster* (*SpawnCallback)();

class Spawner {
public:
  Spawner(SpawnCallback spawn)
  : spawn_(spawn) {}

  Monster* spawnMonster() {
    return spawn_();
  }

private:
  SpawnCallback spawn_;
};
```
- Creating a ghost spawner becomes super simple:  
```cpp
Spawner* ghostSpawner = new Spawner(spawnGhost);
```

### **3. Pros:**  
✅ Less boilerplate than creating subclasses or clone logic.  
✅ More explicit and flexible.  
✅ Easy to reuse and understand.  

### **4. Cons:**  
❗ Still doesn't address the problem of having lots of monster classes.  
❗ If monster state is dynamic and varied, spawn functions could still become repetitive or overly manual.  

### **Bottom line:**  
> Spawn functions are a clean, pragmatic alternative to the prototype pattern or parallel spawner class hierarchies. But they still depend on having lots of separate monster classes — something modern design trends try to avoid.  

## Templates  

### **1. Introducing Templates for Spawning**  
- Instead of using spawn functions or prototypes, we can leverage **C++ templates** to avoid repetition and boilerplate.  
- The `Spawner` class is kept as an abstract interface, and then a templated subclass is created:  

```cpp
class Spawner {
public:
  virtual ~Spawner() {}
  virtual Monster* spawnMonster() = 0;
};

template <class T>
class SpawnerFor : public Spawner {
public:
  virtual Monster* spawnMonster() { return new T(); }
};
```
- This allows you to create spawners for different monster types without duplicating code.

### **2. Usage Example:**  
```cpp
Spawner* ghostSpawner = new SpawnerFor<Ghost>();
```
- Very clean, almost no boilerplate, and no need to manually define `clone()` or write spawn functions for each type.  

### **3. Why still have a `Spawner` base class?**  
- Without `Spawner` as a supertype, every part of the code using a spawner would also need to be templated.  
- The `Spawner` abstract class allows working with spawners of any type through polymorphism:  
  - `std::vector<Spawner*> spawners;`  
  - Easily loop and call `spawnMonster()` regardless of what they spawn.  

### **4. Pros:**  
✅ Clean, minimal code with zero repetition.  
✅ No need to write `clone()` functions or spawn callbacks.  
✅ Works well if monster classes have simple, default constructors.  

### **5. Cons:**  
❗ Templates can become complex and intimidating in large codebases.  
❗ Still relies on monster classes with explicit constructors.  
❗ If monsters need dynamic state, this might be too rigid.  

### **Bottom line:**  
> Templates give you a simple, elegant tool for removing boilerplate in spawners — but they work best when your monsters are straightforward and don’t need dynamic runtime customization.  

## First-Class Types  

### **1. First-Class Types Concept**  
- In **statically typed languages** (like C++), types aren’t first-class values — you can’t pass them around as objects.  
- This limitation forces complex solutions like:  
  - Clone methods  
  - Templates  
  - Function pointers  

### **2. Dynamically-typed languages** (like JavaScript, Python, Ruby) **do have first-class types:**  
- Classes are objects themselves; they can be passed around, stored in variables, and called directly.  
- This makes spawning simple and elegant:  
```js
class Ghost {
  constructor() { /* ... */ }
}

function spawnMonster(MonsterClass) {
  return new MonsterClass();
}

const ghostSpawner = () => spawnMonster(Ghost);
```
- No need for clone methods or template classes; the language handles the "type-as-value" part natively.

### **3. Type Object pattern**  
- Even in dynamic languages, developers sometimes prefer the **Type Object** pattern.  
- This pattern lets you define "types" manually, possibly with different semantics, constraints, or metadata beyond what native classes provide.

### **4. Key Takeaway**  
> In languages where classes are first-class objects, the Prototype pattern’s complexity is unnecessary. You can just pass around classes or constructors directly as spawn factories.  

### **5. Conclusion of this part:**  
- In dynamic languages, the Prototype pattern is basically redundant.  
- If you're working in JavaScript or Python: just pass classes or constructor functions.  
- The design pattern is more of a workaround for static languages with rigid type systems.

## The Prototype Language Paradigm  

### **1. OOP ≠ Classes**  
- Most people equate **Object-Oriented Programming** with **classes**.  
- But the essence of OOP is bundling **state + behavior** into objects.  
- Classes are just one mechanism to achieve that.  

### **2. Self: A Classless OOP Language**  

- **Self** (developed by Dave Ungar & Randall Smith in the 1980s) is a pure OOP language with:  
  - No classes  
  - Objects are created by **cloning existing objects** (prototypes) and modifying them.  
  - Behavior and data are attached directly to objects.  

### **3. How it works**  

- Instead of class hierarchies, you have a **web of prototypes**:  
  - An object is made by **cloning another object** and customizing it.  
  - No rigid "class" structures, just an evolving chain of objects derived from one another.  

### **4. Influence of Self**  

- Self inspired many future languages, most notably:  
  - **JavaScript's prototype-based inheritance model**  
  - **Lua** and other prototype-based designs  

### **5. Key takeaway**  

> The prototype paradigm isn’t just a pattern — in some languages, it’s the entire philosophy.  
- Instead of thinking in terms of rigid templates (classes), think in terms of **copying and customizing live objects**.  

## Self Language

### **1. Self’s Radical Simplicity**  

- Self is considered **more purely object-oriented** than class-based languages.  
- In class-based languages:  
  - **State** lives in the instance (fields).  
  - **Behavior** lives in the class (methods).  
  - Method calls require indirection: from the instance to its class and then to the method.  

### **2. In Self:**  

- No separation — state and behavior both live inside the **same object**.  
- An object is just a bag of fields and methods; no classes.  
- Each object can have **unique behavior**.  

### **3. Delegation Instead of Inheritance**  

- If an object doesn’t have a field or method, it **delegates** the lookup to its parent object.  
- This parent relationship forms a chain (or multiple chains, since Self allows multiple parents).  
- This mechanism replicates inheritance but with more flexibility, including **dynamic inheritance** (changing parents at runtime!).  

### **4. Object creation without classes**  

- Without `new` and classes, you create objects by:  
  1. **Creating and shaping a single “template” object** by adding fields and methods.  
  2. **Cloning** that object as many times as needed.  
- In Self, every object inherently supports cloning — **Prototype design pattern is built-in by default.**  

### **5. The elegance of Self**  

> Self is beautifully minimal: it shows that prototypes aren’t just a workaround — they can be the core model of a language.  
- This inspired the author to create **Finch**, a prototype-based language, for deeper understanding and experimentation.  

## Reflections on Self and Pure Prototype Languages

### **1. Initial Excitement, Followed by Frustration**  

- The author was **excited** to build and use a pure prototype-based language (Finch), inspired by Self.  
- But once working with it, they realized:  
  - **It wasn’t that fun** to program in.  
  - The lack of structure and predefined categories felt like a burden.  

### **2. Complexity Shifted to the User**  
- Self’s simplicity as a language design meant that all complexity was shifted onto the programmer.  
- Without classes, the author found themselves **rebuilding structure at the library level**, trying to recreate “kinds of things” that classes offer naturally.  

### **3. Human Nature Prefers Structure**  
- Most people (and developers) seem to prefer **clear, labeled categories and taxonomies**:  
  - Think: character classes in RPGs, named enemy types, well-defined item sets.  
  - The idea of endlessly unique “snowflake” entities feels disorganized and hard to manage.  

### **4. The Real Value of Self**  
- Although Self wasn’t practical for mainstream programming, it had huge impact:  
  - The **virtual machine innovations** developed for Self (JIT compilation, garbage collection, fast method dispatch) became the foundation of performance techniques used in popular dynamic languages like **JavaScript, Python, and Ruby**.  
  - Many of these techniques were even implemented by the same engineers who worked on Self.  

### **5. Prototype Programming Today**  
- While the prototype pattern and prototype-based programming are intellectually fascinating, in practice:  
  - Codebases that go “all-in” on prototypes tend to feel **mushy, ad hoc, and difficult to reason about**.  
  - The author observed very little real-world code fully written in that style.  

## JavaScript and Prototypes

### **1. JavaScript’s Prototype-Based Nature**  

- **JavaScript**, while widely used and prototype-based, has a lot of **class-based features** baked in.  
- Brendan Eich, the creator of JavaScript, took **inspiration directly from Self** (a prototype-based language). In JavaScript:
  - **Objects** can have arbitrary properties (fields and methods, with methods being functions stored as fields).
  - Objects can have a **prototype**, allowing them to **delegate** to another object if a field access fails.  
- Despite these prototype-based mechanics, JavaScript has evolved to be more class-like in practice.  

### **2. Prototypes Are Simple to Implement**  

- One of the reasons JavaScript was so easy and quick to implement is that **prototypes are simpler than classes**.  
- The first version of JavaScript was created in just **10 days** by leveraging the simplicity of prototypes.  
- However, as JavaScript evolved, it integrated more features common in class-based languages.  

### **3. Cloning Is Absent**  

- In **pure prototype-based languages**, cloning is a key operation. However, JavaScript **does not have a cloning method**.  
- Instead, it has `Object.create()`, which allows the creation of new objects that **delegate to an existing object**.  
  - This method wasn’t even introduced until **ECMAScript 5**, 14 years after JavaScript was created.  
- This lack of cloning in JavaScript signifies a departure from pure prototype-based languages like Self.  

### **4. JavaScript’s Object Creation and Behavior**  

- In JavaScript, creating objects and defining behavior works as follows:
  - **Constructor functions**: These functions create objects and initialize their fields. Example:
    ```javascript
    function Weapon(range, damage) {
      this.range = range;
      this.damage = damage;
    }
    ```
  - **Creating an instance**: When `new Weapon(10, 16)` is called, a new object is created and initialized with `range` and `damage`. The object is then wired to delegate to `Weapon.prototype`.  
  - **Prototypes for behavior**: Methods like `attack()` are added to the **prototype** rather than the instance. Example:
    ```javascript
    Weapon.prototype.attack = function(target) {
      if (distanceTo(target) > this.range) {
        console.log("Out of range!");
      } else {
        target.health -= this.damage;
      }
    };
    ```
  - **Delegation**: Objects created via `new Weapon()` delegate to `Weapon.prototype` for behavior. Thus, calling `sword.attack()` will invoke the `attack` method from the prototype.  

### **5. Prototypes vs. Classes**  

- Despite its prototype-based mechanics, JavaScript’s structure closely resembles **class-based OOP**:
  - **State** is stored directly on the instance.
  - **Behavior** is delegated through the prototype object.
  - The object creation mechanism via `new` and constructor functions mirrors how classes work in many other OOP languages.
- **In essence**, JavaScript supports both prototype-based and class-like approaches, but **the language’s idioms and syntax** encourage a class-based design pattern.  
- The **class-based structure** is generally easier for developers, making code more **manageable and readable**. 

### **6. Conclusion: A Hybrid Approach**  

- JavaScript allows you to write **prototype-based code** if you wish, but it heavily leans towards class-like structures in practice.  
- While **prototypes** offer flexibility, they can sometimes lead to **harder-to-maintain code**.  
- The class-like features in JavaScript provide a **more structured** way of programming, making the code easier to work with. **For this reason, JavaScript’s current approach is seen as a good balance.**

## Prototypes for Data Modeling in Games

### **1. The Evolution of Data vs. Code in Games**  

- In modern games, the **majority of the data** consists of **game content** (monsters, items, etc.), and the **code** primarily functions as the **engine** driving the game.
- As the game data grows, managing this data can get complicated, especially as we want to **reuse patterns** across similar objects (e.g., different types of goblins).  

### **2. The Problem of Duplication**  

- Data definitions in **JSON** (or similar formats) for entities like monsters or items often result in **duplication**, which can be tedious to maintain. For example, having separate data for each type of goblin with repeated attributes like health, resistances, and weaknesses.  
- Without a way to manage this duplication, developers and designers risk making **errors and inconsistencies** when updating common attributes across multiple entities.  
  - **Example of repetitive data**:
    ```json
    {
      "name": "goblin grunt",
      "minHealth": 20,
      "maxHealth": 30,
      "resists": ["cold", "poison"],
      "weaknesses": ["fire", "light"]
    }
    ```

### **3. Introducing Prototypes for Data Reuse**  

- To reduce repetition, **prototypes** can be used as a method of **delegation** in data. Instead of repeating common attributes in each object (e.g., every goblin’s health), we **delegate** those properties to a prototype object.  
- If an object has a `"prototype"` field, it points to another object it **inherits** properties from. Missing properties on the current object are **looked up** in the prototype.

### **4. Simplifying the Goblin Data with Prototypes**  

- Using prototypes, we can delegate common properties (like health, resistances, and weaknesses) to a base object, which helps keep the data concise and easy to maintain.
  - **Example of delegated data**:
    ```json
    {
      "name": "goblin grunt",
      "minHealth": 20,
      "maxHealth": 30,
      "resists": ["cold", "poison"],
      "weaknesses": ["fire", "light"]
    }
    ```

    ```json
    {
      "name": "goblin wizard",
      "prototype": "goblin grunt",
      "spells": ["fire ball", "lightning bolt"]
    }
    ```

    ```json
    {
      "name": "goblin archer",
      "prototype": "goblin grunt",
      "attacks": ["short bow"]
    }
    ```
- Here, the **goblin wizard** and **goblin archer** objects inherit the properties of the **goblin grunt** through the `"prototype"` field, eliminating the need to repeat common data.

### **5. Prototypes as a Natural Fit for Game Data**  

- Prototypes allow for **flexible and dynamic data models**:
  - A **"base" object** (e.g., goblin grunt) can serve as the foundation for more specialized entities like **goblin wizard** and **goblin archer**.
  - This approach works particularly well for **unique entities** in a game, like **bosses** or **special items**, which are refinements of more common entities.
  - Example: A **Sword of Head-Detaching** is just a **longsword** with extra attributes (e.g., a damage bonus). Instead of creating a whole new object for it, we can use delegation:
    ```json
    {
      "name": "Sword of Head-Detaching",
      "prototype": "longsword",
      "damageBonus": 20
    }
    ```

### **6. Advantages of Prototypes in Data Modeling**  

- **Reduced duplication**: Common attributes are inherited from a prototype object, so you don’t need to repeat them.
- **Easier maintenance**: If a common attribute changes (e.g., increasing health), you only need to modify the prototype.
- **Flexibility**: Prototypes allow designers to easily add variations and unique characteristics to game objects, especially for **dynamic and evolving game worlds**.
- **Richness in game world**: The ability to model many variations without adding significant complexity enhances the **depth** of the game, which players appreciate.

### **7. Conclusion**  

Prototypes, or more specifically **delegation**, offer an elegant solution to managing data in games. By delegating common properties to base objects (prototypes), you can create a **cleaner, more maintainable data model** while allowing designers to easily build and refine game content. This approach is **especially effective for complex or evolving game worlds**, where unique and variable content is key.

# The big summary

Sorry about that! Here's a concise summary of the **Prototype Pattern** based on the information provided:

##**Prototype Pattern Summary**

The Prototype Pattern is a design pattern where objects are cloned instead of created from scratch. It’s useful in situations where the creation of new objects is costly, and you want to duplicate an existing object with the same state. This pattern was first practically applied in Ivan Sutherland’s **Sketchpad project** and was later discussed in the *Design Patterns* book by the Gang of Four.

## **Problem Setup**
In games, like a **Gauntlet-style game**, different monsters need to be spawned frequently. Initially, each type of monster has its own spawner, leading to redundant code and complex class hierarchies.

## **Solution**
Instead of using separate spawners, monsters **clone** themselves to create new instances, thus eliminating redundant spawner classes.

## **Implementation**
- Add a `clone()` method in the base class (e.g., `Monster`).
- Subclasses implement `clone()` to copy their internal state.
- The `Spawner` class can then use `clone()` to spawn new monsters.

Example:
```cpp
class Monster {
public:
  virtual Monster* clone() = 0;
};

class Ghost : public Monster {
public:
  Monster* clone() { return new Ghost(health_, speed_); }
private:
  int health_;
  int speed_;
};
```

## **Pros and Cons**
- **Pros**: Reduces redundancy, cleaner instantiation, and more flexible.
- **Cons**: Requires implementing `clone()` in every subclass, and deep cloning can get complex.

## **Alternatives**
1. **Spawn Functions**: Simple functions that spawn new objects without needing separate spawner classes.
2. **Templates**: Use C++ templates for cleaner spawners without repeating code.
3. **First-Class Types** (dynamic languages): In languages like JavaScript, types are first-class, so cloning is unnecessary, and classes can be passed directly.

## **Modern Considerations**
- The **Prototype Pattern** works best in simple object hierarchies. In modern game development, **component-based designs** and **data-driven designs** are more common than large inheritance hierarchies.
- The **Prototype Pattern** might feel unnecessary in dynamically typed languages, where classes are passed around directly, eliminating the need for complex cloning or template systems.

## **Game Data Models**
Prototypes can also be used in **game data** (e.g., JSON objects for monsters) to reduce redundancy and improve maintainability by inheriting attributes from a prototype.

In short, the Prototype Pattern is about cloning existing objects to avoid unnecessary repetition. However, in modern game development and languages, it’s often replaced by more flexible and data-driven approaches.
