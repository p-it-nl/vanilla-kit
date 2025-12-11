import App from './components/app.js';
import Home from './components/home.js';
import NotFound from './components/not-found.js';
import OtherPage from './components/other-page.js';

const app = async () => {
  initialiseComponents();
};

function initialiseComponents() {
  customElements.define('app-home', Home);
  customElements.define('app-other-page', OtherPage);
  customElements.define('app-not-found', NotFound);
  customElements.define('app-root', App);
}

document.addEventListener("DOMContentLoaded", app);