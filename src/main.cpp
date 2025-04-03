#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}

// // Moving from C to modern C++, you should consider the following:

// // 1. Prefer smart pointers over raw pointers for memory safety.
// #include <memory>
// void useSmartPointers() {
//     auto ptr = std::make_unique<int>(42); // Unique ownership
//     std::cout << "Smart pointer value: " << *ptr << std::endl;
// }

// // 2. Use standard containers like std::vector instead of raw arrays.
// #include <vector>
// void useStandardContainers() {
//     std::vector<int> numbers = {1, 2, 3, 4, 5};
//     for (int num : numbers) {
//         std::cout << num << " ";
//     }
//     std::cout << std::endl;
// }

// // 3. Use RAII (Resource Acquisition Is Initialization) for resource management.
// #include <fstream>
// void useRAII() {
//     std::ofstream file("example.txt");
//     if (file.is_open()) {
//         file << "RAII ensures the file is closed automatically." << std::endl;
//     }
// }

// // 4. Prefer modern C++ features like range-based for loops and auto.
// void useModernFeatures() {
//     std::vector<int> numbers = {10, 20, 30};
//     for (auto num : numbers) {
//         std::cout << num << " ";
//     }
//     std::cout << std::endl;
// }

// // Call the functions to demonstrate the concepts.
// useSmartPointers();
// useStandardContainers();
// useRAII();
// useModernFeatures();