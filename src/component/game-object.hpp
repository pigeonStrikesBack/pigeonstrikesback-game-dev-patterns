#pragma once

#include <iostream>
#include <vector>
#include <memory>

// Forward declaration
class Component;
class InputComponent;
class PhysicsComponent;
class GraphicsComponent;

// Components Container
class GameObject
{
public:
    GameObject(std::unique_ptr<InputComponent> input,
               std::unique_ptr<PhysicsComponent> physics,
               std::unique_ptr<GraphicsComponent> graphics)
        : inputComponent_(std::move(input)),
          physicsComponent_(std::move(physics)),
          graphicsComponent_(std::move(graphics)) {}

    void update();

    // Commonly shared state (managed by the GameObject)
    float positionX = 0.0f;
    float velocityX = 0.0f;

    // Method to swap the Input Component
    void swapInputComponent(std::unique_ptr<InputComponent> newInput);

// private: making those public just to simplify example reuse of components
    std::unique_ptr<GraphicsComponent> graphicsComponent_;
    std::unique_ptr<InputComponent> inputComponent_;
    std::unique_ptr<PhysicsComponent> physicsComponent_;
};

// Component Interface
class Component
{
public:
    virtual ~Component() = default;
    virtual void update(GameObject *gameObject) = 0;
};

// Input Component Interface
class InputComponent : public Component
{
public:
    virtual ~InputComponent() = default;
    virtual void handleInput(GameObject *gameObject) = 0;
    void update(GameObject *gameObject) override
    {
        handleInput(gameObject);
    }
};

// Physics Component Interface
class PhysicsComponent : public Component
{
public:
    virtual ~PhysicsComponent() = default;
    virtual void applyPhysics(GameObject *gameObject) = 0;
    void update(GameObject *gameObject) override
    {
        applyPhysics(gameObject);
    }
};

// Graphics Component Interface
class GraphicsComponent : public Component
{
public:
    virtual ~GraphicsComponent() = default;
    virtual void render(GameObject *gameObject) = 0;
    void update(GameObject *gameObject) override
    {
        render(gameObject);
    }
};
