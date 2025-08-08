# base-ff

Base-ff stands for base front-end framework.
This project is a starter project for front-end applications

## Why this project?

There are many front-end frameworks, from heavy fully loaded frameworks like `angular` and `ember` to smaller frameworks like `react` and `knockout`.
The main reason why all these frameworks exist, is to solve a problem that Javascript, HTML and CSS themselfs, did not offer solutions for.
Since the development of all the frameworks HTLM, CSS and Javascript have come a long way into fixing issues and providing solutions that were not available before.
This significantly decreases the significance of frameworks and provides a way to opt-out of the opiniated framework way of working and often times strict rules.

What is more, no framework is perfect, all frameworks have things they do well and things they do not do well.
For a long time this has been a valuable trade since what the frameworks do well, where drasticly more benificial then the drawbacks they had.

Now with many big issues in Javascript fixed and features like modules (2015), objects (2016-2019), async functions (2018), import (2020), class fields (2021), class static block (2021), and much much more....
The trade-off between framework and plain is not as evident any more.

Another thing to take in consideration is the extreme speed in which Javascript libraries tend to be updated, deprecated and deleted. Adding to the already huge stream of dependencies being put in node_modules every install.
With dependencies being depend on others which in turn frequently break the framework when not upgraded in time, to early or not all at once.

This project takes the stance that at some point in the future, frameworks are out and plain is back in.
Plain, but with those things added that bring usefull functionality when required. 

## What is in the project?

This project offers a basic setup for a front-end applications with all the clutter taken out.
What remains are the essentials that provide benefit without drawbacks and without impeding in working with Javascript, HTLM and CSS that include newer functionality.

### Why .less?

Less is amazing, its small and adds to CSS what it is missing and does so in a way that it does not impede with development practises.
SASS was amazing up to a point where strange decisions where being made that forced the developer in an odd way of working.

The facing out of @import which could be used once, as you would expect, to replace it with @use/@include which causes the developer to continuously look for where some css resides, add a @use from there use @include to use it.
Then try to name it, rename it or figure out what name it has been given to use it agian. Then also the @forward is added and @extend and more... without keeping support for @import alive. There is no global scope anymore...

A tool should make working with something (in this case CSS) easier, not more complicated.

## What is with all the style folders?

The style folders take the (somewhat old fashioned) [SMACCS](http://smacss.com) approach to structuring CSS. 
This has been the most succesful way of working so far. 
The project advises against single-file components and suggest strongly separation of concern.

## How to use this?

Checkout, replace all `replace-with` in the code, replace favicon.ico, npm install/run and happy coding.

The HTML, CSS, Javascript will be optimized and minimized.
The assets (images, fonts etc..) will be encoded and packaged.

## How to run it?

Run a basic static file server (resolve CORS errors):

```
cd /src
python -m http.server 3000
```
Then open: http://localhost:3000

## Compile LESS to CSS

execute: `lessc styles/1.base/base.less styles/base.css` or add a wachter with: lessc --watch styles/1.base/base.less styles/base.css
The watcher keeps running, recompiling whenever you save the .less file.

## Minify / clean the CSS

execute: `cleancss -o dist/base.min.css styles/base.css`

## Build, required to run

execute: `esbuild index.js --bundle --minify --outfile=dist/bundle.min.js`

## Note about experience

For an experienced engineer this project provides everything required, for a more junior engineer the stricter rules of an opiniated framework might be more suited. 
Since strict frameworks allow you to follow dictated steps to achieve something and requires less experience.
