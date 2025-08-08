#!/bin/sh

# Exit immediately if a command fails
set -e

mode=${1:-prod} # default to prod

echo "Validating dependencies..."
command -v lessc >/dev/null 2>&1 || { echo >&2 "lessc is not installed. Aborting."; exit 1; }
command -v cleancss >/dev/null 2>&1 || { echo >&2 "cleancss is not installed. Aborting."; exit 1; }
command -v esbuild >/dev/null 2>&1 || { echo >&2 "esbuild is not installed. Aborting."; exit 1; }

echo "Starting build..."

# Clean dist/
mkdir -p dist
rm -rf dist/*
echo "Cleaned dist directory."

# Copy assets
cp -r src/assets/ dist/assets/
cp src/favicon.ico dist/favicon.ico
echo "Assets copied."

if [ "$mode" = "prod" ]; then
    echo "Adjusting for PRODUCTION build..."

    # Compile LESS and minify CSS in one step
    lessc src/styles/1.base/base.less | cleancss -o dist/base.min.css
    echo "LESS compiled and CSS minified."

    # Bundle & minify JS
    esbuild src/index.js --bundle --minify --outfile=dist/bundle.min.js
    echo "JavaScript bundled and minified."

    # Copy HTML
    sed "s|{{CSS_PATH}}|./base.min.css|; s|{{JS_PATH}}|./bundle.min.js|; s|{{LIVE_RELOAD_SCRIPT}}||" src/index.html > dist/index.html
    echo "HTML copied."

    # Copy components
    mkdir -p dist/components
    cp src/components/*.html dist/components
    echo "Components copied."
elif [ "$mode" = "debug" ]; then
    echo "Adjusting for DEBUG build..."
    
    # Compile LESS and minify CSS in one step
    lessc src/styles/1.base/base.less > dist/base.css
    echo "LESS compiled and CSS minified."

    # Copy JS
    cp src/index.js dist/index.js
    cp -r src/js dist/js
    echo "JavaScript copied"

    # Copy HTML
    sed "s|{{CSS_PATH}}|./base.css|; s|{{JS_PATH}}|./index.js|; s|{{LIVE_RELOAD_SCRIPT}}|<script type=\"module\" src=\"./livereload.js\"></script>|" src/index.html > dist/index.html
    echo "HTML copied."

    # Copy components
    cp -r src/components/ dist/components
    echo "Components copied."

    # Copy livereload script
    cp -r src/livereload.js dist/livereload.js
    echo "Livereload script copied."
fi

date +%s > dist/.lastbuild

echo
echo "Build complete. Output available in /dist"