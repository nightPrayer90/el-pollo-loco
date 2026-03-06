class IntervalHub {
    static ALLINTERVALS = [];

    static startInterval(func, timer) {
        const newInterval = setInterval(func, timer);
        IntervalHub.ALLINTERVALS.push(newInterval);
        return newInterval;
    }

    static stopIntervals() {
        IntervalHub.ALLINTERVALS.forEach(clearInterval);
        IntervalHub.ALLINTERVALS = [];
    }

    static stopInterval(id) {
    clearInterval(id);
    console.log("aus!");
    }
}
