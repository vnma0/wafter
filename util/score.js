/**
 * Calculate final result from judger's result, ACM style
 * @param {JSON} result : judger's result file
 * @param {number} initial_penalty : total penalty from previous submisions
 * @param {number} submmission_time : the moment of submission from the beginning of contest, calculated by minutes
 * @returns {object} : final result
 */

export function ACM(result, initial_penalty, submission_time) {
    let ans = new Object(),
        verdict = "AC",
		partial_result = result.tests;
		
    ans.id = result.id;
    ans.problem = result.problem;
	ans.penalty = initial_penalty;
	
    for (let i = 0; i < partial_result.size; i++) {
        if (partial_result[i].verdict != "AC") {
            verdict = partial_result[i].verdict;
            break;
        }
    }
	ans.verdict = verdict;
	
    if (verdict === "AC") ans.penalty += submission_time;
    else ans.penalty += 20;
    return ans;
}

/**
 * Calculate final result from judger's result, OI style
 * @param {JSON} result : judger's result file
 * @returns {object} : final result
 */

export function OI(result) {
    let ans = new Object(),
        verdict = "AC",
		partial_result = result.tests;
		
    ans.id = result.id;
    ans.problem = result.problem;
	ans.score = result.finalScore;
	
    for (let i = 0; i < partial_result.size; i++) {
        if (partial_result[i].verdict != "AC") {
            verdict = partial_result[i].verdict;
            break;
        }
    }
	ans.verdict = verdict;
	
    return ans;
}
