import { HandlerCheck } from './handler-check.js';
import { HandlerDate } from './handler-date.js';
import { HandlerSelect } from './handler-select.js';

/**
 * Binder
 * 
 * A lightweight framework-free class for two-way data binding between a JavaScript object and DOM elements.
 *
 * Supports primitive elements (text, inputs, contentEditable) and specialized handlers (e.g., date, select) 
 * that encapsulate more complex behaviors.
 * 
 * Note:
 * Removes `bind` attributes from DOM after initialization (what remains is valid HTML based on HTLM specifications).
 * - Allows explicit `render()` to refresh DOM from programmatic data changes
 * - Explicit `setData()` / `getData()` API for external integration.
 *
 * Future improvements:
 * - Support binding to element attributes (e.g., `src`, `href`, `class`)
 * - Add formatters or value transformers per binding (e.g., uppercase, currency)
 * - Add unit tests
 */
export default class Binder {

    #container;
    #data = {};
    #bindings = new Map();
    #handlers = [];
    #isBound = false;
    #onUpdate = this.#defaultOnUpdate;

    /**
     * @param {HTMLElement} container - Root container to scan for bindable elements
     * @param {Object} data - Initial data object
     */
    constructor(container, data = {}) {
        this.#container = container;
        this.#data = data;
        this.#handlers = [
            HandlerDate,
            HandlerSelect,
            HandlerCheck
            // Add more handler classes as required
        ];
    }

    /**
     * Scan container (or provided elements) for bind attributes,
     * instantiate handlers or attach default listeners.
     *
     * @param {NodeList|HTMLElement[]} [elements] - Optional list of elements to bind
     */
    bind() {
        if (!this.#isBound) { // to prevent leaks, only bind once 
            this.#isBound = true;

            const elements = this.#container.querySelectorAll('[bind]');
            for (const el of elements) {
                const key = el.getAttribute('bind');
                const labelClass = this.#data.labelClass;
                if (key === 'key' && labelClass) {
                    el.className = `${el.className} ${labelClass}`;
                }
                el.removeAttribute('bind');

                const HandlerClass = this.#handlers.find(h => h.ifFor(el));
                if (HandlerClass) {
                    this.#addToBindings(key, new HandlerClass(this, el, key));
                } else {
                    this.#addToBindings(key, el);
                    this.#attachListener(el, key);
                }
            };

            this.render();
        }
    }

    /**
     * Explicitly re-render all elements from current data
     */
    render() {
        for (const [key, boundItems] of this.#bindings.entries()) {
            const value = this.#data[key];
            for (const item of boundItems) {
                if (typeof item.render === 'function') {
                    item.render(value);
                } else {
                    this.renderPrimitive(item, value);
                }
            }
        }
    }

    /**
     * Replace the full data object.
     *
     * @param {Object} data
     * @param {boolean} reRender - default true, if false then skips rerender (e.g. required to prevent selecthandler from resetting)
     */
    setData(data, reRender = true) {
        this.#data = data;
        if (reRender) {
            this.render();
        }
    }

    /**
     * Merge partial updates into the current data object.
     *
     * @param {Object} partial
     * @param {boolean} reRender - default true, if false then skips rerender (e.g. required to prevent selecthandler from resetting)
     */
    async updateData(partial, reRender = true) {
        const prev = { ...this.#data };
        const changes = {};
        for (const key in partial) {
            const oldValue = this.#data[key];
            const newValue = partial[key];
            if (oldValue !== newValue) {
                this.#data[key] = newValue;
                changes[key] = newValue;
            }
        }

        if (Object.keys(changes).length > 0) {
            Object.assign(this.#data, partial);
            try {
                await this.#onUpdate(this.#data, this.#container);
                if (reRender) {
                    this.render();
                }
            } catch (err) {
                // on update failed, rolling back
                this.#data = prev;
            }
        } else {
            // nothing changed, ignoring the update
        }
    }

    /**
     * Retrieve the current bound data object.
     * @returns {Object}
     */
    getData() {
        return this.#data;
    }

    /**
     * Set the function to send data updates to
     * @param {Function} onUpdate - The function to call when data is updated
     */
    setOnUpdate(onUpdate) {
        this.#onUpdate = onUpdate;
    }

    /**
     * @param {*} value the value to validate
     * @returns if the value has value
     */
    isNotSet(value) {
        return (
            value == null ||
            (typeof value === 'string' && !value.trim()) ||
            (Array.isArray(value) && value.length === 0) ||
            (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0)
        );
    }

    /**
     * Render a primitive value e.g. string, number
     * note: removes bind from el, this is in most cases already removed but 
     * it is a fallback removal for rendered templates and dynamic entries
     * @param {*} el the element to render
     * @param {*} value the value to render
     */
    renderPrimitive(el, value) {
        el.removeAttribute('bind');

        if (this.isNotSet(value)) {
            el.classList.add('not-set');
        } else {
            el.classList.remove('not-set');
        }

        if (Array.isArray(value)) {
            value = value
                .map(v => (v && typeof v === 'object' ? v.label : v))
                .join(', ');
        }

        if (el.getAttribute('type') === 'date') {
            value = new Date(value);
        }

        if ('value' in el) {
            el.value = value ?? '';
        } else {
            el.textContent = value ?? '';
        }
    }
    /*

    allow attribute binding and multiple bindings e.g.:
    <input bind="username:value">
    <div bind="username, username:title"></div>
    <div bind="username:name, username:value"></div>

    for (const bindEntry of el.getAttribute('bind').split(',')) {
        const [key, target] = bindEntry.split(':').map(s => s.trim());
        const value = this.#data[key];

        if (!target) {
            // default
            if ('value' in el) el.value = value ?? '';
            else el.textContent = value ?? '';
        } else {
            // explicit target
            if (target in el) el[target] = value ?? '';
            else el.setAttribute(target, value ?? '');
        }
    }
    */
    destroy() {
        for (const [key, boundItems] of this.#bindings.entries()) {
            for (const item of boundItems) {
                if (item instanceof HTMLElement) {
                    item.replaceWith(item.cloneNode(true)); // removes all listeners
                } else if (item?.destroy) {
                    item.destroy();
                }
            }
        }

        this.#bindings.clear();
        this.#handlers = [];
        this.#onUpdate = null;
    }

    #addToBindings(key, instance) {
        if (!this.#bindings.has(key)) {
            this.#bindings.set(key, []);
        }
        this.#bindings.get(key).push(instance);
    }

    #attachListener(el, key) {
        const updateData = () => {
            const value = this.#getElementValue(el);
            this.updateData({ [key]: value });

            for (const other of this.#bindings.get(key)) {
                if (other !== el) {
                    this.renderPrimitive(other, value);
                }
            }
        };

        // bind: 'input' for updates while typing
        el.addEventListener('blur', updateData);
    }

    #getElementValue(el) {
        return ('value' in el) ? el.value : el.textContent;
    }

    #defaultOnUpdate(partial) {
        console.log('Data updated, no update listener bound, partial:');
        console.log(partial);
    }
}