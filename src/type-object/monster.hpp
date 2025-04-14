#pragma once

#include <string>

class Breed {
    public:
        // Constructor for the Breed class.
        // Design Decision 1: Implementing inheritance through a parent pointer. [1]
        // Design Decision 2: Using "copy-down" delegation for attribute inheritance. [2]
        Breed(Breed* parent, int health, const std::string& attack);
    
        // Factory method for creating Monster objects of this breed.
        // Design Decision 3: Giving the Breed class the responsibility of creating Monster instances. [Our Conversation History]
        class Monster* createMonster() const;
        int getHealth() const;
        const std::string& getAttack() const;
    
    private:
        Breed* parent_;
        int health_;
        std::string attack_;
    };
    
    class Monster {
        // Allow Breed to access the private constructor.
        friend class Breed;

    public:
        const std::string& getAttack() const;
        int getHealth() const;
    
    private:
        // Private constructor, can only be called by Breed.
        // Design Decision 4: Making the Monster constructor private to enforce creation only through Breed. [Our Conversation History]
        Monster(const Breed& breed);
    
        int health_;
        const Breed& breed_;
    };