#!/bin/sh

# Exit on error
set -e

echo "Installing build tool dependencies globally..."

# Install LESS
npm install -g less

# Install CleanCSS CLI
npm install -g clean-css-cli

# Install esbuild
npm install -g esbuild

# Print new line for readability
echo 
echo "---"

echo "All dependencies installed globally."
echo "You can now run your build script."