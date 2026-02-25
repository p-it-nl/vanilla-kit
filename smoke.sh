#!/bin/sh

# point the node command to the global node_modules location (or your different location)
export NODE_PATH="$(npm root -g)"

# run the tests
node src/tests/smoke/runner.js http://localhost:3000
