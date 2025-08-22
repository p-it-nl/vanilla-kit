
/**
 * Helper for generating html
 */
export default class HtmlHelper {

    /**
     * Makes an element editable on double-click and restores readonly on blur or click-away.
     * @param {HTMLElement} el - The element to make editable
     */
    static makeEditable(el) {
        if (!el) return;

        el.addEventListener('dblclick', () => {
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
        });
    }
}
