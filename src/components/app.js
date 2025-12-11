import appRouter from '../js/router.js';
import htmlLoader from '../js/html-loader.js';

/**
 * The app components consists of the main screen of the website and is registered as the app-root
 */
export default class App extends HTMLElement {

    #htmlLoader;
    #router;

    constructor(loader = htmlLoader, router = appRouter) {
        super();
        this.#htmlLoader = loader;
        this.#router = router;

        if (window.__DEV__ === true) {
            console.log('DEV mode');
        }
    }

    /** Called when the component has been connected to the DOM */
    async connectedCallback() {
        await this.#loadHTML();
    }

    async #loadHTML() {
        const html = await this.#htmlLoader.load('./components/app.html');
        this.innerHTML = html;

        this.#router.init();
    }

    /**
     * YOUR CODE ----
     */
}