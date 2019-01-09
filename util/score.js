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
    let lastSub = await readLastSatisfy(result.id), //first AC submission, or last submission
        currSub = await readSubmission(result.id), //current submission
        begin_time = server.contest.startTime, //starting time of the contest
        curr = currSub.date, //timestamp of current submission
        curr_diff = curr - begin_time; //elapsed time of current submission, in millisecond

    let status = {
        score: result.finalScore,
        partial_result: result.tests //result of each test cases
    };

    if (lastSub === {}) {
        //converting to minutes
        curr_diff -= curr_diff % 60000;
        curr_diff /= 60000;

        /*
            Edge case: If there's no previous submission, aka this is
            the first submission, the result, by definition, is this submission.
        */
        status.penalty = curr_diff;
        if (result.status !== "AC") status.penalty += 20;

        return status;
    }

    let last = lastSub.date, //timestamp of last submission
        last_diff = last - begin_time; //elapsed time of last submision

    //converting to minutes
    last_diff -= last_diff % 60000;
    last_diff /= 60000;
    curr_diff -= curr_diff % 60000;
    curr_diff /= 60000;

    //additional penalty of previous unsuccessful attemps
    let cnt1 = countToSatisfy(result.id) * 20,
        cnt2 = countToSatisfy(lastSub._id) * 20;

    if (result.status === "AC") {
        //if both of the submission is accepted, pick the smaller one, aka the former one
        if (lastSub.status === "AC")
            status.penalty = Math.min(curr_diff + cnt1, last_diff + cnt2);
        //else, it must be current submisison
        else status.penalty = curr_diff + cnt1;
    } else {
        //if the previous one is accepted, take it
        if (lastSub.status === "AC") status.penalty = last_diff + cnt2;
        //else, pick the larger one, aka the later one
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

    //get the first failed test's verdict, if there's any
    partial_result.some((x, i, arr) => {
        if (x !== "AC") {
            verdict = arr[i];
            return true;
        }
    });

    let status = {
        partial_result: partial_result, //result of each test cases
        score: result.finalScore, //final score
        verdict: verdict //final verdict
    };

    return status;
}
