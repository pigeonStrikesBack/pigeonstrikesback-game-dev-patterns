#include <iostream>
#include <chrono>
#include <thread>

// Helper function to get current time in milliseconds
double getCurrentTime() {
    return std::chrono::duration<double, std::milli>(
        std::chrono::high_resolution_clock::now().time_since_epoch()
    ).count();
}

// Dummy implementations for game functions
void processInput() {
    std::cout << "[Input] Processing input...\n";
}

void update(double deltaTime) {
    std::cout << "[Update] Updating game state with deltaTime: " << deltaTime << " seconds\n";
}

void render() {
    // Simulate a heavy rendering workload with a delay
    std::this_thread::sleep_for(std::chrono::milliseconds(50)); // 50ms delay
    std::cout << "[Render] Rendering frame...\n";
}

// --- 1. Run, run as fast as you can ---
void basicGameLoop() {
    std::cout << "\n--- Basic Game Loop ---\n";
    int frames = 0;
    while (frames++ < 5) { // Reduced to 5 frames for brevity
        std::cout << "[Frame " << frames << "]\n";
        processInput();
        update(0.0);
        render();
    }
    std::cout << "Finished Basic Game Loop.\n";
}

// --- 2. Take a little nap ---
void fixedTimeStepWithSleep(int fps) {
    std::cout << "\n--- Fixed Time Step with Sleep ---\n";
    double msPerFrame = 1000.0 / fps;
    int frames = 0;
    while (frames++ < 5) { // Reduced to 5 frames for brevity
        double start = getCurrentTime();
        std::cout << "[Frame " << frames << "]\n";
        processInput();
        update(msPerFrame / 1000.0);
        render();
        double elapsed = getCurrentTime() - start;
        if (elapsed < msPerFrame) {
            std::this_thread::sleep_for(std::chrono::milliseconds(static_cast<long long>(msPerFrame - elapsed)));
        }
    }
    std::cout << "Finished Fixed Time Step with Sleep.\n";
}

// --- 3. One small step, one giant step ---
void variableTimeStep() {
    std::cout << "\n--- Variable Time Step ---\n";
    double lastTime = getCurrentTime();
    int frames = 0;
    while (frames++ < 5) { // Reduced to 5 frames for brevity
        double current = getCurrentTime();
        double elapsed = current - lastTime;
        std::cout << "[Frame " << frames << "]\n";
        processInput();
        update(elapsed / 1000.0);
        render();
        lastTime = current;
    }
    std::cout << "Finished Variable Time Step.\n";
}

// --- 4. Fixed update time step, variable rendering ---
void fixedUpdateTimeStepVariableRendering(int updateRate) {
    std::cout << "\n--- Fixed Update Time Step, Variable Rendering ---\n";
    double previous = getCurrentTime();
    double lag = 0.0;
    double msPerUpdate = 1000.0 / updateRate;
    int frames = 0;
    while (frames++ < 5) { // Reduced to 5 frames for brevity
        double current = getCurrentTime();
        double elapsed = current - previous;
        previous = current;
        lag += elapsed;

        std::cout << "[Frame " << frames << "]\n";
        processInput();
        while (lag >= msPerUpdate) {
            update(msPerUpdate / 1000.0);
            lag -= msPerUpdate;
        }
        render();
    }
    std::cout << "Finished Fixed Update Time Step, Variable Rendering.\n";
}

int main() {
    std::cout << "Demonstrating Game Loop Patterns:\n";
    basicGameLoop();
    fixedTimeStepWithSleep(60);
    variableTimeStep();
    fixedUpdateTimeStepVariableRendering(60);
    return 0;
}
