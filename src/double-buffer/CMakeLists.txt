# double-buffer pattern CMakeLists.txt
add_executable(double-buffer--game-state double-buffer--game-state.cpp)
add_executable(double-buffer--rendering double-buffer--rendering.cpp)

# Link Raylib to these executables
target_link_libraries(double-buffer--game-state raylib)
target_link_libraries(double-buffer--rendering raylib)
