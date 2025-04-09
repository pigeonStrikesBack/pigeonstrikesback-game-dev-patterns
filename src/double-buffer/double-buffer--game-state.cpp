#include <iostream>
#include <vector>
#include <chrono>
#include <thread>

// --- Example 2: Double Buffer for Game State Update ---

// The Actor class represents an entity in the game that can interact with another actor.
class Actor
{
public:
    Actor(int id) : id_(id), currentSlapped_(false), nextSlapped_(false) {}
    virtual ~Actor() {}

    // Updates the actor's state
    // This method simulates the actor's behavior, where it may "slap" another actor with a 50% chance.
    void update()
    {
        // Example logic: every actor slaps its otherActor_ with a 50% chance
        if (rand() % 5 != 0) // Randomly decide to slap
        {
            otherActor_->nextSlapped_ = true;
            std::cout << "Actor " << id_ << " tries to slap Actor " << otherActor_->id_ << std::endl;
        }
    }
    
    // Swaps the state from "next" to "current"
    // This method transitions the "next" state to the "current" state and resets the "next" state.
    void swapState()
    {
        currentSlapped_ = nextSlapped_;
        nextSlapped_ = false; // Reset the next buffer for the next frame
        if (currentSlapped_)
        {
            std::cout << "Actor " << id_ << " was slapped!" << std::endl;
        }
    }
    
    // Sets the other actor for interaction
    // This method establishes a relationship between two actors.
    void setOtherActor(Actor *other)
    {
        otherActor_ = other;
    }

    // Returns the actor's ID
    int getId() const
    {
        return this->id_;
    }

    // Checks if the actor was slapped in the current state
    bool wasSlapped() const
    {
        return currentSlapped_;
    }

private:
    int id_;                  // Actor's ID
    bool currentSlapped_;     // Current state
    bool nextSlapped_;        // Next state
    Actor *otherActor_ = nullptr; // Pointer to the other actor
};

// The Stage class represents the game stage where actors interact.
class Stage
{
public:
    Stage()
    {
        // Initialize actors and set their relationships
        actors_.emplace_back(0);
        actors_.emplace_back(1);

        actors_[0].setOtherActor(&actors_[1]);
        actors_[1].setOtherActor(&actors_[0]);
    }

    // Runs the game loop
    // This method simulates the game loop, where actors update their states and swap buffers.
    void gameLoop()
    {
        for (int i = 0; i < 3; ++i)
        {
            std::cout << "--- Frame " << i + 1 << " ---" << std::endl;

            // Update phase: actors act and potentially change the "next" state
            for (Actor &actor : actors_)
            {
                actor.update();
            }

            // Swap phase: "next" state becomes "current" state simultaneously
            for (Actor &actor : actors_)
            {
                actor.swapState();
            }

            // Rendering or other logic uses the "current" state
            for (const Actor &actor : actors_)
            {
                std::cout << "Actor " << actor.getId() << " was slapped: " << (actor.wasSlapped() ? "True" : "False") << std::endl;
            }
        }
    }

private:
    std::vector<Actor> actors_; // List of actors in the stage
};

int main()
{
    // --- Example: Double Buffer for Game State Update ---
    // This is the entry point of the program, where the game stage is created and the game loop is executed.
    std::cout << "\n--- example: Double Buffer for Game State update ---" << std::endl;
    Stage gameStage;
    gameStage.gameLoop();

    return 0;
}
