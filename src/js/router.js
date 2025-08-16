import { routes } from "./routes.js";

/**
 * Router
 * 
 * Automatically allows navigation from elements having the `navigate` attribute.
 * e.g.: <button navigate="/home"></button> will automatically allow navigating to the home page
 * 
 * Features:
 * - Hash-based routing in dev, path-based in other environments.
 * - Wildcard support for trailing route parameters (currently: single segment only).
 * - Prevents double initialization.
 * - Click delegation for elements with the `navigate` attribute.
 * - Updates document.title based on route.
 * - Renders registered custom elements into the root container.
 * 
 * Future improvements:
 * - Multi-segment wildcard support (currently only trailing single segment).
 * - Optional click debounce or dataset marking for large clickable lists.
 * - Support multiple `{}` placeholders in title templates.
 * - Optional nested route parameters for more complex paths.
 * - Add unit tests
 */
export default class Router {

    #navigateAttr = 'navigate';
    #notFound = '/404';
    #rootId = 'root';
    #initialized = false;

    #isDev;
    #fallbackTitle;
    #currentPage;
    #root;

    /**
     * Initialize the router and attach event listeners
     */
    init() {
        this.#isDev = window.__DEV__ || false;
        if (!this.#initialized) {
            this.#initialized = true;

            this.#root = document.getElementById(this.#rootId);
            this.#fallbackTitle = document.title;

            // Navigation clicks
            document.addEventListener('click', this.#handleClick.bind(this));

            // Browser forward/backward
            window.addEventListener(this.#isDev ? 'hashchange' : 'popstate', () => {
                this.navigate(this.#getCurrentPath(), true);
            });

            // Current path on init
            this.navigate(this.#getCurrentPath(), true);
        } else {
            // preventing duplicate initialization
        }
    }

    /**
     * Navigate to a given path
     * @param {string} path 
     * @param {boolean} backPressed 
     */
    navigate(path, backPressed = false) {
        const renderPath = this.#normalizePath(path);
        if (this.#currentPage !== renderPath) {
            this.#currentPage = renderPath;

            const { component, title, param } = this.#matchRoute(renderPath) || {};
            this.#render(component, title, param);

            if (!backPressed) {
                const url = this.#isDev && renderPath !== '/' ? `#${renderPath}` : renderPath;
                history.pushState({}, '', url);
            }
        } else {
            // current page is requested, preventing duplicate render
        }
    }

    /**
     * Handle click events on elements with the `navigate` attribute.
     * Prevents default link behavior and triggers navigation.
     * @param {MouseEvent} e - The click event.
     */
    #handleClick(e) {
        const el = e.target.closest(`[${this.#navigateAttr}]`);
        if (el) {
            e.preventDefault();
            this.navigate(el.getAttribute(this.#navigateAttr));
        }
    }

    /**
     * Get the current path depending on dev/prod mode
     */
    #getCurrentPath() {
        return this.#isDev ? location.hash.slice(1) || '/' : location.pathname;
    }

    /**
     * Match a path to the defined routes, support wildcards
     * @param {string} path 
     * @returns {object} { component, title, param }
     */
    #matchRoute(path) {
        if (routes.has(path)) {
            return routes.get(path);
        }

        for (const [pattern, data] of routes) {
            if (pattern.includes('*')) {
                const base = pattern.split('*')[0];
                if (path.startsWith(base)) {
                    const param = path.slice(base.length) || null;
                    return { ...data, param };
                }
            }
        }

        return routes.get(this.#notFound);
    }

    /**
     * Normalize path (remove trailing slashes, hash in dev)
     * @param {string} path 
     * @returns {string}
     */
    #normalizePath(path = '/') {
        path = path.replace(/\/+$/, '') || '/';
        if (this.#isDev) {
            path = path.replace(/^#+/, '').replace(/^#/, '');
        }
        return path;
    }

    /**
     * Render the given component inside the root element
     * @param {string} component 
     * @param {string} title 
     * @param {string} param 
     */
    #render(component, title, param) {
        if (component) {
            document.title = title ? title.replace('{}', param || '') : this.#fallbackTitle;

            if (customElements.get(component)) {
                this.#root.replaceChildren(document.createElement(component));
            } else {
                console.warn(`Component "${component}" not registered`);
            }
        } else {
            console.warn(`Component not provided, validate the routes!`);
        }
    }
}