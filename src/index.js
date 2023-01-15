import App from './components/app.js';
import SomeModule from './components/some-module.js';

const app = async () => {
  initialiseComponents();
};

function initialiseComponents() {
  customElements.define('app-some-module', SomeModule);
  customElements.define('app-root', App);
}

document.addEventListener("DOMContentLoaded", app);