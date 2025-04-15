#include "game-object.hpp"

// Forward declaration
class Component;
class InputComponent;
class PhysicsComponent;
class GraphicsComponent;


void GameObject::update() {
    if (inputComponent_) {
        inputComponent_->update(this);
    }
    if (physicsComponent_) {
        physicsComponent_->update(this);
    }
    if (graphicsComponent_) {
        graphicsComponent_->update(this);
    }
    std::cout << "GameObject: --- Frame End ---" << std::endl;
}
    
// Method to swap the Input Component
void GameObject::swapInputComponent(std::unique_ptr<InputComponent> newInput) {
    std::cout << "GameObject: Swapping Input Component." << std::endl;
    inputComponent_ = std::move(newInput);
}
