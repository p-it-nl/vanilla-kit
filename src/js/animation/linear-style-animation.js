import { Animation } from './animation.js';

/**
 * A linear animation that animates any style property linearly.
 *
 * Examples:
 *   new LinearStyleAnimation(0, 100, 'px', Animation.speed.medium, Animation.direction.left)
 *       .execute(myDiv);
 *
 * @see Animation
 */
export class LinearStyleAnimation extends Animation {
    #startValue;
    #endValue;
    #unit;
    #speed;
    #direction;
    #reverseWhenFinished;

    #elems;
    #currentValue;
    #resolve;

    #duration; // ms, derived from distance/speed
    #startTime;

    /**
     * @param {number} startValue
     * @param {number} endValue
     * @param {string} unit - CSS unit (default `%`)
     * @param {number} speed - Animation.speed constant (pixels or % per frame at 60fps equivalent)
     * @param {string} direction - Animation.direction constant or custom CSS property
     * @param {boolean} reverseWhenFinished
     */
    constructor(startValue, endValue, unit, speed, direction, reverseWhenFinished) {
        super();

        this.#startValue = startValue ?? 0;
        this.#endValue = endValue ?? 100;
        this.#unit = unit ?? Animation.unit.perc;
        this.#speed = speed ?? Animation.speed.medium;
        this.#direction = direction ?? Animation.direction.left;
        this.#reverseWhenFinished = reverseWhenFinished ?? false;

        this.#currentValue = this.#startValue;
    }

    /**
     * @see Animation.execute
     */
    execute(...el) {
        this.#elems = el;

        const distance = Math.abs(this.#endValue - this.#startValue);
        this.#duration = (distance / this.#speed) * 16;

        if (this.#currentValue === this.#endValue && this.#reverseWhenFinished) {
            [this.#startValue, this.#endValue] = [this.#endValue, this.#startValue];
        }

        return new Promise(this.#animate.bind(this));
    }

    #animate(resolve, reject) {
        this.#resolve = resolve;
        if (!this.#elems?.every(e => e instanceof Element)) {
            reject('No valid elements provided, valid are elements of type Element');
        } else {
            this.#startTime = null;
            requestAnimationFrame(this.#step.bind(this));
        }
    }

    #step(timestamp) {
        if (!this.#startTime) this.#startTime = timestamp;
        const elapsed = timestamp - this.#startTime;

        const progress = Math.min(elapsed / this.#duration, 1);
        this.#currentValue =
            this.#startValue + (this.#endValue - this.#startValue) * progress;

        this.#applyStyle(this.#currentValue);

        if (progress >= 1) {
            this.#resolve(Math.round(this.#currentValue));
        } else {
            requestAnimationFrame(this.#step.bind(this));
        }
    }

    #applyStyle(value) {
        const prop = this.#getPropertyName();
        this.#elems.forEach((e) => {
            e.style[prop] = `${Math.round(value)}${this.#unit}`;
        });
    }

    #getPropertyName() {
        switch (this.#direction) {
            case Animation.direction.top: return 'top';
            case Animation.direction.left: return 'left';
            case Animation.direction.right: return 'right';
            case Animation.direction.bottom: return 'bottom';
            default: return this.#direction;
        }
    }
}