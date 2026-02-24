import appRouter from '../js/router.js';

/**
 * The app components consists of the main screen of the website and is registered as the app-root
 */
export default class App extends HTMLElement {

    #router;

    constructor(router = appRouter) {
        super();
        this.#router = router;

        if (window.__DEV__ === true) {
            console.log('DEV mode');
        }
    }

    async connectedCallback() {
        this.#router.init();
    }
}