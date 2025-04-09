#include <iostream>
#include <vector>
#include <chrono>
#include <thread>

/**
 * @class Framebuffer
 * @brief Represents a simple framebuffer for graphical rendering.
 * 
 * The framebuffer is a 2D grid of pixels represented as a 1D vector.
 * It provides methods to clear the buffer, draw pixels, and present the buffer to the console.
 */
class Framebuffer
{
public:
    static const int WIDTH = 20;  // Width of the framebuffer
    static const int HEIGHT = 10; // Height of the framebuffer
    std::vector<char> pixels;     // Stores pixel data

    /**
     * @brief Constructor initializes the framebuffer with '.' characters.
     */
    Framebuffer() : pixels(WIDTH * HEIGHT, '.') {}

    /**
     * @brief Clears the framebuffer by resetting all pixels to '.'.
     */
    void clear()
    {
        for (char &pixel : pixels)
        {
            pixel = '.';
        }
    }

    /**
     * @brief Draws a pixel at the specified (x, y) position.
     * 
     * @param x The x-coordinate of the pixel.
     * @param y The y-coordinate of the pixel.
     * @param pixel The character to draw at the specified position.
     */
    void draw(int x, int y, char pixel)
    {
        if (x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT)
        {
            pixels[y * WIDTH + x] = pixel;
        }
    }

    /**
     * @brief Presents the framebuffer content to the console.
     * 
     * Displays the 2D grid of pixels row by row, followed by a separator line.
     */
    void present() const
    {
        for (int y = 0; y < HEIGHT; ++y)
        {
            for (int x = 0; x < WIDTH; ++x)
            {
                std::cout << pixels[y * WIDTH + x];
            }
            std::cout << std::endl;
        }
        std::cout << "---" << std::endl;
    }
};

/**
 * @class DoubleBufferedRenderer
 * @brief Implements a double-buffered rendering system.
 * 
 * This class uses two framebuffers to alternate between drawing and presenting frames.
 * It ensures smooth rendering by avoiding tearing or flickering.
 */
class DoubleBufferedRenderer
{
public:
    /**
     * @brief Constructor initializes the double-buffered renderer.
     */
    DoubleBufferedRenderer() {}

    /**
     * @brief Draws a frame using the next buffer.
     * 
     * This method simulates drawing operations by updating the next buffer
     * and then swapping it with the current buffer.
     */
    void drawFrame()
    {
        // Clear the next buffer
        nextBuffer_->clear();

        // Draw some example shapes
        nextBuffer_->draw(2, 2, 'O'); // Draw a circle at (2, 2)
        nextBuffer_->draw(5, 5, 'X'); // Draw an X at (5, 5)
        nextBuffer_->draw(8, 2, 'O'); // Draw another circle at (8, 2)

        // Simulate complex drawing operations with delays
        std::this_thread::sleep_for(std::chrono::milliseconds(50));
        nextBuffer_->draw(3, 3, '*'); // Draw a star at (3, 3)
        std::this_thread::sleep_for(std::chrono::milliseconds(50));
        nextBuffer_->draw(7, 3, '*'); // Draw another star at (7, 3)

        // Swap the buffers (atomic operation conceptually)
        swapBuffers();
    }

    /**
     * @brief Returns the current buffer for rendering.
     * 
     * @return A reference to the current framebuffer.
     */
    const Framebuffer &getCurrentBuffer() const
    {
        return *currentBuffer_;
    }

private:
    /**
     * @brief Swaps the current and next buffers.
     * 
     * This method alternates the roles of the two buffers.
     */
    void swapBuffers()
    {
        Framebuffer *temp = currentBuffer_;
        currentBuffer_ = nextBuffer_;
        nextBuffer_ = temp;
    }

    Framebuffer buffers_[2];         // Two buffers for double buffering
    Framebuffer *currentBuffer_ = &buffers_[0]; // Pointer to the current buffer
    Framebuffer *nextBuffer_ = &buffers_[1];    // Pointer to the next buffer
};

int main()
{
    std::cout << "--- example: Double Buffer for Graphical Rendering ---" << std::endl;

    // Create a double-buffered renderer
    DoubleBufferedRenderer renderer;

    // Render 5 frames
    for (int i = 0; i < 5; ++i)
    {
        renderer.drawFrame(); // Draw the next frame
        renderer.getCurrentBuffer().present(); // Present the current buffer
        std::this_thread::sleep_for(std::chrono::milliseconds(200)); // Delay between frames
    }

    return 0;
}
