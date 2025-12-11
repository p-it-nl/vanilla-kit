/**
 * Handler interface providind minimal support for handlers to function
 */
export class Handler {

    /**
     * Returns true if this handler applies to the element
     * @param {HTMLElement} element - the element to check
     * @returns {boolean} true if the element applies
     */
    static ifFor(element) {
        throw new Error('ifFor must be implemented by subclass');
    }

    /**
     * Update the element from the Binder's data.
     * @param {*} value - the value to render with
     */
    render(value) {
        throw new Error('render must be implemented by subclass');
    }
}
