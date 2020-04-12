"use strict";

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
function sortSub(a, b) {
    return a.tpen - b.tpen;
}

/**
 * Sort by ACed problem, then penalty
 * @param {Score} a 
 * @param {Score} b 
 */
function sortFun(a, b) {
    if (a.aced !== b.aced) return b.aced - a.aced;
    else return a.score - b.score;
}

module.exports = {
    calc,
    sortSub,
    allowScoreboard: true,
    sortFun
};
