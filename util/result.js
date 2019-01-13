import { bestSubmission } from "../data/database";
import score from "./score";
import server from "../config/server";

/**
 * Output correct result
 * Score and Scoreboard use this
 * @param {String} user_id User's ID
 * @param {String} prob_id Problem's ID
 */
export async function GetProblemBestResult(user_id, prob_id) {
    const ctype = score[server.contest.mode];
    const bestResult = await bestSubmission(user_id, prob_id, ctype);
    const result = bestResult
        ? ctype.calc(bestResult)
        : { pri: null, sec: null };
    return result;
}

/**
 *
 * @param {String} user_id User's ID
 * @param {Array} prob_list Problem list
 */
export async function GetTotalResult(user_id, prob_list) {
    const resultPromises = prob_list.map((prob_id) =>
        GetProblemBestResult(user_id, prob_id)
    );
    const totalResult = await Promise.all(resultPromises);
    return totalResult;
}
