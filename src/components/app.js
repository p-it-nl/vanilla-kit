import Router from '../js/router.js';

/**
 * The app components consists of the main screen of the website and is registered as the app-root
 */
export default class App extends HTMLElement {

    constructor() {
        super();

        if(window.__DEV__ === true) {
            console.log('DEV mode');
        }
    }

    /** Called when the component has been connected to the DOM */
    async connectedCallback() {
        const res = await fetch('./components/app.html');
        this.innerHTML = await res.text();
        
        new Router().init();
    }


    /**
     * YOUR CODE ----
     */
}