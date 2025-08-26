import { SomeFunctionality } from '../js/some-functionality.js';
import Binder from '../js/binder.js';
import HtmlHelper from '../js/html-helper.js';

/**
 * Home module
 */
export default class Home extends HTMLElement {

    sf;
    #binder;

    constructor() {
        super();

        this.sf = new SomeFunctionality();
        this.#binder = new Binder(this, {});
    }

    /** Called when the component has been connected to the DOM */
    async connectedCallback() {
        const res = await fetch('./components/home.html');
        this.innerHTML = await res.text();

        this.sf.logSomething();
        this.#binder.setData({ valueOne: 'an input text', valueTwo: 'double click here!', valueThree: 'double click here!' });
        this.#binder.bind();

        const els = this.querySelectorAll('[contenteditable], [not-editing]');
        for (const el of els) {
            HtmlHelper.makeEditable(el);
        }
    }

    /**
     * YOUR CODE ----
     */
}