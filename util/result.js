import { bestSubmission, readAllUser } from "../data/database";
import score from "./score";
import contest from "../config/contest";

/**
 * Output correct result
 * Score and Scoreboard use this
 * @param {String} user_id User's ID
 * @param {String} prob_id Problem's ID
 */
async function GetProblemBestResult(user_id, prob_id) {
    const ctype = score[contest.mode];
    const bestResult = await bestSubmission(user_id, prob_id, ctype);
    const result = bestResult
        ? ctype.calc(bestResult)
        : { pri: null, sec: null };
    return result;
}

/**
 * Get all result of an user
 * @param {String} user_id User's ID
 * @param {Array} prob_list Problem list
 */
async function GetTotalResult(user_id, prob_list) {
    const resultPromises = prob_list.map((prob_id) =>
        GetProblemBestResult(user_id, prob_id)
    );
    const totalResult = await Promise.all(resultPromises);
    const result = totalResult.reduce((map, obj, idx) => {
        map[prob_list[idx]] = obj;
        return map;
    }, {});

    return result;
}

/**
 * Get all result from all user
 * Created for Scoreboard
 * @param {String} user_id User's ID
 * @param {Array} prob_list Problem list
 */
async function GetAllResult(prob_list) {
    const users = await readAllUser();
    const getAll = await Promise.all(
        users.map((x) => GetTotalResult(x.username, prob_list))
    );

    const result = getAll.reduce((map, obj, idx) => {
        map[users[idx].username] = obj;
        return map;
    }, {});

    return result;
}

export default {
    GetAllResult,
    GetTotalResult,
    GetProblemBestResult
};
