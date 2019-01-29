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

/**
 * Array of accepted Status
 * bestSubmission use this to filter what is "best"
 */
const acceptedStatus = ["AC", "MLE", "TLE", "RTE", "WA"];

module.exports = {
    calc,
    sortSub,
    acceptedStatus,
    allowScoreboard: true,
    sortFun
};
