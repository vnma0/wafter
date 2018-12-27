/**
 * Calculate final result from judger's result, ACM style
 * @param {JSON} result : judger's result file
 * @param {number} initial_penalty : total penalty from previous submisions
 * @param {number} submmission_time : the moment of submission from the beginning of contest, calculated by minutes
 * @returns {object} : final result
 */

export function ACM(result, initial_penalty, submission_time) {
    let ans = {},
        verdict = "AC",
        partial_result = result.tests;

    ans.id = result.id;
    ans.problem = result.problem;
    ans.penalty = initial_penalty;

    if (
        partial_result.some((x, i, arr) => {
            if (x !== "AC") {
                verdict = arr[i];
                return true;
            }
        })
    ) {
        ans.penalty += 20;
    } else {
        ans.penalty += submission_time;
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
