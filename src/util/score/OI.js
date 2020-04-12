"use strict";

/**
 * Calculate result
 * @param {Submission} submission Submission given by database.js
 * @returns {Object} : final result
 */
function calc(submission) {
    return {
        pri: submission.score,
        sec: submission.status
    };
}

/**
 * Sort by score
 * bestSubmission use this to sort
 * @param {Submission} a
 * @param {Submission} b
 */
function sortSub(a, b) {
    return b.score - a.score;
}

/**
 * Sort by ACed problem, then penalty
 * @param {Score} a
 * @param {Score} b
 */
function sortFun(a, b) {
    return b.score - a.score;
}

module.exports = {
    calc,
    sortSub,
    allowScoreboard: true,
    sortFun
};
