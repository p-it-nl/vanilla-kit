import { SomeFunctionality } from '../js/some-functionality.js';

/**
 * The contact form component contains a form with form validation to enable sending a contact request.
 */
export default class ContactForm extends HTMLElement {

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