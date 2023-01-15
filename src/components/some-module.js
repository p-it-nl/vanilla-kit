import html from './some-module.html';
import { SomeFunctionality } from '../js/some-functionality';

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
    connectedCallback() {
        this.innerHTML = html;

        this.sf.logSomething();
    }

    /**
     * YOUR CODE ----
     */
}