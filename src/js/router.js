import { routes } from "./routes.js";

/**
 * Router
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
 */
class Router {

    // __data: internal navigation payload, hidden and unique via Symbol to avoid collisions
    static __data = Symbol('navigationData');

    #initialized = false;

    #isDev;
    #fallbackTitle;
    #currentPage;
    #observer;
    #root;

    /**
     * Initialize the router and attach event listeners
     */
    init() {
        this.#isDev = window.__DEV__ || false;
        if (!this.#initialized) {
            this.#initialized = true;

            this.#root = document.getElementById('root');
            this.#fallbackTitle = document.title;

            // Navigation clicks
            document.addEventListener('click', this.#handleClick.bind(this));

            // Browser forward/backward
            window.addEventListener('popstate', () => {
                this.navigate(this.#getCurrentPath(), null, true);
            });

            // Current path on init
            this.#initObserver();
            this.navigate(this.#getCurrentPath(), null, true);
        } else {
            // preventing duplicate initialization
        }
    }

    /**
     * Navigate to a given path
     * @param {string} path the path to navigate to 
     * @param {any} data the data to pass the component that is created
     * @param {boolean} backPressed whether back button of the browser was pressed
     */
    navigate(path, data, backPressed = false) {
        path = path ?? '/';
        const renderPath = this.#normalizePath(path);
        if (this.#currentPage !== renderPath) {
            this.#currentPage = renderPath;

            const { component, title, param } = this.#matchRoute(renderPath) || {};
            this.#render(component, title, param, data);
            this.#setActive(renderPath);

            if (!backPressed) {
                const url = this.#isDev && renderPath !== '/' ? `#${renderPath}` : renderPath;
                history.pushState({ path: renderPath }, '', url);
            }
        } else {
            // current page is requested, preventing duplicate render
        }
    }

    #initObserver() {
        // WARNING! costly! only listen for very specific changes currently listening only for adding of navigate attributes
        this.#observer = new MutationObserver(mutations => {
            for (const m of mutations) {
                if (m.type === 'attributes' && m.attributeName === 'navigate') {
                    this.#processNavigateElement(m.target);
                }
            }
        });

        this.#observer.observe(document.body, {
            subtree: true,
            attributes: true,
            attributeFilter: ['navigate']
        });
    }

    #processNavigateElement(el) {
        const path = el.getAttribute('navigate');
        if (path === this.#currentPage) {
            el.classList.add('active');
        }
    }

    #handleClick(e) {
        const el = e.target.closest('[navigate]');
        if (el) {
            e.preventDefault();
            const data = el[Router.__data];
            const navigationValue = this.#normalizeUrl(el.getAttribute('navigate'));
            this.navigate(navigationValue, data, false);
        }
    }

    #getCurrentPath() {
        return this.#isDev ? location.hash.slice(1) || '/' : location.pathname;
    }

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

        return routes.get('/404');
    }

    #normalizeUrl(url) {
        if (url) {
            const protoIndex = url.indexOf('://');
            if (protoIndex !== -1) {
                const pathStart = url.indexOf('/', protoIndex + 3);
                return pathStart !== -1 ? url.slice(pathStart) : '/';
            }
        }

        return url;
    }

    #trimTrailingSlash(path) {
        return path.length > 1 && path.endsWith('/')
            ? this.#trimTrailingSlash(path.slice(0, -1))
            : path;
    }

    #normalizePath(path = '/') {
        path = this.#trimTrailingSlash(path) || '/';

        if (this.#isDev && path.startsWith('#')) {
            path = path.slice(path.lastIndexOf('#') + 1);
        }

        return path;
    }

    #render(component, title, param, data) {
        if (component) {
            document.title = title ? title.replace('{}', param || '') : this.#fallbackTitle;

            if (customElements.get(component)) {
                const el = document.createElement(component);
                if (data !== undefined) el[Router.__data] = data;
                this.#root.replaceChildren(el);
            } else {
                console.warn(`Component "${component}" not registered`);
            }
        } else {
            console.warn(`Component not provided, validate the routes!`);
        }
    }

    #setActive(path) {
        document.querySelectorAll('[navigate].active').forEach(el => el.classList.remove('active'));
        document.querySelectorAll(`[navigate="${path}"]`).forEach(el => el.classList.add('active'));
    }
}

/** Singleton instance shared across components */
export default new Router();