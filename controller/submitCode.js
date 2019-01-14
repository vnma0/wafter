import Console from "console";
import { basename, extname } from "path";

import kon from "../config/kon";
import server from "../config/server";
import { submitCode, updateSubmission } from "../data/database";

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
export function reloadSubs() {
    kon.judgers.forEach((judger) => {
        judger.get().then(
            (coll) => {
                coll.forEach((sub) => {
                    const verdict = getVerdict(sub);
                    updateSubmission(
                        sub.id,
                        verdict,
                        sub.finalScore,
                        sub.tests
                    );
                });
            },
            () => {
                Console.log("Cannot get result");
            }
        );
    });
}

/**
 * Calculate minutes between startTime and now
 * Especially used for calculating ACM
 * @returns {Number} Minutes
 */
function getMinuteSpan() {
    const diff = new Date() - server.contest.startTime;
    return Math.floor(diff / 1000 / 60);
}

/**
 * Add submission to database then send part of it to Judger
 * @param {PathLike} source_code_path Path to source code
 * @param {String} user_id User's ID
 * @param {String} prob_name file's name
 */
export async function sendCode(source_code_path, user_id, prob_name) {
    prob_name = prob_name.toUpperCase();

    // TODO: Create lang map
    const prob_ext = extname(prob_name);
    const prob_id = basename(prob_name, prob_ext);

    if (!server.contest.probList.includes(prob_name)) throw "Invalid prob_id";

    const availJudger = kon.judgers.filter((kon) =>
        kon.probList.includes(prob_name)
    );

    // TODO: Handle empty availJudger

    try {
        const sub_id = await submitCode(
            source_code_path,
            user_id,
            prob_id,
            getMinuteSpan()
        );

        if (availJudger.length === 1)
            availJudger[0].send(source_code_path, prob_name, sub_id);
        else {
            const qPromise = availJudger.map((judger) => judger.qLength());

            const judgersQ = await Promise.all(qPromise);
            const judgerNum = judgersQ
                .map((val, iter) => [val, iter])
                .filter((v) => v[0])
                .sort()
                .shift()[1];
            const judger = kon.judgers[judgerNum];

            judger.send(source_code_path, prob_name, sub_id);
        }

        // Temporary trigger
        setTimeout(() => reloadSubs(), 100);
    } catch (err) {
        throw err;
    }
}
