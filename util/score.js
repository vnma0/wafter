import {
    readUserSubmission,
    readLastSatisfy,
    countToSatisfy,
    readSubmission
} from "../data/database";

import server from "../config/server";

/**
 * Calculate final result from judger's result, ACM style
 * @param {JSON} result : judger's result file
 * @returns {object} : final result
 */

export async function ACM(result) {
    let lastSub = await readLastSatisfy(result.id),
        currSub = await readSubmission(result.id),
        begin_time = server.contest.startTime,
        curr = currSub.date,
        curr_diff = curr - begin_time;

    let status = {
        score: result.finalScore,
        partial_result: result.tests
    };

    if (lastSub === {}) {
        status.penalty = curr_diff;
        return status;
    }

    let last = lastSub.date,
        last_diff = last - begin_time;

    last_diff -= last_diff % 60000;
    last_diff /= 60000;
    curr_diff -= curr_diff % 60000;
    curr_diff /= 60000;

    let cnt1 = countToSatisfy(result.id) * 20,
        cnt2 = countToSatisfy(lastSub._id) * 20;

    if (result.status === "AC") {
        if (lastSub.status === "AC")
            status.penalty = Math.min(curr_diff + cnt1, last_diff + cnt2);
        else {
            status.penalty = curr_diff + cnt1;
        }
    } else {
        if (lastSub.status === "AC") status.penalty = last_diff + cnt2;
        else status.penalty = Math.max(curr_diff, last_diff);
    }

    return status;
}

/**
 * Calculate final result from judger's result, OI style
 * @param {JSON} result : judger's result file
 * @returns {object} : final result
 */

export function OI(result) {
    let verdict = "AC",
        partial_result = result.tests;

    partial_result.some((x, i, arr) => {
        if (x !== "AC") {
            verdict = arr[i];
            return true;
        }
    });

    let status = {
        partial_result: partial_result,
        score: result.finalScore,
        verdict: verdict
    };

    return status;
}
