/**
 * Calculate result
 * @param {Submission} submission Submission given by database.js
 */
function calc(submission) {
    return {
        pri: submission.score,
        sec: submission.status
    };
}

/**
 * Sort by score
 * @param {Submission} a
 * @param {Submission} b
 */
function sort(a, b) {
    return b.score - a.score;
}

const acceptedStatus = ["AC", "MLE", "TLE", "RTE", "WA"];

export default {
    calc,
    sort,
    acceptedStatus
};
