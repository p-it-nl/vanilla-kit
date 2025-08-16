import { SomeFunctionality } from '../js/some-functionality.js';

/**
 * Home module
 */
export default class Home extends HTMLElement {

    sf;

    constructor() {
        super();

        this.sf = new SomeFunctionality();
    }

    /** Called when the component has been connected to the DOM */
    async connectedCallback() {
        const res = await fetch('./components/home.html');
        this.innerHTML = await res.text();

        this.sf.logSomething();
    }

    /**
     * YOUR CODE ----
     */
}