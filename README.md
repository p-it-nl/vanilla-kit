# **VanillaKit**  
*A lightweight, framework-less starter kit — vanilla JS, no node_modules bloat*

**VanillaKit** is a minimal build setup for modern front-end applications — no frameworks, no bloat, just HTML, CSS, and JavaScript with a lean build pipeline.
It’s designed for developers who want the power of modern JS features without the complexity of heavy frameworks or sprawling dependency trees.

---

## 🚀 Why VanillaKit?  

The front-end ecosystem is full of massive frameworks with strict rules and short shelf lives.  
But with modern JavaScript, CSS, and HTML features, many of those problems are already solved natively.  

**VanillaKit** embraces that:  
- Keep what’s useful (bundling, minification, live reload)  
- Ditch what’s not (framework lock-in, massive node_modules)  
- Stay fast, transparent, and easy to tweak  

---

## 🔑 Features  

- **Framework-free** — pure HTML, CSS (LESS), and JS  
- **Two modes** — production (minified) & debug (unminified) builds  
- **Optional hot reload** — without WebSockets or a custom dev server  
- **Minimal dependencies** — only `lessc`, `clean-css-cli`, `esbuild`  
- **Cross-platform** — works on Windows, MacOS, Linux  
- **One HTML source** — auto-switches paths based on build mode  
- **Clean builds** — `/dist` rebuilt from scratch every time  

---

## 📂 Project Structure  

```
src/
  assets/        # Images, fonts, etc.
  components/    # HTML partials / UI fragments
  js/            # Application JavaScript
  styles/        # LESS styles, SMACSS-style structure
  index.html     # Single entry point with template variables

dist/            # Build output
```

---

## 🛠 Installation  

Run the setup script to install dependencies globally:  

```sh
sh install-deps.sh
```

This installs:  
- [LESS](https://lesscss.org/) — CSS preprocessor  
- [clean-css-cli](https://github.com/jakubpawlowicz/clean-css) — Minifies CSS  
- [esbuild](https://esbuild.github.io/) — Bundles & minifies JavaScript  

---

## ⚙️ Building  

**Production build (default)**  
```sh
sh build.sh
```
Outputs minified CSS/JS with assets into `/dist`.  

**Debug build (development)**  
```sh
sh build.sh debug
```
Outputs unminified CSS/JS for easier debugging.  

---

## 🔄 Hot Reload  

For development with auto-refresh:  
```sh
sh watch.sh
```
Then run a simple static server in `/dist`, for example python:  
```sh
cd dist
python -m http.server 3000
```
Open: [http://localhost:3000](http://localhost:3000)  

---

## 🧠 Philosophy  

Frameworks were essential when browsers lacked features, but today:  
- ES modules, async/await, classes, and modern CSS cover most needs  
- Framework dependency churn slows projects down  
- Small, explicit build steps are easier to maintain than giant config files  

VanillaKit is for developers who want:  
- Full control over their stack  
- Minimal tooling  
- No hidden magic  
- Easy deployments anywhere

---

## 🚀 Deployment Made Easy

VanillaKit’s minimal dependencies and straightforward build process mean you don’t need to run `npm install` during your deployment pipelines.  
This makes deployments faster, more reliable, and less prone to breaking due to dependency issues or network problems.
Simply copy the contents of the /dist folder to your web server — no extra setup or installs required. Your app is ready to run immediately.

---

## 🎨 Why LESS?  

LESS adds missing features to CSS (variables, nesting, mixins) without forcing strange conventions or syntax changes.  
It’s powerful, lightweight, and doesn’t get in your way.  

---

## 📐 CSS Structure  

We follow a [SMACSS](http://smacss.com)-inspired folder layout for styles:  
- **Base** — resets, variables, typography  
- **Layout** — grids, wrappers, page sections  
- **Modules** — reusable UI parts  
- **State** — temporary styles (e.g., active, hidden)  
- **Theme** — optional skinning  

We really like SMACSS — it solves many common CSS organization challenges without being overly complicated or rigid. If you want a straightforward way to keep your styles scalable and maintainable, give SMACSS a go!
And hey, if it’s not your thing, just toss the directories and do your own thing — this kit is flexible enough to roll with you.

---

## 📢 Notes for Teams  

For experienced engineers, VanillaKit offers flexibility and speed.  
For juniors, a framework might still be a better choice until they’re more comfortable without enforced patterns.

---

## 📄 License  
MIT — do what you want, but don’t blame us if it breaks.