#!/bin/sh

set -e

echo "Installing build tool dependencies globally..."

npm install -g less
# TODO: Decide whether to stay on clean-css-cli 
npm install -g clean-css-cli
npm install -g esbuild

echo 
echo "---"

echo "All dependencies installed globally."
echo "You can now run your build script."