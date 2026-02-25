# Upgrades

In this document some optional upgrades to the framework can be found and how you can add them.
More often then not you are not going to need those and we really do not want to infer on your freedom to pick what you like for what you need.

The sections below describe suggestions you can use to upgrade your own stack to meet your own requirements.

## Add Selenium for e2e-, smoke-, integration testing

One of the easiest ways to start adding a new layer of tests to your application is to use Selenium.
To add selenium to the project, add the following line to `install-deps.sh`:
    `npm install (optional: -g) selenium-webdriver`

Then make a folder somewhere in your working directory and add your selenium tests there.

To run the tests point the `NODE_PATH` to the location Selenium has been installed, incase of global install use `export NODE_PATH="$(npm root -g)"`.

After that you can run the tests with:
`node {path to your folder}/{filename}.js`

Run `./smoke.sh` to see the smoke test in action for this project

## Use VanillaKit in JavaFX webview (with hot reloading)

TODO: Explain