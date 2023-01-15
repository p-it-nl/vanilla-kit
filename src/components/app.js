import html from './app.html';
import '../styles/1.base/base.less';

/**
 * The app components consists of the main screen of the website and is registered as the app-root
 */
export default class App extends HTMLElement {

    constructor() {
        super();
    }

    /** Called when the component has been connected to the DOM */
    connectedCallback() {
        this.innerHTML = html;
    }


    /**
     * YOUR CODE ----
     */
}