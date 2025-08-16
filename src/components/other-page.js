import { SomeFunctionality } from '../js/some-functionality.js';

/**
 * Other page module
 */
export default class OtherPage extends HTMLElement {

    sf;

    constructor() {
        super();

        this.sf = new SomeFunctionality();
    }

    /** Called when the component has been connected to the DOM */
    async connectedCallback() {
        const res = await fetch('./components/other-page.html');
        this.innerHTML = await res.text();

        this.sf.logSomething();
    }

    /**
     * YOUR CODE ----
     */
}