/**
 * @class
 * Central manager for handling all running intervals.
 */
export class IntervalHub {
    static ALLINTERVALS = [];

    /**
     * Starts a new interval and registers it in the hub.
     * @param {Function} func - Function executed each interval tick.
     * @param {number} timer - Interval duration in milliseconds.
     * @returns {number} The created interval ID.
     */
    static startInterval(func, timer) {
        const newInterval = setInterval(func, timer);
        IntervalHub.ALLINTERVALS.push(newInterval);
        return newInterval;
    }

    /**
     * Stops and clears all registered intervals.
     */
    static stopIntervals() {
        IntervalHub.ALLINTERVALS.forEach(clearInterval);
        IntervalHub.ALLINTERVALS = [];
    }

    /**
     * Stops a specific interval.
     * @param {number} id - Interval ID returned by setInterval.
     */
    static stopInterval(id) {
        clearInterval(id);
    }

}
