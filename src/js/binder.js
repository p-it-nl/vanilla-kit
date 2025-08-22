/**
 * Binder
 *
 * Features:
 * - Scans a container for elements with `bind` attributes.
 * - Sets up two-way binding between data object and DOM elements.
 * - Supports textContent, input `value`, and contentEditable fields.
 * - Removes `bind` attributes from DOM after initialization (what remains is valid HTML based on HTLM specifications).
 * - Keeps internal map of key -> bound elements for fast sync updates.
 * - Allows explicit `render()` to refresh DOM from programmatic data changes
 * - Explicit `setData()` / `getData()` API for external integration.
 *
 * Future improvements:
 * - Support binding to element attributes (e.g., `src`, `href`, `class`)
 * - Add formatters or value transformers per binding (e.g., uppercase, currency)
 * - Collection binding: repeat templates for array data (`for`-like behavior)
 * - Add unit tests
 */
export default class Binder {

    #container;
    #data = {};
    #bindings = new Map();

    constructor(container, data = {}) {
        this.#container = container;
        this.#data = data;
    }

    /**
     * Scan container for bind attributes and set up two-way binding
     */
    bind() {
        const elements = this.#container.querySelectorAll('[bind]');

        elements.forEach(el => {
            const key = el.getAttribute('bind');
            el.removeAttribute('bind');

            if (!this.#bindings.has(key)) {
                this.#bindings.set(key, []);
            }
            this.#bindings.get(key).push(el);

            this.#attachListener(el, key);
        });

        this.render();
    }

    /**
     * Explicitly re-render all elements from current data
     */
    render() {
        for (const [key, els] of this.#bindings.entries()) {
            const value = this.#data[key];
            els.forEach(el => this.#updateElement(el, value));
        }
    }

    /**
     * Update bound data object (no auto-render, explicit only)
     */
    setData(data) {
        this.#data = data;
    }

    /**
     * Get current bound data object
     */
    getData() {
        return this.#data;
    }

    #attachListener(el, key) {
        const updateData = () => {
            const value = this.#getElementValue(el);
            this.#data[key] = value;

            this.#bindings.get(key).forEach(other => {
                if (other !== el) {
                    this.#updateElement(other, value);
                }
            });
        };

        el.addEventListener('input', updateData);
    }

    #updateElement(el, value) {
        if (el.isContentEditable) {
            el.textContent = value ?? '';
        } else if ('value' in el) {
            el.value = value ?? '';
        } else {
            el.textContent = value ?? '';
        }
    }

    #getElementValue(el) {
        if (el.isContentEditable) return el.textContent;
        if ('value' in el) return el.value;
        return el.textContent;
    }
}
