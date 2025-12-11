import HtmlHelper from '../html-helper.js';
import { Handler } from './handler.js';

/**
 * HandlerSelect
 *
 * Handles two-way binding for select-like elements using <template> structures.
 * Supports both single- and multi-select behavior.
 */
export class HandlerSelect extends Handler {

    #options;
    #current;
    #binder;
    #el;

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
        return el.querySelector('template#select-option') !== null;
    }

    /**
     * @see Handler.render()
     * @param {Array<Object>} value - Array of option objects
     */
    async render(value) {
        this.#options = value || this.#options;
        const template = this.#el.querySelector('template');
        const data = this.#binder.getData();
        this.#current = Array.isArray(data.value) ? [...data.value] : [];
        if (this.#binder.isNotSet(this.#current)) {
            this.#el.classList.add('not-set');
        } else {
            this.#el.classList.remove('not-set');
        }

        this.#renderSelect(this.#el, template, this.#options, (data.multi === true));
    }

    #renderSelect(el, template, items, multi = true) {
        const valueEl = el.parentElement.querySelector('#selected');
        const multiTpl = (multi ? document.querySelector('#multi') : undefined);

        this.#clearSelect(valueEl, el);

        if (this.#current && multiTpl) {
            for (const value of this.#current) {
                const newItem = this.#renderMultiSelectItem(value, multiTpl);
                valueEl.appendChild(newItem);
            }
        } else if(this.#current && this.#current[0]) {
            const currentObj = this.#current[0];
            valueEl.textContent = (currentObj.label ? currentObj.label : this.#current);
        }

        const currentLabels = new Set(this.#current.map(c => c.label));
        const availableItems = (items || []).filter(
            item => !currentLabels.has(item.label)
        );

        for (const optionEntry of availableItems) {
            const option = this.#renderOption(optionEntry, template);
            this.#addEvent(option, optionEntry, multiTpl);
            el.appendChild(option);
        }
    }

    #clearSelect(selectedField, el) {
        selectedField.innerHTML = '';
        for (const opt of el.querySelectorAll('.option')) {
            opt.remove();
        }
    }

    #renderOption(item, template) {
        const clone = template.content.cloneNode(true);
        for (const child of clone.querySelectorAll('[bind]')) {
            const key = child.getAttribute('bind');
            child.removeAttribute('bind');
            child.textContent = item[key] ?? '';
        }
        return clone;
    }

    #addEvent(option, optionEntry, multiTpl) {
        const optionEl = option.querySelector('.option');
        optionEl.addEventListener('click', () => {
            if (multiTpl) {
                this.#add(optionEntry);
                optionEl.remove();
            } else {
                this.#set(optionEntry);
                HtmlHelper.stopEditing();
            }
        });
    }

    #renderMultiSelectItem(optionEntry, multiTpl) {
        const newItem = multiTpl.content.cloneNode(true);
        const valueSpan = newItem.querySelector('[bind="value"]');
        if (valueSpan) {
            valueSpan.textContent = optionEntry.label;
        }
        const removeBtn = newItem.querySelector('.remove');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                const wrapper = removeBtn.closest('.selected-wrapper');
                wrapper.remove();
                this.#remove(optionEntry);
            });
        }
        return newItem;
    }

    #set(optionEntry) {
        this.#current = [optionEntry];
        this.#binder.updateData({ ['value']: this.#current }, true);
    }

    #add(optionEntry) {
        this.#current.push(optionEntry);
        this.#binder.updateData({ ['value']: this.#current }, true);
    }

    #remove(optionEntry) {
        this.#current = this.#current.filter(item => item.url !== optionEntry.url);
        this.#binder.updateData({ ['value']: this.#current }, true);
    }
}