
/**
 * The app components consists of the main screen of the website and is registered as the app-root
 */
export default class App extends HTMLElement {

    constructor() {
        super();
    }

    /** Called when the component has been connected to the DOM */
    async connectedCallback() {
        const res = await fetch('./components/app.html');
        this.innerHTML = await res.text();
    }


    /**
     * YOUR CODE ----
     */
}