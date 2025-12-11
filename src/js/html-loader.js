/**
 * HTMLLoader
 * 
 * Caches and serves HTML template files to prevent redundant fetch requests.
 * Designed for reuse across multiple custom elements or components.
 */
class HTMLLoader {

    /** @type {Map<string, Promise<string>>} */
    #cache = new Map();

    /**
     * Loads an HTML file, returning a cached version if previously requested.
     * Subsequent calls with the same path reuse the stored Promise to avoid duplicate fetches.
     *
     * @param {string} path - Relative or absolute path to the HTML file.
     * @returns {Promise<string>} Resolves with the HTML text content.
     * @throws {Error} If the fetch operation fails or the response is not OK.
     */
    async load(path) {
        if (this.#cache.has(path)) {
            return this.#cache.get(path);
        }

        const promise = fetch(path)
            .then(res => {
                if (!res.ok) throw new Error(`Failed to load HTML: ${path}`);
                return res.text();
            })
            .then(text => {
                this.#cache.set(path, Promise.resolve(text));
                return text;
            });

        this.#cache.set(path, promise);

        return promise;
    }
}

/** Singleton instance shared across components */
export default new HTMLLoader();
