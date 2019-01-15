/**
 * Calculate final result from judger's result, ACM style
 * @param {ReturnSubmission} sub Submission given by database.js
 * @returns {Object} : final result
 */
function calc(sub) {
    const penalty =
        sub.status === "AC" ? sub.tpen + (sub.attempt - 1) * 20 : null;

    return {
        pri: penalty,
        sec: sub.attempt
    };
}

/**
 * Sort by penalty
 * bestSubmission use this to sort
 * @param {Submission} a
 * @param {Submission} b
 */
function sort(a, b) {
    return a.tpen - b.tpen;
}

/**
 * Array of accepted Status
 * bestSubmission use this to filter what is "best"
 */
const acceptedStatus = ["AC"];

export default {
    calc,
    sort,
    acceptedStatus,
    allowScoreboard: true
};
