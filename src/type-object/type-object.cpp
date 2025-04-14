#include <iostream>
#include <string>
#include "monster.hpp"

int main() {
    // Create a base breed: Troll
    Breed trollBreed(nullptr, 25, "The troll hits you!");
    std::cout << "Troll Breed - Health: " << trollBreed.getHealth()
              << ", Attack: " << trollBreed.getAttack() << std::endl;

    // Create a child breed: Troll Archer, inheriting from Troll
    Breed trollArcherBreed(&trollBreed, 0, "The troll archer fires an arrow!");
    std::cout << "Troll Archer Breed - Health: " << trollArcherBreed.getHealth()
              << ", Attack: " << trollArcherBreed.getAttack() << std::endl;

    // Create a monster of the Troll breed using the breed's factory method
    Monster* basicTroll = trollBreed.createMonster();
    std::cout << "Basic Troll - Health: " << basicTroll->getHealth()
              << ", Attack: " << basicTroll->getAttack() << std::endl;
    delete basicTroll;

    // Create a monster of the Troll Archer breed using its factory method
    Monster* archerTroll = trollArcherBreed.createMonster();
    std::cout << "Archer Troll - Health: " << archerTroll->getHealth()
              << ", Attack: " << archerTroll->getAttack() << std::endl;
    delete archerTroll;

    return 0;
}

/*
**Comments on Design Decisions:**

1.  **Inheritance in `Breed` using a parent pointer:** We chose to implement inheritance within the `Breed` class itself, rather than relying solely on the language's inheritance mechanisms for the `Breed` class. This was achieved by including a `parent_` pointer in the `Breed` class [1]. This allows us to create a hierarchy of `Breed` objects, where a child breed can inherit attributes from its parent breed [1]. Robert Nystrom mentions that this allows for sharing attributes across multiple breeds, similar to how breeds share attributes across multiple monsters [1].

2.  **"Copy-down" delegation for inheritance:** We implemented inheritance using the "copy-down" delegation approach within the `Breed` constructor [2]. When a new `Breed` is created with a parent, the constructor checks if the child breed has explicitly defined its health and attack. If not, it copies these attributes from the parent [2]. Nystrom explains that this approach applies inheritance at construction time, which can be a faster solution if the breed's attributes are not expected to change after creation [2].

3.  **`Breed` responsible for creating `Monster` instances:** We shifted the responsibility of creating `Monster` objects from the `main` function (or some external factory) to the `Breed` class itself by introducing a `createMonster()` factory method [Our Conversation History]. This aligns with the idea of the Type Object acting as a factory for its associated Typed Objects [Our Conversation History]. This also allows the `Breed` to have more control over the creation process of `Monster` objects of its type.

4.  **Private `Monster` constructor:** To enforce that `Monster` objects can only be created through their corresponding `Breed`, we made the constructor of the `Monster` class private [Our Conversation History]. This ensures that the `Breed` class maintains control over the instantiation of `Monster` objects and reinforces the relationship between a type and its instances. The `Breed` class is then declared as a `friend` of the `Monster` class to grant it access to this private constructor.
*/