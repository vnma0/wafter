import { bestSubmission } from "../data/database";

/**
 * Output correct result
 * Score and Scoreboard use this
 * @param {String} user_id User's ID
 * @param {String} prob_id Problem's ID
 * @param {ContestType} ctype Contest type
 */
export async function GetProblemBestResult(user_id, prob_id, ctype) {
    const bestResult = await bestSubmission(user_id, prob_id, ctype);
    return bestResult ? ctype.calc(bestResult) : null;
}

/**
 *
 * @param {String} user_id User's ID
 * @param {Array} prob_list Problem list
 * @param {ContestType} ctype Contest type
 */
export async function GetTotalResult(user_id, prob_list, ctype) {
    const resultPromises = prob_list.map((prob_id) =>
        GetProblemBestResult(user_id, prob_id, ctype)
    );
    const totalResult = await Promise.all(resultPromises);
    return totalResult;
}
