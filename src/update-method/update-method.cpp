#include <iostream>
#include <vector>
#include <chrono>
#include <thread>

// Forward declaration of the Entity class
class Entity;

// Basic Entity Update
// This class represents a generic game entity with basic properties like position (x, y).
class Entity
{
public:
    // Constructor to initialize the entity's position
    Entity(double x = 0, double y = 0) : x_(x), y_(y) {}

    // Virtual destructor to allow proper cleanup in derived classes
    virtual ~Entity() {}

    // Virtual update method to be overridden by derived classes
    virtual void update() {}

    // Accessor methods for position
    double x() const { return x_; }
    double y() const { return y_; }

    // Mutator methods for position
    void setX(double x) { x_ = x; }
    void setY(double y) { y_ = y; }

private:
    double x_; // X-coordinate of the entity
    double y_; // Y-coordinate of the entity
};

// The World class manages a collection of entities and runs the game loop.
class World
{
public:
    // Adds an entity to the world
    void addEntity(Entity *entity)
    {
        entities_.push_back(entity);
    }

    // The game loop simulates the game running frame by frame
    void gameLoop()
    {
        while (true)
        {
            std::cout << "--- Frame Start ---" << std::endl;

            // Simulate handling user input
            std::cout << "Handling input..." << std::endl;

            // Update each entity in the world
            for (Entity *entity : entities_)
            {
                entity->update(); // Call the update method of each entity
                std::cout << "Updated entity at (" << entity->x() << ", " << entity->y() << ")" << std::endl;
            }

            // Simulate physics and rendering
            std::cout << "Processing physics..." << std::endl;
            std::cout << "Rendering frame..." << std::endl;

            std::cout << "--- Frame End ---" << std::endl;

            // Simulate a delay between frames to mimic real-time gameplay
            std::this_thread::sleep_for(std::chrono::microseconds(100000));
        }
    }

private:
    std::vector<Entity *> entities_; // List of entities in the world
};

// The Skeleton class represents a patrolling entity that moves back and forth.
class Skeleton : public Entity
{
public:
    Skeleton() : patrollingLeft_(false) {}

    // Override the update method to implement patrolling behavior
    virtual void update() override
    {
        if (patrollingLeft_)
        {
            setX(x() - 1); // Move left
            if (x() == 0)  // If it reaches the left boundary, change direction
                patrollingLeft_ = false;
        }
        else
        {
            setX(x() + 1);  // Move right
            if (x() == 100) // If it reaches the right boundary, change direction
                patrollingLeft_ = true;
        }
    }

private:
    bool patrollingLeft_; // Tracks the direction of movement
};

// Handling Variable Time Steps
// This class demonstrates how to handle variable time steps for smoother movement.
class VariableTimeSkeleton : public Entity
{
public:
    VariableTimeSkeleton() : patrollingLeft_(false), x_(0.0) {}

    // Update method that takes elapsed time into account
    virtual void update(double elapsed)
    {
        if (patrollingLeft_)
        {
            x_ -= elapsed; // Move left based on elapsed time
            if (x_ <= 0)   // If it reaches the left boundary, change direction
            {
                patrollingLeft_ = false;
                x_ = -x_; // Correct position to stay within bounds
            }
        }
        else
        {
            x_ += elapsed; // Move right based on elapsed time
            if (x_ >= 100) // If it reaches the right boundary, change direction
            {
                patrollingLeft_ = true;
                x_ = 100 - (x_ - 100); // Correct position to stay within bounds
            }
        }
        setX(x_); // Update the base class x_
    }

    double x() const { return x_; } // Override to return the double value

private:
    bool patrollingLeft_; // Tracks the direction of movement
    double x_;            // Position with higher precision
};

// The VariableTimeWorld class manages entities with variable time step updates.
class VariableTimeWorld
{
public:
    // Adds a variable time skeleton to the world
    void addEntity(VariableTimeSkeleton *entity)
    {
        entities_.push_back(entity);
    }

    // The game loop simulates the game running with variable time steps
    void gameLoop()
    {
        auto lastTime = std::chrono::high_resolution_clock::now();
        while (true)
        {
            auto currentTime = std::chrono::high_resolution_clock::now();
            double elapsed = std::chrono::duration<double, std::milli>(currentTime - lastTime).count() / 1000.0; // Convert to seconds
            lastTime = currentTime;

            std::cout << "--- Variable Time Frame Start (" << elapsed << "s) ---" << std::endl;

            // Simulate handling user input
            std::cout << "Handling input..." << std::endl;

            // Update each entity with elapsed time
            for (VariableTimeSkeleton *entity : entities_)
            {
                entity->update(elapsed); // Pass elapsed time to the update method
                std::cout << "Updated entity at (" << entity->x() << ", " << entity->y() << ")" << std::endl;
            }

            // Simulate physics and rendering
            std::cout << "Processing physics..." << std::endl;
            std::cout << "Rendering frame..." << std::endl;

            std::cout << "--- Variable Time Frame End ---" << std::endl;

            // Simulate a delay (optional for variable time step)
            std::this_thread::sleep_for(std::chrono::milliseconds(50));
        }
    }

private:
    std::vector<VariableTimeSkeleton *> entities_; // List of entities in the world
};

// Displays a menu to the user
void showMenu()
{
    std::cout << "** Game Loop Menu **" << std::endl;
    std::cout << "1. Basic Entity Update" << std::endl;
    std::cout << "2. Patrolling Skeleton" << std::endl;
    std::cout << "3. Handling Variable Time Steps" << std::endl;
    std::cout << "Enter your choice: ";
}

int main()
{
    int choice;
    showMenu();
    std::cin >> choice;

    if (choice == 1)
    {
        std::cout << "** Example 1: Basic Entity Update **" << std::endl;
        World basicWorld;
        Skeleton basicSkeleton;
        basicWorld.addEntity(&basicSkeleton);
        basicWorld.gameLoop();
    }
    else if (choice == 2)
    {
        std::cout << "\n** Example 2: Patrolling Skeleton **" << std::endl;
        World patrollingWorld;
        Skeleton patrollingSkeleton;
        patrollingWorld.addEntity(&patrollingSkeleton);
        patrollingWorld.gameLoop();
    }
    else if (choice == 3)
    {
        std::cout << "\n** Example 3: Handling Variable Time Steps **" << std::endl;
        VariableTimeWorld variableTimeWorld;
        VariableTimeSkeleton variableTimeSkeleton;
        variableTimeWorld.addEntity(&variableTimeSkeleton);
        variableTimeWorld.gameLoop();
    }
    else
    {
        std::cout << "Invalid choice. Exiting." << std::endl;
    }

    return 0;
}