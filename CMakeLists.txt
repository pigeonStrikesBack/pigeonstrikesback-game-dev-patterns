cmake_minimum_required(VERSION 3.10)

# Define project
project(GameProgrammingPatterns CXX)

# Set the C++ standard
set(CMAKE_CXX_STANDARD 14)

# Set output directories for all executables and libraries
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin)

# Add the src directory containing pattern implementations
add_subdirectory(src)

# Find and include Raylib
# find_package(raylib REQUIRED)
