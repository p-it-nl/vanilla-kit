class MockElement {
    constructor() {
        this._style = {};
        this._classes = new Set();
        this._attributes = {};
    }

    setAttribute(attr, val) {
        this._attributes[attr] = val;
    }

    getAttribute(attr) {
        return this._attributes[attr] ?? null;
    }

    removeAttribute(attr) {
        delete this._attributes[attr];
    }

    hasChildNodes() {
        return false;
    }

    get style() {
        return this._style;
    }

    set style(val) {
        this._style = val;
    }

    get classList() {
        return {
            add: (...names) => names.forEach(n => this._classes.add(n)),
            remove: (...names) => names.forEach(n => this._classes.delete(n)),
            contains: (name) => this._classes.has(name),
            isEmpty: () => this._classes.size === 0
        };
    }
}

export default MockElement;