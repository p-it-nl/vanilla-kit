
/**
 * A animation on a element
 */
export class Animation {

    static unit = {
        px: 'px',
        perc: '%'
    }

    static speed = {
        slow: 2,
        medium: 4,
        fast: 7
    }

    static direction = {
        top: 'top',
        right: 'right',
        bottom: 'bottom',
        left: 'left'
    }

    /**
     * @param {*} value property of a style component e.g. 10, 10px, 10% 
     * @returns the numeric value for the property
     */
    static fromProperty(value) {
        return +value.replace('%', '').replace('px', '');
    }

    /**
     * Constructs a new animation
     *  
     * FUTURE_WORK: support animation types like bounce, interval, loop etc... currenly the animation is linear at a linear speed
     * 
     * @param {number} startValue the value of the property (based on direction) to start with, default 0
     * @param {number} endValue the value of the property at the end of the animation, default 100
     * @param {string} unit the unit of measurement to use @see Animation.unit, default %
     * @param {number} speed the speed of the animation @see Aninimaton.speed, default Animaton.speed.medium
     * @param {string} direction the direction to animate to @see Animation.direction, default Animation.speed.left
     * @param {boolean} reverseWhenFinished if true, will reverse the animation from endValue to startValue when the animation runs the next time, continuously, default false
     */
    constructor(startValue, endValue, unit, speed, direction, reverseWhenFinished) {
        // interface
    }


    /**
     * Run the animation on elements
     * @param {...HTMLElement} el
     * @return {Promise<number>} resolves with the final value
     */
    execute(...el) {
        // interface
    }
}