import { Handler } from './handler.js';

/**
 * HandlerCheckbox
 *
 * Handles two-way binding for checkbox elements using <template> structures.
 */
export class HandlerCheck extends Handler {

    #options;
    #current;
    #isCheckbox;
    #binder;
    #el;
    #inputGroupName;

    /**
     * @param {Binder} binder - The Binder instance managing this element
     * @param {HTMLElement} element - The container element with <template>
     */
    constructor(binder, element) {
        super();
        this.#binder = binder;
        this.#el = element;
    }

    /**
     * @see Handler.ifFor()
     */
    static ifFor(el) {
        return el.classList.contains('check-options');
    }

    /**
     * @see Handler.render()
     * @param {Array<Object>} value - Array of option objects
     */
    async render(value) {
        this.#options = value || this.#options;
        const template = this.#el.parentElement.querySelector('template');
        const data = this.#binder.getData();
        if (data && this.#options) {
            this.#current = Array.isArray(data.value) ? [...data.value] : [];
            this.#isCheckbox = data.isCheckbox ?? false;
            this.#inputGroupName = data.label;
            if (this.#binder.isNotSet(this.current)) {
                this.#el.classList.add('not-set');
            } else {
                this.#el.classList.remove('not-set');
            }

            this.#renderCheckboxes(this.#el, template, this.#options);
        }
    }

    #renderCheckboxes(el, template, items) {
        el.textContent = '';
        for (const optionEntry of items) {
            const option = this.#renderCheckbox(optionEntry, template);
            this.#addEvent(option, optionEntry);
            el.appendChild(option);
        }
    }

    #renderCheckbox(item, template) {
        const clone = template.content.cloneNode(true);
        for (const child of clone.querySelectorAll('[bind]')) {
            const key = child.getAttribute('bind');
            child.removeAttribute('bind');
            if (['checkbox', 'radio'].includes(child.type)) {
                child.checked = this.#current.some(entry => entry.url === item.url);
                child.name = this.#inputGroupName;
            } else {
                child.textContent = item[key] ?? '';
            }
        }
        return clone;
    }

    #addEvent(option, optionEntry) {
        const checkbox = option.firstElementChild;
        checkbox.addEventListener('change', (e) => {
            const checked = e.target.checked;
            if (!checked) {
                this.#remove(optionEntry);
            } else if (this.#isCheckbox) {
                this.#add(optionEntry);
            } else {
                this.#set(optionEntry);
            }
        });
    }

    #set(optionEntry) {
        this.#current = [optionEntry];
        this.#binder.updateData({ ['value']: this.#current }, false);
    }

    #add(optionEntry) {
        this.#current.push(optionEntry);
        this.#binder.updateData({ ['value']: this.#current }, false);
    }

    #remove(optionEntry) {
        this.#current = this.#current.filter(item => item.url !== optionEntry.url);
        this.#binder.updateData({ ['value']: this.#current }, false);
    }
}