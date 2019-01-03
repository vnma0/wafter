import { readUserSubmission } from "../data/database";

/**
 * Calculate final result from judger's result, ACM style
 * @param {JSON} result : judger's result file
 * @param {number} initial_penalty : total penalty from previous submisions
 * @param {number} submmission_time : the moment of submission from the beginning of contest, calculated by minutes
 * @returns {object} : final result
 */

export async function ACM(result) {
    let ans = {},
        { user_id, prob_id } = result,
        sub = await getLastSatisfiedSubmission(user_id, prob_id), 
        cnt1 = countToStatisfied(result.id) * 20, 
        cnt2 = countToStatisfied(sub.id) * 20;

    ans.id = result.id;
    ans.problem = result.problem;
    if (result.status === "AC") {
        if (sub.status === "AC")
            ans.penalty = min(
                result.date + cnt1, 
                sub.date + cnt2
            );
        else {
            ans.penalty = result.date + cnt1;
        }
    }
    else {
        if(sub.status === "AC") ans.penalty = sub.date + cnt2;
        else ans.penalty = max(result.date, sub.date);
    }
    
    return ans;
}

/**
 * Calculate final result from judger's result, OI style
 * @param {JSON} result : judger's result file
 * @returns {object} : final result
 */

export function OI(result) {
    let ans = {},
        verdict = "AC",
        partial_result = result.tests;

    ans.id = result.id;
    ans.problem = result.problem;
    ans.score = result.finalScore;

    partial_result.some((x, i, arr) => {
        if (x !== "AC") {
            verdict = arr[i];
            return true;
        }
    });

    return ans;
}
