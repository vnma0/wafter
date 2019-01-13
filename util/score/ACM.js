/**
 * Calculate final result from judger's result, ACM style
 * @param {ReturnSubmission} sub
 * @returns {Object} : final result
 */
function calc(sub) {
    const penalty =
        sub.status === "AC"
            ? sub.tpen + (sub.attempt - 1) * 20
            : null;

    return {
        pri: penalty,
        sec: sub.attempt
    };
}

/**
 * Sort by score
 * @param {Submission} a
 * @param {Submission} b
 */
function sort(a, b) {
    return a.tpen - b.tpen;
}

const acceptedStatus = ["AC"];

export default {
    calc,
    sort,
    acceptedStatus
};
