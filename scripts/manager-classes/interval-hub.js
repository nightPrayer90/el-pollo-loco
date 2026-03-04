class IntervalHub {
    static ALLINTERVALS = [];

    static startInterval(func, timer) {
        const newInterval = setInterval(func, timer);
        IntervalHub.ALLINTERVALS.push(newInterval);
    }

    static stopIntervals() {
        IntervalHub.ALLINTERVALS.forEach(clearInterval);
        IntervalHub.ALLINTERVALS = [];
    }
}
