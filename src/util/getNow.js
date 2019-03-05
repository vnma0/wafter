/**
 * Get nearest '15 time
 */
const getNow = () => {
    const now = new Date();
    now.setMilliseconds(0);
    now.setSeconds(0);
    now.setMinutes((Math.ceil(now.getMinutes() / 5) + 1) * 5);
    return now;
};

module.exports = getNow;
