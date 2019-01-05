import {
    readUserSubmission,
    readLastSatisfy,
    countToSatisfy,
    readSubmission
} from "../data/database";

/**
 * Calculate final result from judger's result, ACM style
 * @param {JSON} result : judger's result file
 * @returns {object} : final result
 */

export async function ACM(result) {
    let lastSub = await readLastSatisfy(result.id);
    let currSub = await readSubmission(result.id);

    let status = {
        score: result.finalScore
    };

    if (lastSub === {}) {
        status.penalty = currSub.date;
        return status;
    }

    let cnt1 = countToSatisfy(result.id) * 20,
        cnt2 = countToSatisfy(lastSub._id) * 20;

    if (result.status === "AC") {
        if (lastSub.status === "AC")
            status.penalty = Math.min(currSub.date + cnt1, lastSub.date + cnt2);
        else {
            status.penalty = currSub.date + cnt1;
        }
    } else {
        if (lastSub.status === "AC") status.penalty = lastSub.date + cnt2;
        else status.penalty = Math.max(currSub.date, lastSub.date);
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
        score: result.finalScore,
        verdict: verdict
    };

    return status;
}
