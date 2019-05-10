"use strict";

const Console = require("console");
const { basename, extname } = require("path");

const kon = require("../config/kon");
const contest = require("../config/contest");
const { newSubmission, updateSubmission } = require("../data/database");

/**
 * Parse Submission from kon.js for verdict
 * @param {Submission} sub Submission from kon.js
 * @returns {String} verdict
 */
function getVerdict(sub) {
    const tests = sub.tests;

    let verdict = "AC";
    if (tests)
        tests.some((x) => {
            if (x.verdict !== "AC") {
                verdict = x.verdict;
                return true;
            }
        });
    else verdict = "CE";

    return verdict;
}

/**
 * Update submission status from log from kons'
 */
function reloadAllSubs() {
    kon.judgers.forEach(reloadSub);
}

/**
 * Update submission status from log from kon
 * @param {Judger} judger Kon, ...etc
 */
function reloadSub(judger) {
    judger
        .get()
        .then((coll) => {
            coll.forEach((sub) => {
                const verdict = getVerdict(sub);
                updateSubmission(
                    sub.id,
                    verdict,
                    sub.finalScore,
                    sub.tests
                ).catch((err) => Console.log(err.message));
            });
        })
        .catch((err) => {
            Console.log(
                `Cannot get result from Kon [${judger.serverAddress}]: ${
                    err.message
                }`
            );
        });
}

/**
 * Calculate minutes between startTime and now
 * Especially used for calculating ACM
 * @returns {Number} Minutes
 */
function getMinuteSpan() {
    const diff = new Date() - contest.startTime;
    return Math.floor(diff / 1000 / 60);
}

/**
 * Add submission to database then send part of it to Judger
 * @param {PathLike} source_code_path Path to source code
 * @param {String} user_id User's ID
 * @param {String} prob_name file's name
 */
async function sendCode(source_code_path, user_id, prob_name) {
    prob_name = prob_name.toUpperCase();

    const prob_ext = extname(prob_name);
    const prob_id = basename(prob_name, prob_ext);
    try {
        if (contest.probList.indexOf(prob_id) === -1)
            throw new Error("Invalid prob_id");

        const availJudger = kon.judgers.filter(
            (kon) => kon.probList.indexOf(prob_id) > -1
        );

        // Handle empty availJudger
        if (!availJudger.length) throw new Error("No available Kon");

        const sub_id = await newSubmission(
            source_code_path,
            user_id,
            prob_id,
            getMinuteSpan(),
            prob_ext
        );

        let judger;

        if (availJudger.length === 1) judger = availJudger[0];
        else {
            const qPromise = availJudger.map((judger) => judger.qLength());

            const judgersQ = await Promise.all(qPromise);

            const availKon = judgersQ
                .map((val, iter) => [val, iter])
                .filter((v) => !isNaN(v[0]));

            if (!availKon.length) throw new Error("All kon are busy");

            Console.log("Kons' queue: ", availKon);
            const judgerNum = availKon.sort((a, b) => a[0] - b[0]).shift()[1];
            judger = kon.judgers[judgerNum];
        }

        let retry = 3;
        let offset = 30000;
        let delay = 30000;
        let timeout = 105000;

        judger
            .send(source_code_path, prob_name, sub_id)
            .then((res) => {
                if (res.status !== 200) throw Error("Cannot get from Kon");

                // Attempt & retry 3 times to get submission
                for (let attempt = 0; attempt < retry; attempt++) {
                    let time = offset + attempt * delay;
                    if (time < timeout) setTimeout(reloadSub, time, judger);
                }
                // Set "Timeout" status on submission after timeout
                // Print error if submission updated before timeout
                let callTimeout = () =>
                    updateSubmission(sub_id, "Timeout", null).catch((err) =>
                        Console.log(err.message)
                    );
                setTimeout(callTimeout, timeout);
            })
            .catch((err) => {
                Console.log(err.message);
                updateSubmission(sub_id, "Cannot judge", null);
            });
    } catch (err) {
        Console.log(err.message);
    }
}

module.exports = {
    reloadAllSubs,
    reloadSub,
    sendCode
};
