import zipdir from "zip-dir";
import isZip from "is-zip";
import Console from "console";
import { basename, extname } from "path";

import kon from "../config/kon";
import { submitCode } from "../data/database";
import { updateSubmission } from "../data/database";
import server from "../config/server";

const Judgers = kon.judgers;

/**
 * Zip task folder then send it to Judgers
 */
export function initJudger() {
    const arcPath = "Tasks.zip";
    zipdir(kon.tasks, { saveTo: arcPath }, (err, buf) => {
        if (err) throw err;
        if (!isZip(buf)) throw Error("Invalid folder");
        Judgers.forEach((judger) => {
            judger.clone(arcPath).then(
                (boo) => {
                    if (!boo) throw Error();
                    Console.log(`Sucessfully cloned ${judger.serverAddress}]`);
                },
                () => {
                    Console.log(`Failed to clone ${judger.serverAddress}`);
                }
            );
        });
    });
}

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
    Judgers.forEach((judger) => {
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
    try {
        prob_name = prob_name.toUpperCase();
        const prob_id = basename(prob_name, extname(prob_name));
        const sub_id = await submitCode(
            source_code_path,
            user_id,
            prob_id,
            getMinuteSpan()
        );
        const qPromise = Judgers.map((judger) => judger.qLength());

        const judgersQ = await Promise.all(qPromise);
        const judgerNum = judgersQ
            .map((val, iter) => [val, iter])
            .sort()
            .shift()[1];
        const judger = Judgers[judgerNum];

        judger.send(source_code_path, prob_name, sub_id).catch((err) => {
            throw err;
        });
        setTimeout(() => reloadSubs(), 100);
    } catch (err) {
        throw err;
    }
}