
/**
 * Helper for generating html
 */
export default class HtmlHelper {

    /**
     * Makes an element editable on double-click and restores readonly on blur or click-away.
     * Supports contentEditable elements and paired input elements.
     * @param {HTMLElement} el - The element to make editable
     */
    static makeEditable(el) {
        if (el && el instanceof HTMLElement) {
            const isContentEditable = (el.hasAttribute('contentEditable') || el.isContentEditable);
            const toggleEditing = isContentEditable
                ? this.#buildContentEditableEvent(el)
                : this.#buildInputEditableEvent(el);
            el.addEventListener('dblclick', toggleEditing);
        }

        // Non-element objects are ignored
    }

    static #buildContentEditableEvent(el) {
        return () => {
            el.contentEditable = 'true';
            el.focus();

            const cleanup = () => {
                el.contentEditable = 'false';
                document.removeEventListener('mousedown', onOut);
                el.removeEventListener('blur', onBlur);
            };

            const onOut = (event) => {
                if (!el.contains(event.target)) cleanup();
            };

            const onBlur = () => cleanup();

            document.addEventListener('mousedown', onOut);
            el.addEventListener('blur', onBlur);
        };
    }

    static #buildInputEditableEvent(el) {
        return () => {
            const inputEl = el.parentElement.querySelector('[when-editing]');
            el.classList.add('editing');
            inputEl.classList.add('editing');
            inputEl.focus();

            const cleanup = () => {
                el.classList.remove('editing');
                inputEl.classList.remove('editing');
                document.removeEventListener('mousedown', onOut);
                inputEl.removeEventListener('blur', onBlur);
            };

            const onOut = (event) => {
                if (!inputEl.contains(event.target)) cleanup();
            };

            const onBlur = () => cleanup();

            document.addEventListener('mousedown', onOut);
            inputEl.addEventListener('blur', onBlur);
        }
    }
}
