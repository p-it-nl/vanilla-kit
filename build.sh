#!/bin/sh

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

if [ "$mode" = "prod" ] || [ "$mode" = "acc" ]; then
    echo "Adjusting for ${mode^^} optimized build..."

    # Compile LESS and minify CSS
    lessc src/styles/1.base/base.less | cleancss -o dist/base.min.css
    echo "LESS compiled and CSS minified."

    # Bundle & minify JS
    esbuild src/index.js --bundle --minify --drop:console --outfile=dist/bundle.min.js
    echo "JavaScript bundled and minified."

    # Copy HTML
    sed "\
        s|{{CSS_PATH}}|/base.min.css|; \
        s|{{JS_PATH}}|/bundle.min.js|; \
        s|{{LIVE_RELOAD_SCRIPT}}||; \
        s|{{DEV_MODE_SCRIPT}}||" \
        src/index.html > dist/index.html
    echo "HTML copied."

    # Copy components
    mkdir -p dist/components
    cp src/components/*.html dist/components
    echo "Components copied."
else
    echo "Adjusting for ${mode^^} unoptimized build..."
    
    # Compile LESS
    lessc src/styles/1.base/base.less > dist/base.css
    echo "LESS compiled"

    # Copy JS
    cp src/index.js dist/index.js
    cp -r src/js dist/js
    echo "JavaScript copied"

    # Copy HTML
    sed "\
        s|{{CSS_PATH}}|/base.css|; \
        s|{{JS_PATH}}|/index.js|; \
        s|{{LIVE_RELOAD_SCRIPT}}|<script type=\"module\" src=\"./livereload.js\"></script>|; \
        s|{{DEV_MODE_SCRIPT}}|<script>window.__DEV__ = true;</script>|" \
    src/index.html > dist/index.html
    echo "HTML copied."

    # Copy components
    cp -r src/components/ dist/components
    echo "Components copied."

    if [ "$mode" = "local" ]; then
        # Copy livereload script
        cp -r src/livereload.js dist/livereload.js
        echo "Livereload script copied."
    fi
fi

# Reset configuration to LOCAL for non-local builds
if [ "$mode" != "local" ]; then
    cp "src/js/configuration/configuration-local.js" "src/js/configuration.js"
    echo "Reset configuration to LOCAL after build"
fi

date +%s > dist/.lastbuild

echo
echo "Build complete. Output available in /dist"