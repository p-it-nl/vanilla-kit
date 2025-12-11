import { SomeFunctionality } from '../js/some-functionality.js';
import htmlLoader from '../../js/html-loader.js';

/**
 * Other page module
 */
export default class OtherPage extends HTMLElement {

    sf;
    #htmlLoader;

    constructor(loader = htmlLoader) {
        super();

        this.#htmlLoader = loader;
        this.sf = new SomeFunctionality();
    }

    /** Called when the component has been connected to the DOM */
    async connectedCallback() {
        await this.#loadHTML();

        this.sf.logSomething();
    }

    disconnectedCallback() {
        this.#htmlLoader = null;
    }

    async #loadHTML() {
        const html = await this.#htmlLoader.load('./components/other-page.html');
        this.innerHTML = html;
    }

    /**
     * YOUR CODE ----
     */
}