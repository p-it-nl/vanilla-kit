import Binder from '../js/binder.js';
import HtmlHelper from '../js/html-helper.js';
import htmlLoader from '../../js/html-loader.js';

/**
 * Home module
 */
export default class Home extends HTMLElement {

    #binder;
    #htmlLoader;

    constructor(loader = htmlLoader) {
        super();

        this.#binder = new Binder(this, {});
        this.#htmlLoader = loader;
    }

    /** Called when the component has been connected to the DOM */
    async connectedCallback() {
        await this.#loadHTML();

        this.#binder.setData({ valueOne: 'an input text', valueTwo: 'double click here!', valueThree: 'double click here!' });
        this.#binder.bind();

        const els = this.querySelectorAll('[contenteditable], [not-editing]');
        for (const el of els) {
            HtmlHelper.makeEditable(el);
        }
    }

    disconnectedCallback() {
        if (this.#binder) {
            this.#binder.destroy?.();
            this.#binder = null;
        }

        HtmlHelper.stopEditing();
        this.#htmlLoader = null;
    }

    async #loadHTML() {
        const html = await this.#htmlLoader.load('./components/not-found.html');
        this.innerHTML = html;
    }

    /**
     * YOUR CODE ----
     */
}