import htmlLoader from '../js/html-loader.js';

/**
 * The not found component
 */
export default class NotFound extends HTMLElement {

    #htmlLoader;

    constructor(loader = htmlLoader) {
        super();

        this.#htmlLoader = loader;
    }

    async connectedCallback() {
        await this.#loadHTML();
    }

    disconnectedCallback() {
        this.#htmlLoader = null;
    }
    
    async #loadHTML() {
        const html = await this.#htmlLoader.load('./components/not-found.html');
        this.innerHTML = html;
    }
}