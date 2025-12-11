import { Handler } from './handler.js';

/**
 * HandlerDate
 *
 * Handles two-way binding for <input type="date"> elements.
 */
export class HandlerDate extends Handler {

    /**
     * @param {Binder} binder - The Binder instance managing this element
     * @param {HTMLInputElement} element - The <input type="date"> element to bind
     * @param {string} key - The key in the Binder's data object this element is bound to
     */
    constructor(binder, element, key) {
        super();
        this.binder = binder;
        this.el = element;
        this.key = key;

        element.addEventListener('blur', () => {
            const value = new Date(element.value);
            this.binder.updateData({ [this.key]: value });
        });
    }

    /**
     * @see Handler.ifFor()
     */
    static ifFor(el) {
        return el.type === 'date';
    }

    /**
     * @see Handler.render()
     * @param {Date|string|null} value - The value from the Binder data
     */
    render(value) {
        if (this.binder.isNotSet(value)) {
            this.el.classList.add('not-set');
        } else {
            this.el.classList.remove('not-set');
        }

        this.el.value = value;
    }
}