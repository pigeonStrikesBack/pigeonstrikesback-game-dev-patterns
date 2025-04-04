#!/bin/bash

BIN_DIR='../bin' 
SRC_DIR='.'

# Iterate over all .cpp files in the current directory
for file in $SRC_DIR/*.cpp; do
    # Extract the base name (without extension)
    base_name="${file%.cpp}"
    
    # Create bin directory
    mkdir -p $BIN_DIR

    # Compile the .cpp file into an .app file
    g++ "$file" -o "$BIN_DIR/${base_name}.app"
    
    # Make the .app file executable
    chmod +x "$BIN_DIR/${base_name}.app"
    
    echo "Compiled and made executable: ${base_name}.app"
done