import { bestSubmission, readAllUser, readUserByID } from "../data/database";
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
async function GetUserResult(user_id, prob_list) {
    const user = readUserByID(user_id);
    const resultPromises = prob_list.map((prob_id) =>
        GetProblemBestResult(user_id, prob_id)
    );
    const totalResult = await Promise.all(resultPromises);
    const getAll = totalResult.reduce((map, obj, idx) => {
        map[prob_list[idx]] = obj;
        return map;
    }, {});

    const result = {};
    const username = (await user).username;
    result[username] = getAll;

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
    const result = await Promise.all(
        users.map((x) => GetUserResult(x.user_id, prob_list))
    );

    return result;
}

/**
 * Generate scoreboard
 * @param {String} user_id User's ID
 * @param {Array} prob_list Problem list
 */
async function scoreboard(user_id) {
    const ctype = score[contest.mode];
    if (ctype.allowScoreboard) return GetAllResult(contest.probList);
    else return GetUserResult(user_id, contest.probList).then((v) => [v]);
}

export default scoreboard;
