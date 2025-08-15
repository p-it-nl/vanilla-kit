import { SomeFunctionality } from '../js/some-functionality.js';

/**
 * Some module
 */
export default class SomeModule extends HTMLElement {

    sf;

    constructor() {
        super();

        this.sf = new SomeFunctionality();
    }

    /** Called when the component has been connected to the DOM */
    async connectedCallback() {
        const res = await fetch('./components/some-module.html');
        this.innerHTML = await res.text();

        this.sf.logSomething();
    }

    /**
     * YOUR CODE ----
     */
}