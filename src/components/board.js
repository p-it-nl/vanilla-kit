import htmlLoader from '../js/html-loader.js';

/**
 * Board module
 */
export default class Board extends HTMLElement {

    #htmlLoader;
    #draggedElement;
    #indicator;

    constructor(loader = htmlLoader) {
        super();

        this.#htmlLoader = loader;
    }

    async connectedCallback() {
        await this.#loadHTML();

        const columns = this.querySelectorAll('.column');
        columns.forEach((column) => {
            column.ondrop = this.dropHandler.bind(this);
            column.ondragover = this.dragoverHandler.bind(this);
        });

        const items = this.querySelectorAll('.item');
        items.forEach((item) => {
            item.draggable = true;
            item.ondragstart = this.dragstartHandler.bind(this);
            item.ondragend = this.dragendHandler.bind(this);
        });

        this.#indicator = document.createElement('div');
        this.#indicator.className = 'drop-indicator';
    }

    dragstartHandler(ev) {
        this.#draggedElement = ev.currentTarget;
    }

    dragoverHandler(ev) {
        ev.preventDefault();

        const column = ev.currentTarget;
        const itemsHolder = column.querySelector('.items');
        const dragged = this.#draggedElement;

        if (dragged && itemsHolder) {
            const item = ev.target.closest('.item');

            if (!item || item === dragged) {
                itemsHolder.appendChild(this.#indicator);
                return;
            }

            const rect = item.getBoundingClientRect();
            const insertAfter = ev.clientY > rect.top + rect.height / 2;

            if (insertAfter) {
                itemsHolder.insertBefore(this.#indicator, item.nextSibling);
            } else {
                itemsHolder.insertBefore(this.#indicator, item);
            }
        }
    }

    dropHandler(ev) {
        ev.preventDefault();

        const column = ev.currentTarget;
        const itemsHolder = column.querySelector('.items');
        const dragged = this.#draggedElement;
        if (!dragged || !itemsHolder) return;

        if (this.#indicator.parentNode === itemsHolder) {
            itemsHolder.insertBefore(dragged, this.#indicator);
        } else {
            itemsHolder.appendChild(dragged);
        }

        this.#indicator.remove();
        this.#draggedElement = null;
    }

    dragendHandler() {
        this.#indicator.remove();
        this.#draggedElement = null;
    }

    disconnectedCallback() {
        this.#htmlLoader = null;
    }

    async #loadHTML() {
        const html = await this.#htmlLoader.load('./components/board.html');
        this.innerHTML = html;
    }
}