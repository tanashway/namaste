#!/bin/bash

# Log the start of the build process
echo "Starting Coolify build process..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Explicitly install the Weld package
echo "Explicitly installing @ada-anvil/weld package..."
npm install @ada-anvil/weld@0.5.0 --save-exact

# Build the project
echo "Building the project..."
CI=false npm run build

echo "Build process completed successfully!" 