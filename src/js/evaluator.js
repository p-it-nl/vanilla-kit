/**
 * Evaluates expressions and paths 
 */
export default class Evaluator {

    #operators = ['===', '!==', '==', '!=', '>', '<'];
    #shown = 'shown';

    /**
     * Evaluate conditional directives on a single element based on current data.
     * Supported attributes:
     * - show-if: expression, toggles element visibility
     * - class-if: expression:className, adds/removes class based on truthiness
     * Restricted expressions to prevent XXS or code injection, currently limited to: : ===, ==, !==, !=, >, <
     *  
     * @param {HTMLElement} el - element to process
     * @param {Object} data - current data context
     */
    evaluateConditions(el, data) {
        if (el && data && (typeof data !== 'object' || Object.keys(data).length > 0)) {
            const showIf = el.getAttribute('show-if');
            const classIf = el.getAttribute('class-if');

            if (showIf !== null) {
                if (this.evaluateExpression(showIf, data)) {
                    el.classList.add(this.#shown);
                } else {
                    el.classList.remove(this.#shown);
                }
            }

            if (classIf !== null) {
                const [expr, classNames] = classIf.split(':');
                const names = classNames.split(/\s+/);

                if (this.evaluateExpression(expr, data)) {
                    names.forEach(name => el.classList.add(name));
                } else {
                    names.forEach(name => el.classList.remove(name));
                }
            }
        } else {
            // not an element with data to evaluate
        }
    }

    /**
     * Evaluate conditional directives on all elements within given element including the element

     * @param {HTMLElement} el - element to process including children
     * @param {Object} data - current data context
     */
    evaluateConditionsWithin(el, data) {
        if (el) {
            this.evaluateConditions(el, data);

            const nodes = el.querySelectorAll('[show-if], [class-if]');
            nodes.forEach(node => this.evaluateConditions(node, data));
        }
    }

    /**
     * Evaluate a simple conditional expression against a data object.
     * Supported operators: ===, ==, !==, !=, >, <
     * Example: "status[0].label === 'Afgenomen'"
     *
     * @param {string} expr - Expression to evaluate
     * @param {Object} data - Data object to resolve values from
     * @returns {boolean} Result of the expression
     */
    evaluateExpression(expr, data) {
        const operator = this.#determineOperator(expr);
        if (!operator) return false;

        const [lhs, rhs] = expr.split(operator).map(s => s.trim());
        const leftVal = this.resolvePath(data, lhs);
        const rightVal = this.#parseLiteral(rhs);

        switch (operator) {
            case '===': return leftVal === rightVal;
            case '==': return leftVal == rightVal;
            case '!==': return leftVal !== rightVal;
            case '!=': return leftVal != rightVal;
            case '>': return leftVal > rightVal;
            case '<': return leftVal < rightVal;
            default: return false;
        }
    }

    /**
     * Resolve a path string into a value from an object.
     * Example: resolvePath(data, "status[0].label")
     *
     * @param {Object} obj - Object to resolve the path against
     * @param {string} path - Dot/bracket notation path
     * @returns {*} Resolved value or undefined
     */
    resolvePath(obj, path) {
        try {
            return path
                .replace(/\[(\w+)\]/g, '.$1')
                .split('.')
                .reduce((acc, key) => acc?.[key], obj);
        } catch {
            return undefined;
        }
    }

    /* or do shorter version? get rid of regex
    getByPath(obj, path) {
    return path.split('.').reduce((o, k) => o?.[k], obj);
    }
    */

    #determineOperator(expr) {
        for (const op of this.#operators) {
            if (expr.includes(op)) return op;
        }
        return null;
    }

    #parseLiteral(value) {
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            return value.slice(1, -1);
        }
        if (!isNaN(Number(value))) return Number(value);
        if (value === 'true') return true;
        if (value === 'false') return false;
        return value;
    }
}
