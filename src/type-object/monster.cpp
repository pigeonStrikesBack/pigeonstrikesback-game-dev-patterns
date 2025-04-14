#include "monster.hpp"
#include <iostream>
#include <string>


Breed::Breed(Breed* parent, int health, const std::string& attack)
: parent_(parent), health_(health), attack_(attack) {
// Apply inheritance at construction time ("copy-down" delegation)
if (parent_ != nullptr) {
    // If the child breed's health is not explicitly set (remains at the default 0),
    // inherit the health from the parent. [2, 3]
    if (health_ == 0) health_ = parent_->getHealth();
    // If the child breed's attack is not explicitly set (remains empty),
    // inherit the attack from the parent. [2, 3]
    if (attack_.empty()) attack_ = parent_->getAttack();
}
}

Monster* Breed::createMonster() const{
    return new Monster(*this);
}

int Breed::getHealth() const { return health_; }

const std::string& Breed::getAttack() const {
    return attack_;
}

Monster::Monster(const Breed& breed) : health_(breed.getHealth()), breed_(breed) {}

const std::string& Monster::getAttack() const {
    return breed_.getAttack();
}

int Monster::getHealth() const {
    return health_;
}